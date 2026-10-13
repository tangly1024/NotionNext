import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function NotionOAuthResult() {
  const { query, isReady } = useRouter()
  const success = isReady && query.status === 'success'
  return (
    <main className='min-h-screen flex items-center justify-center p-6 bg-white dark:bg-gray-900'>
      <Head>
        <title>Notion 授权结果</title>
        <meta name='robots' content='noindex, nofollow' />
        <meta name='referrer' content='no-referrer' />
      </Head>
      <div className='text-center space-y-4 dark:text-gray-100'>
        <h1 className='text-2xl font-bold'>
          {success ? 'Notion 授权已完成' : '未能完成 Notion 授权'}
        </h1>
        <p>
          {success
            ? '你可以关闭此页面或返回首页。'
            : '授权可能已过期，请重新开始。'}
        </p>
        <Link
          href={success ? '/' : '/api/auth/notion'}
          className='inline-block underline'
        >
          {success ? '返回首页' : '重新授权'}
        </Link>
      </div>
    </main>
  )
}
