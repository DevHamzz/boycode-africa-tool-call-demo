export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const query = String(req.query.q || '').trim()
  if (!query) {
    return res.status(400).json({ error: 'q query parameter is required' })
  }

  try {
    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1&no_html=1`
    const response = await fetch(url)
    const data = await response.json() as {
      AbstractText?: string
      AbstractURL?: string
      RelatedTopics?: Array<{ Text?: string; FirstURL?: string; Name?: string }>
    }

    return res.status(200).json({
      query,
      abstract: data.AbstractText || '',
      url: data.AbstractURL || '',
      results: (data.RelatedTopics || []).slice(0, 5).map((item) => ({
        title: item.Name || 'Result',
        snippet: item.Text || '',
        url: item.FirstURL || '',
      })),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Web search failed'
    return res.status(500).json({ error: message })
  }
}
