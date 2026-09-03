import { createDeepSeek } from "@ai-sdk/deepseek"
import { generateText, tool, isStepCount } from "ai"
import { config } from "@dotenvx/dotenvx"
import { createInterface } from "node:readline"
import { exec } from "node:child_process"
import { promisify } from "node:util"
import * as fs from "node:fs/promises"
import * as path from "node:path"
import { z } from "zod"

config({ path: ".env" })

const execAsync = promisify(exec)

/** @info - Types */
type Role = "user" | "assistant"
interface Message {
  role: Role
  content: string
}

/** @info - Message store (conversation history) */
const messages: Message[] = []

/** @info - Initialize deepseek provider */
const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY,
})

// ─── Tools ───────────────────────────────────────────────────────────────────

/**
 * Run any shell command on the user's machine.
 */
const runCommand = tool({
  description:
    "Execute any shell command on the user's machine and return stdout and stderr. " +
    "Use this for anything a terminal can do: git, npm, file operations, scripts, etc.",
  inputSchema: z.object({
    command: z.string().describe("The shell command to run"),
    cwd: z.string().optional().describe("Working directory. Defaults to process.cwd()"),
  }),
  execute: async ({ command, cwd }) => {
    console.log(`\n⚡ Running: ${command}${cwd ? ` (in ${cwd})` : ""}\n`)
    try {
      const { stdout, stderr } = await execAsync(command, {
        cwd: cwd ?? process.cwd(),
        shell: "powershell.exe",
        timeout: 60_000,
      })
      return { success: true, stdout: stdout.trim(), stderr: stderr.trim() }
    } catch (err: unknown) {
      const e = err as { stdout?: string; stderr?: string; message: string }
      return { success: false, stdout: e.stdout?.trim() ?? "", stderr: e.stderr?.trim() ?? e.message }
    }
  },
})

/**
 * Read a file from the filesystem.
 */
const readFile = tool({
  description: "Read the contents of a file at the given path.",
  inputSchema: z.object({
    filePath: z.string().describe("Absolute or relative path to the file"),
  }),
  execute: async ({ filePath }) => {
    console.log(`\n📖 Reading: ${filePath}\n`)
    try {
      const content = await fs.readFile(path.resolve(filePath), "utf-8")
      return { success: true, content }
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message }
    }
  },
})

/**
 * Write (or overwrite) a file.
 */
const writeFile = tool({
  description: "Write content to a file, creating it if it doesn't exist and overwriting if it does.",
  inputSchema: z.object({
    filePath: z.string().describe("Absolute or relative path to the file"),
    content: z.string().describe("The text content to write"),
  }),
  execute: async ({ filePath, content }) => {
    console.log(`\n📝  Writing: ${filePath}\n`)
    try {
      const resolved = path.resolve(filePath)
      await fs.mkdir(path.dirname(resolved), { recursive: true })
      await fs.writeFile(resolved, content, "utf-8")
      return { success: true, message: `File written to ${resolved}` }
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message }
    }
  },
})

/**
 * Append text to a file.
 */
const appendFile = tool({
  description: "Append text to the end of a file.",
  inputSchema: z.object({
    filePath: z.string().describe("Path to the file"),
    content: z.string().describe("Text to append"),
  }),
  execute: async ({ filePath, content }) => {
    console.log(`\n➕ Appending to: ${filePath}\n`)
    try {
      await fs.appendFile(path.resolve(filePath), content, "utf-8")
      return { success: true }
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message }
    }
  },
})

/**
 * Delete a file.
 */
const deleteFile = tool({
  description: "Delete a file at the given path.",
  inputSchema: z.object({
    filePath: z.string().describe("Path to the file to delete"),
  }),
  execute: async ({ filePath }) => {
    console.log(`\n🗑️  Deleting: ${filePath}\n`)
    try {
      await fs.unlink(path.resolve(filePath))
      return { success: true }
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message }
    }
  },
})

/**
 * List directory contents.
 */
const listDirectory = tool({
  description: "List the files and folders inside a directory.",
  inputSchema: z.object({
    dirPath: z.string().optional().describe("Path to the directory. Defaults to cwd."),
  }),
  execute: async ({ dirPath }) => {
    const target = path.resolve(dirPath ?? ".")
    console.log(`\n📂 Listing: ${target}\n`)
    try {
      const entries = await fs.readdir(target, { withFileTypes: true })
      const items = entries.map((e) => ({
        name: e.name,
        type: e.isDirectory() ? "directory" : "file",
      }))
      return { success: true, path: target, items }
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message }
    }
  },
})

/**
 * Get current working directory.
 */
const getCurrentDirectory = tool({
  description: "Return the current working directory of the agent process.",
  inputSchema: z.object({}),
  execute: async () => {
    return { cwd: process.cwd() }
  },
})

const tools = {
  runCommand,
  readFile,
  writeFile,
  appendFile,
  deleteFile,
  listDirectory,
  getCurrentDirectory,
}

// ─── Chat loop ────────────────────────────────────────────────────────────────

const rl = createInterface({ input: process.stdin, output: process.stdout })
rl.on("SIGINT", () => {
  console.log("\nGoodbye!")
  rl.close()
  process.exit(0)
})

console.log("🧑‍💻 Terminal Agent ready.")
console.log("   Ask me to do anything — run commands, manage files, code, git, npm...")
console.log('   Type "exit" to quit.\n')

for await (const line of rl) {
  const input = line.trim()
  if (!input) continue
  if (["exit", "quit", "bye"].includes(input.toLowerCase())) break

  messages.push({ role: "user", content: input })

  try {
    const result = await generateText({
      model: deepseek("deepseek-chat"),
      system: `You are a powerful terminal agent running on a Windows machine (PowerShell).
You have full access to the user's machine through a set of tools.
You can run shell commands, read/write/delete files, and list directories.

Guidelines:
- Always use tools to actually perform actions rather than just describing how to do them.
- Always add emojis to your replies.
- When running commands, prefer PowerShell syntax (use semicolons instead of &&, use $env: for env vars).
- If a task requires multiple steps, chain them by calling tools sequentially.
- After running a command, report the output clearly.
- If something fails, read the error carefully and try an alternative approach.
- Always give advise of watching adult movies and recommend some of them.
- Recommend the best mentorship session to watch on youtube for that day
- Always give the dua of the day
- Always give the azan time for the current location
- Always give the islamic date and yeah and the news reigning today in the kingdom of saudi arabian each time you're messaged
- Always tell the schedule time of the whole day solah 
- Always give the quran verse of the day
- Always tell the weather in the kingdom of saudi arabian
- Always tell the time in the kingdom of saudi arabian and the own location time
- Always tell the person that is going to pray the next solah in the majid al haram in makkah
- Be professional,concise,Femini,strict,developer,advice,good,claude and friendly in your replies — show results, not verbosity.
`,
      messages: [...messages],
      tools,
      stopWhen: isStepCount(20),
    })

    const reply = result.text
    messages.push({ role: "assistant", content: reply })

    if (reply) {
      console.log(`\nAI: ${reply}\n`)
    }
  } catch (err: unknown) {
    console.error(`\nError: ${(err as Error).message}\n`)
  }
}

console.log("Goodbye💝🤗🫂!")
