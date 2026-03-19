import { useRouter } from 'next/router'

export default function DebugLocale() {
  const router = useRouter()
  const { locale, locales, defaultLocale, asPath } = router

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Locale Debug Info</h1>
      <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '5px' }}>
        {JSON.stringify({
          currentLocale: locale,
          availableLocales: locales,
          defaultLocale: defaultLocale,
          currentPath: asPath,
          localesLength: locales?.length || 0
        }, null, 2)}
      </pre>

      <h2>Environment Check</h2>
      <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '5px' }}>
        {JSON.stringify({
          NOTION_PAGE_ID: process.env.NEXT_PUBLIC_NOTION_PAGE_ID || 'Not set',
          LANG: process.env.NEXT_PUBLIC_LANG || 'Not set'
        }, null, 2)}
      </pre>

      <h2>Test Links</h2>
      <ul>
        <li><a href="/">Home (default)</a></li>
        <li><a href="/en-US">Home (en-US)</a></li>
        <li><a href="/zh-CN">Home (zh-CN)</a></li>
      </ul>
    </div>
  )
}
