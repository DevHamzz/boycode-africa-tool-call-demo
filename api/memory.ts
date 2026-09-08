type MemoryEntry = {
  id: string
  userId: string
  key: string
  value: string
  createdAt: string
}

const memoryStore: MemoryEntry[] = []

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    const userId = String(req.query.userId || 'default')
    return res.status(200).json({
      userId,
      memories: memoryStore.filter((entry) => entry.userId === userId),
    })
  }

  if (req.method === 'POST') {
    const body = req.body || {}
    const userId = String(body.userId || 'default')
    const key = String(body.key || '').trim()
    const value = String(body.value || '').trim()

    if (!key || !value) {
      return res.status(400).json({ error: 'key and value are required' })
    }

    const entry: MemoryEntry = {
      id: crypto.randomUUID(),
      userId,
      key,
      value,
      createdAt: new Date().toISOString(),
    }

    memoryStore.push(entry)
    return res.status(200).json({ success: true, memory: entry })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
