import { completeNotionOAuth } from '@/lib/server/notionOAuth'

// Retain the legacy callback URL while sharing the state-checked server flow.
export async function getServerSideProps({ req, res, query }) {
  res.setHeader('Cache-Control', 'private, no-store')
  res.setHeader('Referrer-Policy', 'no-referrer')
  if (!query.code && !query.error) {
    return { redirect: { destination: '/api/auth/notion', permanent: false } }
  }
  const result = await completeNotionOAuth({ query, cookies: req.cookies }, res)
  return {
    redirect: {
      destination: result.redirect || '/auth/result?status=error',
      permanent: false
    }
  }
}

export default function NotionOAuthRedirect() {
  return null
}
