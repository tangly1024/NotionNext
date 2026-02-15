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
import { getReadmeMarkdown, renderMarkdownToHtml } from '@/lib/db/notion/notionBlocksToHtml'

const normalizeSlugToken = value => {
  if (!value || typeof value !== 'string') return ''
  return value
    .toLowerCase()
    .split('?')[0]
    .split('#')[0]
    .replace(/^\/+|\/+$/g, '')
    .replace(/\.html$/i, '')
}

const isReadmePage = page => {
  if (!page || !['Published', 'Invisible'].includes(page.status)) return false
  return normalizeSlugToken(page.slug) === 'readme.md'
}

const normalizeId = value => (value || '').toString().replace(/-/g, '').toLowerCase()

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

  // 首页 Profile 卡片使用 readme 页面内容
  const readmePage = props.allPages?.find(isReadmePage)
  if (readmePage) {
    let excerpt = ''
    let readmeBlockMap = null
    if (!readmePage.password) {
      readmeBlockMap = await getPostBlocks(readmePage.id, 'slug', 24)
      const pageBlocks = Object.values(readmeBlockMap?.block || {})
      const currentPageBlock = pageBlocks.find(item => {
        const value = item?.value
        return value?.type === 'page' && normalizeId(value.id) === normalizeId(readmePage.id)
      })?.value

      const readmePageForExtract = {
        ...readmePage,
        content: currentPageBlock?.content || readmePage.content || []
      }

      excerpt = getPageContentText(readmePageForExtract, readmeBlockMap)
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 220)
    }

    const readmeMarkdown = getReadmeMarkdown(readmePage.id, readmeBlockMap)
    const { html: readmeHtml, source: readmeHtmlSource } = readmeMarkdown
      ? await renderMarkdownToHtml(readmeMarkdown)
      : { html: '', source: 'github' }

    props.readmePage = {
      id: readmePage.id,
      title: readmePage.title,
      href: readmePage.href,
      slug: readmePage.slug,
      type: readmePage.type,
      status: readmePage.status,
      summary: readmePage.summary || '',
      excerpt,
      readmeHtml,
      readmeHtmlSource // 'github' | 'local'，local 时需加载 highlight.js CSS
    }
  } else {
    props.readmePage = null
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
