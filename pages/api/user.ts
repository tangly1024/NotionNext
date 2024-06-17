import { getAuth } from '@clerk/nextjs/server'
import type { NextApiRequest, NextApiResponse } from 'next'
/**
 * clerk身份测试
 * @param req
 * @param res
 * @returns
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = getAuth(req)
  const { userId } = user
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  // retrieve data from your database
  res.status(200).json({ userId })
}
