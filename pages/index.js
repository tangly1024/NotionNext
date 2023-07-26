import BLOG from '@/blog.config'
import { getPostBlocks } from '@/lib/notion'
import { getGlobalData } from '@/lib/notion/getNotionData'
import { generateRss } from '@/lib/rss'
import { generateRobotsTxt } from '@/lib/robots.txt'

import { useRouter } from 'next/router'
import { getLayoutByTheme } from '@/themes/theme'
import { generateAlgoliaSearch } from '@/lib/algolia'

/**
 * 首页布局
 * @param {*} props
 * @returns
 */

const Index = props => {
  // 根据页面路径加载不同Layout文件
  const Layout = getLayoutByTheme(useRouter())
  return <Layout {...props} />
}

/**
 * SSG 获取数据
 * @returns
 */
export async function getStaticProps() {
  const from = 'index'
  const props = await getGlobalData({ from })

  const { siteInfo } = props
  props.posts = props.allPages.filter(page => page.type === 'Post' && page.status === 'Published')

  const meta = {
    title: `${siteInfo?.title} | ${siteInfo?.description}`,
    description: siteInfo?.description,
    image: siteInfo?.pageCover,
    slug: '',
    type: 'website'
  }
  // 处理分页
  if (BLOG.POST_LIST_STYLE === 'scroll') {
    // 滚动列表默认给前端返回所有数据
  } else if (BLOG.POST_LIST_STYLE === 'page') {
    props.posts = props.posts?.slice(0, BLOG.POSTS_PER_PAGE)
  }

  // 预览文章内容
  if (BLOG.POST_LIST_PREVIEW === 'true') {
    for (const i in props.posts) {
      const post = props.posts[i]
      if (post.password && post.password !== '') {
        continue
      }
      post.blockMap = await getPostBlocks(post.id, 'slug', BLOG.POST_PREVIEW_LINES)
    }
  }

  // 生成robotTxt
  generateRobotsTxt()
  // 生成Feed订阅
  if (JSON.parse(BLOG.ENABLE_RSS)) {
    generateRss(props?.latestPosts || [])
  }

  // 生成全文索引 - 仅在 yarn build 时执行 && process.env.npm_lifecycle_event === 'build'
  if (BLOG.ALGOLIA_APP_ID && JSON.parse(BLOG.ALGOLIA_RECREATE_DATA)) {
    generateAlgoliaSearch({ allPages: props.allPages })
  }

  delete props.allPages

  return {
    props: {
      meta,
      ...props
    },
    revalidate: parseInt(BLOG.NEXT_REVALIDATE_SECOND)
  }
}

export default Index
