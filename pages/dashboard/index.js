import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getGlobalData, getPost, getPostBlocks } from '@/lib/db/getSiteData'
import { getPageTableOfContents } from '@/lib/notion/getPageTableOfContents'
import { uploadDataToAlgolia } from '@/lib/plugins/algolia'
import { getRecommendPost } from '@/lib/utils/post'
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

  // 目录默认加载
  if (props.post?.blockMap?.block) {
    props.post.content = Object.keys(props.post.blockMap.block).filter(
      key => props.post.blockMap.block[key]?.value?.parent_id === props.post.id
    )
    props.post.toc = getPageTableOfContents(props.post, props.post.blockMap)
  }

  // 生成全文索引 && process.env.npm_lifecycle_event === 'build' && JSON.parse(BLOG.ALGOLIA_RECREATE_DATA)
  if (BLOG.ALGOLIA_APP_ID) {
    uploadDataToAlgolia(props?.post)
  }

  // 推荐关联文章处理
  const allPosts = props.allPages?.filter(
    page => page.type === 'Post' && page.status === 'Published'
  )
  if (allPosts && allPosts.length > 0) {
    const index = allPosts.indexOf(props.post)
    props.prev = allPosts.slice(index - 1, index)[0] ?? allPosts.slice(-1)[0]
    props.next = allPosts.slice(index + 1, index + 2)[0] ?? allPosts[0]
    props.recommendPosts = getRecommendPost(
      props.post,
      allPosts,
      siteConfig('POST_RECOMMEND_COUNT')
    )
  } else {
    props.prev = null
    props.next = null
    props.recommendPosts = []
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

export default Dashboard
