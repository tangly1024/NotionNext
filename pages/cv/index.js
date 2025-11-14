// /pages/cv/index.js
import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getGlobalData } from '@/lib/db/getSiteData'

export default function CVIndexPage (props) {
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return (
    // 不传 layoutName，保持和 /lab 一致的最小实现
    <div className='max-w-3xl mx-auto px-4 py-12'>
      <h1 className='text-3xl font-bold'>CV</h1>
      <p className='mt-4 text-gray-600 dark:text-gray-300'>
        Minimal static page for build verification (CV).
      </p>
      <pre className='mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded overflow-auto'>
        theme: {String(theme)}
      </pre>
    </div>
  )
}

export async function getStaticProps ({ locale }) {
  try {
    const props = await getGlobalData({ from: 'cv', locale })
    return {
      props,
      // 给个不太长的 ISR，便于线上自动刷新
      revalidate: 60
    }
  } catch (e) {
    // 即使出错也不要 fail build
    return {
      props: { __error: 'cv-build-failed', message: String(e) },
      revalidate: 60
    }
  }
}
