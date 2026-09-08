import { createDeepSeek } from '@ai-sdk/deepseek'
import { generateText, tool, isStepCount, type CoreMessage } from 'ai'
import { z } from 'zod'

const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY || '',
})

const webSearch = tool({
  description: 'Search the web for current, real-time public information relevant to the question.',
  inputSchema: z.object({
    query: z.string().describe('Search query to run on the web'),
  }),
  execute: async ({ query }) => {
    try {
      const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1&no_html=1`
      const response = await fetch(url)
      const data = await response.json() as {
        RelatedTopics?: Array<{ Text?: string; FirstURL?: string; Name?: string }>
        AbstractText?: string
        AbstractURL?: string
      }

      const results = (data.RelatedTopics ?? [])
        .filter((item) => item && typeof item.Text === 'string')
        .slice(0, 5)
        .map((item) => ({
          title: item.Name ?? 'Web result',
          snippet: item.Text ?? '',
          url: item.FirstURL ?? data.AbstractURL ?? '',
        }))

      return {
        success: true,
        query,
        abstract: data.AbstractText ?? '',
        url: data.AbstractURL ?? '',
        results,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Web search failed',
      }
    }
  },
})

const tools = { webSearch }

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!process.env.DEEPSEEK_API_KEY) {
    return res.status(500).json({
      error: 'DEEPSEEK_API_KEY is missing. Add it in Vercel environment variables.',
    })
  }

  const payload = req.body || {}
  const messages = Array.isArray(payload.messages) ? payload.messages : []

  if (!messages.length) {
    return res.status(400).json({ error: 'messages array is required' })
  }

  try {
    const result = await generateText({
      model: deepseek('deepseek-chat'),
      system: `You are a world-class AI assistant powered by DeepSeek.
Your role is to act like a premium professional assistant for a live web application.
You can answer questions, write code, search the web, summarize files, produce plans, and guide product work.
Use the webSearch tool when the user needs up-to-date public information.
Be professional, helpful, and clear. Return markdown code blocks when helpful.
Never claim to have internet access beyond the webSearch tool.
`,
      messages: messages as CoreMessage[],
      tools,
      stopWhen: isStepCount(15),
    })

    return res.status(200).json({ reply: result.text || 'Done.' })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return res.status(500).json({ error: message })
  }
}
