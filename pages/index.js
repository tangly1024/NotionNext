import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getGlobalData, getPostBlocks } from '@/lib/db/getSiteData'
import { generateRobotsTxt } from '@/lib/robots.txt'
import { generateSitemapXml } from '@/lib/sitemap.xml'
import { DynamicLayout } from '@/themes/theme'
import { generateRedirectJson, generateSlugIndexJson } from '@/lib/redirect'
import { checkDataFromAlgolia } from '@/lib/plugins/algolia'
import { ISR_HOME_REVALIDATE, buildStaticPropsResult } from '@/lib/cache/revalidate'
import { compactPostForLatest, compactPostForNav } from '@/lib/utils/compactPost'

/**
 * 首页布局
 * @param {*} props
 * @returns
 */
const Index = props => {
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return <DynamicLayout theme={theme} layoutName='LayoutIndex' {...props} />
}

/**
 * SSG 获取数据
 * @returns
 */
export async function getStaticProps(req) {
  const { locale } = req
  const from = 'index'
  const props = await getGlobalData({ from, locale })
  const POST_PREVIEW_LINES = siteConfig(
    'POST_PREVIEW_LINES',
    12,
    props?.NOTION_CONFIG
  )
  props.posts = props.allPages?.filter(
    page => page.type === 'Post' && page.status === 'Published'
  )

  // 处理分页
  if (siteConfig('POST_LIST_STYLE') === 'scroll') {
    // 滚动列表默认给前端返回所有数据
  } else if (siteConfig('POST_LIST_STYLE') === 'page') {
    props.posts = props.posts?.slice(
      0,
      siteConfig('POSTS_PER_PAGE', 12, props?.NOTION_CONFIG)
    )
  }

  // 预览文章内容
  if (siteConfig('POST_LIST_PREVIEW', false, props?.NOTION_CONFIG)) {
    for (const i in props.posts) {
      const post = props.posts[i]
      if (post.password && post.password !== '') {
        continue
      }
      // 跳过fallback错误页面
      if (post.id === 'oops-page-fallback') {
        post.blockMap = { block: {} }
      } else {
        post.blockMap = await getPostBlocks(post.id, 'slug', POST_PREVIEW_LINES)
      }
    }
  }

  // 生成robotTxt
  generateRobotsTxt(props)
  // 生成
  generateSitemapXml(props)
  // 检查数据是否需要从algolia删除
  checkDataFromAlgolia(props)
  // 始终生成 UUID -> slug 映射，供 middleware 在旧链接场景下前置重定向。
  generateRedirectJson(props)
  generateSlugIndexJson({ allPages: props.allPages || [], locale })

  // 生成全文索引 - 仅在 yarn build 时执行 && process.env.npm_lifecycle_event === 'build'
  props.latestPosts = props.latestPosts?.map(post => compactPostForLatest(post))
  props.allNavPages = props.allNavPages?.map(post => compactPostForNav(post))

  delete props.allPages

  return buildStaticPropsResult(props, ISR_HOME_REVALIDATE)
}

export default Index
