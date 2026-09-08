type UploadPayload = {
  filename?: string
  content?: string
  type?: string
}

const uploads: UploadPayload[] = []

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const body = req.body as UploadPayload
  if (!body?.filename || !body?.content) {
    return res.status(400).json({ error: 'filename and content are required' })
  }

  const entry = {
    filename: body.filename,
    content: body.content,
    type: body.type || 'text/plain',
  }

  uploads.push(entry)

  return res.status(200).json({
    success: true,
    message: 'File uploaded successfully.',
    file: entry,
    totalFiles: uploads.length,
  })
}
