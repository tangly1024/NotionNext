// pages/api/revalidate.js
export default async function handler(req, res) {
  // 只允许 GET 或 POST（你也可以只用 POST）
  const secret = req.query.secret || (req.method === 'POST' && req.body && req.body.secret)
  if (secret !== process.env.REVALIDATE_SECRET) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  try {
    // path 可以通过 query 或 body 传入，默认首页
    const path = req.query.path || (req.body && req.body.path) || '/'
    // 对单条路径执行 revalidate（Next.js 的 pages API 提供）
    await res.revalidate(path)
    return res.json({ revalidated: true, path })
  } catch (err) {
    return res.status(500).json({ message: 'Error revalidating', error: err.message })
  }
}
