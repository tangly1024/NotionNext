export async function getServerSideProps({ res }) {
  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /search',
    'Disallow: /search/',
    'Disallow: /search/*',
    'Disallow: /tag/*/page/*',
    'Disallow: /category/*/page/*',
    'Disallow: /page/*',
    ''
  ].join('\n')

  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
  res.write(body)
  res.end()

  return { props: {} }
}

export default function Robots() {
  return null
}
