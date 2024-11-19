import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getGlobalData, getPost, getPostBlocks } from '@/lib/db/getSiteData'
import { DynamicLayout } from '@/themes/theme'
import { useRouter } from 'next/router'

/**
 * 根据notion的slug访问页面
 * 只解析一级目录例如 /about
 * @param {*} props
 * @returns
 */
const Dashboard = props => {
  const router = useRouter()
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return <DynamicLayout theme={theme} router={router} {...props} />
}

export async function getStaticProps({ locale }) {
  const prefix = 'dashboard'
  let fullSlug = 'dashboard'
  const from = `slug-props-${fullSlug}`
  const props = await getGlobalData({ from, locale })
  if (siteConfig('PSEUDO_STATIC', false, props.NOTION_CONFIG)) {
    if (!fullSlug.endsWith('.html')) {
      fullSlug += '.html'
    }
  }

  // 在列表内查找文章
  props.post = props?.allPages?.find(p => {
    return p.type.indexOf('Menu') < 0 && p.slug === fullSlug
  })

  // 处理非列表内文章的内信息
  if (!props?.post) {
    const pageId = prefix
    if (pageId.length >= 32) {
      const post = await getPost(pageId)
      props.post = post
    }
  }
  // 无法获取文章
  if (!props?.post) {
    props.post = null
    return {
      props,
      revalidate: process.env.EXPORT
        ? undefined
        : siteConfig(
            'NEXT_REVALIDATE_SECOND',
            BLOG.NEXT_REVALIDATE_SECOND,
            props.NOTION_CONFIG
          )
    }
  }

  // 文章内容加载
  if (!props?.post?.blockMap) {
    props.post.blockMap = await getPostBlocks(props.post.id, from)
  }

  delete props.allPages
  return {
    props,
    revalidate: process.env.EXPORT
      ? undefined
      : siteConfig(
          'NEXT_REVALIDATE_SECOND',
          BLOG.NEXT_REVALIDATE_SECOND,
          props.NOTION_CONFIG
        )
  }
}

export const getStaticPaths = async () => {
  return {
    // 定义需要预渲染的路径
    paths: [
      { params: { index: [''] } }, // 对应 /dashboard
      { params: { index: ['membership'] } }, // 对应 /dashboard/membership
      { params: { index: ['order'] } }, // 对应 /dashboard/order
      { params: { index: ['favorite'] } } // 对应 /dashboard/favorite
    ],
    fallback: 'blocking' // 或者 true，阻塞式渲染
  }
}
export default Dashboard
