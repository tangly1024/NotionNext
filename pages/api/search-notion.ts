import { NextApiRequest, NextApiResponse } from 'next'

import { search } from '../../lib/notion'

/**
 *  ancestorId: string;
    query: string;
    filters?: {
        isDeletedOnly: boolean;
        excludeTemplates: boolean;
        isNavigableOnly: boolean;
        requireEditPermissions: boolean;
    };
    limit?: number;
    searchSessionId?: string;
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).send({ error: 'method not allowed' })
  }

  const searchParams = req.body

  console.log('<<< lambda search-notion', searchParams)
  const results = await search(searchParams)
  console.log('>>> lambda search-notion', results)

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=60, max-age=60, stale-while-revalidate=60'
  )
  res.status(200).json(results)
}
