import fs from 'fs'
import path from 'path'

const ASSET_MAP = {
  architecture: 'Architecture.png',
  visual: 'Visual Design.png',
  hci: 'HCI.png',
  service: 'Service Design.png',
  ux: 'UX.png',
  ixd: 'Ixd.png'
}

export default function handler(req, res) {
  const key = String(req.query.key || '').toLowerCase()
  const filename = ASSET_MAP[key]

  if (!filename) {
    res.status(404).json({ message: 'Asset not found' })
    return
  }

  const filePath = path.join(process.cwd(), 'pages', 'pcl', filename)
  if (!fs.existsSync(filePath)) {
    res.status(404).json({ message: 'Asset file missing' })
    return
  }

  const imageBuffer = fs.readFileSync(filePath)
  res.setHeader('Content-Type', 'image/png')
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
  res.status(200).send(imageBuffer)
}
