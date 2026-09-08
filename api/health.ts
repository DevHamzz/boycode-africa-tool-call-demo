export default function handler(_req: any, res: any) {
  return res.status(200).json({
    status: 'ok',
    provider: 'deepseek',
    model: 'deepseek-chat',
    platform: 'vercel',
    timestamp: new Date().toISOString(),
  })
}
