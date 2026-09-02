import express from "express"
import cors from "cors"
import { createDeepSeek } from "@ai-sdk/deepseek"
import { generateText, tool, isStepCount } from "ai"
import { config } from "@dotenvx/dotenvx"
import { exec } from "node:child_process"
import { promisify } from "node:util"
import * as fs from "node:fs/promises"
import * as path from "node:path"
import { z } from "zod"

config({ path: ".env" })

const execAsync = promisify(exec)

// ─── DeepSeek client ──────────────────────────────────────────────────────────
const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY,
})

// ─── Tools (same as index.ts) ─────────────────────────────────────────────────
const runCommand = tool({
  description:
    "Execute any shell command on the user's machine and return stdout and stderr.",
  inputSchema: z.object({
    command: z.string().describe("The shell command to run"),
    cwd: z.string().optional().describe("Working directory"),
  }),
  execute: async ({ command, cwd }) => {
    console.log(`⚡ Running: ${command}`)
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

const readFileTool = tool({
  description: "Read the contents of a file at the given path.",
  inputSchema: z.object({
    filePath: z.string().describe("Absolute or relative path to the file"),
  }),
  execute: async ({ filePath }) => {
    try {
      const content = await fs.readFile(path.resolve(filePath), "utf-8")
      return { success: true, content }
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message }
    }
  },
})

const writeFileTool = tool({
  description: "Write content to a file, creating it if it doesn't exist.",
  inputSchema: z.object({
    filePath: z.string().describe("Path to the file"),
    content: z.string().describe("Text content to write"),
  }),
  execute: async ({ filePath, content }) => {
    try {
      const resolved = path.resolve(filePath)
      await fs.mkdir(path.dirname(resolved), { recursive: true })
      await fs.writeFile(resolved, content, "utf-8")
      return { success: true, message: `Written to ${resolved}` }
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message }
    }
  },
})

const listDirectoryTool = tool({
  description: "List files and folders inside a directory.",
  inputSchema: z.object({
    dirPath: z.string().optional().describe("Path to directory. Defaults to cwd."),
  }),
  execute: async ({ dirPath }) => {
    try {
      const target = path.resolve(dirPath ?? ".")
      const entries = await fs.readdir(target, { withFileTypes: true })
      return {
        success: true,
        path: target,
        items: entries.map((e) => ({ name: e.name, type: e.isDirectory() ? "directory" : "file" })),
      }
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message }
    }
  },
})

const tools = { runCommand, readFileTool, writeFileTool, listDirectoryTool }

// ─── Express app ──────────────────────────────────────────────────────────────
const app = express()
app.use(cors({ origin: "http://localhost:5173" }))
app.use(express.json())

/** POST /api/chat
 *  Body: { messages: { role: "user" | "assistant", content: string }[] }
 *  Response: { reply: string }
 */
app.post("/api/chat", async (req, res) => {
  const { messages } = req.body as {
    messages: { role: "user" | "assistant"; content: string }[]
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: "messages array is required" })
    return
  }

  try {
    const result = await generateText({
      model: deepseek("deepseek-chat"),
      system: `You are GenZpt AI — a powerful, friendly AI assistant running on a Windows machine (PowerShell).
You have access to tools that let you run shell commands, read/write files, and list directories.
Guidelines:
- Use tools to actually perform actions rather than just describing them.
- When running commands, use PowerShell syntax.
- Chain multiple tool calls when needed to complete a task.
- Be concise but thorough. Show results, not just descriptions.
- Format code in markdown code blocks.`,
      messages,
      tools,
      stopWhen: isStepCount(15),
    })

    res.json({ reply: result.text || "Done." })
  } catch (err: unknown) {
    console.error("AI error:", (err as Error).message)
    res.status(500).json({ error: (err as Error).message })
  }
})

/** GET /api/health */
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", model: "deepseek-chat" })
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`\n🚀 GenZpt AI server running at http://localhost:${PORT}`)
  console.log(`   Frontend expected at  http://localhost:5173\n`)
})
