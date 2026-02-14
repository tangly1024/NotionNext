import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { fetchGlobalAllData, getPostBlocks } from '@/lib/db/SiteDataApi'
import { generateRobotsTxt } from '@/lib/utils/robots.txt'
import { generateRss } from '@/lib/utils/rss'
import { generateSitemapXml } from '@/lib/utils/sitemap.xml'
import { DynamicLayout } from '@/themes/theme'
import { generateRedirectJson } from '@/lib/utils/redirect'
import { checkDataFromAlgolia } from '@/lib/plugins/algolia'
import { getPageContentText } from '@/lib/db/notion/getPageContentText'

const getLastSlugPart = value => {
  if (!value || typeof value !== 'string') return ''
  return value
    .replace(/^\/+|\/+$/g, '')
    .replace(/\.html$/i, '')
    .split('/')
    .pop()
    .toLowerCase()
}

const isAboutPage = page => {
  if (!page || page.type !== 'Page' || page.status !== 'Published') {
    return false
  }
  const slugTail = getLastSlugPart(page.slug)
  const hrefTail = getLastSlugPart(page.href)
  return slugTail === 'about' || hrefTail === 'about'
}

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
  const props = await fetchGlobalAllData({ from, locale })
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
      post.blockMap = await getPostBlocks(post.id, 'slug', POST_PREVIEW_LINES)
    }
  }

  // 首页 Profile 卡片使用 slug=about 的页面内容
  const aboutPage = props.allPages?.find(isAboutPage)
  if (aboutPage) {
    let excerpt = aboutPage.summary || ''
    if (!excerpt && !aboutPage.password) {
      const aboutBlockMap = await getPostBlocks(aboutPage.id, 'slug', 24)
      excerpt = getPageContentText(aboutPage, aboutBlockMap)
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 220)
    }

    props.aboutPage = {
      id: aboutPage.id,
      title: aboutPage.title,
      href: aboutPage.href,
      slug: aboutPage.slug,
      summary: aboutPage.summary || '',
      excerpt
    }
  } else {
    props.aboutPage = null
  }

  // 生成robotTxt
  generateRobotsTxt(props)
  // 生成Feed订阅
  generateRss(props)
  // 生成
  generateSitemapXml(props)
  // 检查数据是否需要从algolia删除
  checkDataFromAlgolia(props)
  if (siteConfig('UUID_REDIRECT', false, props?.NOTION_CONFIG)) {
    // 生成重定向 JSON
    generateRedirectJson(props)
  }

  // 生成全文索引 - 仅在 yarn build 时执行 && process.env.npm_lifecycle_event === 'build'

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

export default Index
