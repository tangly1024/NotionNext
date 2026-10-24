import { getPublicPostBlockMap } from '@/lib/utils/publicPost'
import BLOG from '@/blog.config'
import NotionPage from '@/components/NotionPage'
import { siteConfig } from '@/lib/config'
import { getPostBlocks } from '@/lib/db/SiteDataApi'
import { formatNotionBlock } from '@/lib/db/notion/getPostBlocks'
import { adapterNotionBlockMap } from '@/lib/utils/notion.util'
import { normalizeSiteUrl } from '@/lib/sitemap-utils'
import { Feed } from 'feed'
import fs from 'fs'
import ReactDOMServer from 'react-dom/server'
import { decryptEmail } from '@/lib/plugins/mailEncrypt'

export function shouldGenerateRssForLocale({
  locale,
  defaultLocale = BLOG.LANG
} = {}) {
  return !locale || locale === defaultLocale
}

/**
 * 生成RSS内容
 * @param {*} post
 * @returns
 */
const createFeedContent = async (post, rssFullContent = true, allPages) => {
  // 关闭RSS全文或文章已加密时，只返回摘要
  if (!rssFullContent || (post.password && post.password !== '')) {
    return post.summary
  }
  const blockMap = await getPostBlocks(post.id, 'rss-content')
  if (blockMap) {
    post.blockMap = blockMap
    // Notion修改了数据格式再次做统一兼容
    post.blockMap = getPublicPostBlockMap(post, adapterNotionBlockMap(post.blockMap), allPages)
    // 格式化内容，部分的样式字段格式在此处理
    if (post.blockMap?.block) {
      post.blockMap.block = formatNotionBlock(post.blockMap.block)
    }

    const content = ReactDOMServer.renderToString(<NotionPage post={post} />)
    const regexExp =
      /<div class="notion-collection-row"><div class="notion-collection-row-body"><div class="notion-collection-row-property"><div class="notion-collection-column-title"><svg.*?class="notion-collection-column-title-icon">.*?<\/svg><div class="notion-collection-column-title-body">.*?<\/div><\/div><div class="notion-collection-row-value">.*?<\/div><\/div><\/div><\/div>/g
    return content.replace(regexExp, '')
  }
}

/**
 * 去掉站点地址末尾的斜杠，避免拼出 `https://site//rss/feed.xml`
 * @param {*} link
 * @returns
 */
const trimTrailingSlash = link =>
  typeof link === 'string' ? link.replace(/\/+$/, '') : ''

/**
 * 拼接订阅文件在站点上的绝对地址
 * @param {*} siteUrl 站点根地址
 * @param {*} subPath 子路径部署前缀
 * @param {*} file 订阅文件名，例如 feed.xml；为空时返回站点首页
 * @returns
 */
export function createFeedFileUrl(siteUrl, subPath, file) {
  const base = trimTrailingSlash(normalizeSiteUrl(siteUrl) || siteUrl)
  const prefix = trimTrailingSlash(
    String(subPath || '')
      .trim()
      .replace(/^\/+/, '')
  )
  const segments = [base, prefix, file]
  return segments.filter(segment => segment).join('/')
}

/**
 * 构建站点订阅数据（RSS 2.0 / Atom / JSON Feed 共用同一份 Feed 实例）
 *
 * 静态生成（构建时写 public/rss/*）与 /api/rss 兜底共用此函数，
 * 避免两条链路产出的订阅内容不一致。
 * 帖子筛选、排序与条数由调用方决定，这里只负责渲染。
 *
 * @param {object} params
 * @param {object} params.siteInfo 站点信息
 * @param {object} params.NOTION_CONFIG Notion 配置表
 * @param {Array} params.posts 待输出的文章列表（调用方已完成筛选排序）
 * @param {Array} params.allPages 全站页面，用于解析文章内部链接
 * @param {string} params.subPath 子路径部署前缀
 * @param {Function} [params.renderContent] 自定义正文渲染函数
 * @returns {Promise<{rss2: Function, atom1: Function, json1: Function}>}
 */
export async function createFeed({
  siteInfo,
  NOTION_CONFIG,
  posts = [],
  allPages,
  subPath,
  renderContent = createFeedContent
} = {}) {
  const LINK = trimTrailingSlash(normalizeSiteUrl(siteInfo?.link || BLOG.LINK))
  const TITLE = siteInfo?.title
  const DESCRIPTION = siteInfo?.description
  const AUTHOR = NOTION_CONFIG?.AUTHOR || BLOG.AUTHOR
  const LANG = NOTION_CONFIG?.LANG || BLOG.LANG
  const RSS_FULL_CONTENT = siteConfig('RSS_FULL_CONTENT', true, NOTION_CONFIG)
  const CONTACT_EMAIL = decryptEmail(
    NOTION_CONFIG?.CONTACT_EMAIL || BLOG.CONTACT_EMAIL
  )
  const year = new Date().getFullYear()

  const feed = new Feed({
    // Atom 与 JSON Feed 的 feed 级 id 缺失时会输出空的 <id/>
    id: createFeedFileUrl(LINK, subPath, 'rss/feed.xml'),
    title: TITLE,
    description: DESCRIPTION,
    link: createFeedFileUrl(LINK, subPath, ''),
    language: LANG,
    favicon: `${LINK}/favicon.png`,
    copyright: `All rights reserved ${year}, ${AUTHOR}`,
    author: {
      name: AUTHOR,
      email: CONTACT_EMAIL,
      link: LINK
    }
  })

  for (const post of posts) {
    feed.addItem({
      title: post.title,
      link: `${LINK}/${post.slug}`,
      description: post.summary,
      content: await renderContent(post, RSS_FULL_CONTENT, allPages),
      date: new Date(post?.publishDay || post?.publishDate || Date.now())
    })
  }

  return feed
}

/**
 * 生成RSS数据
 * @param {*} props
 */
export async function generateRss(props) {
  const { NOTION_CONFIG, siteInfo, latestPosts } = props

  // 检查 feed 文件是否在10分钟内更新过
  if (isFeedRecentlyUpdated('./public/rss/feed.xml', 10)) {
    return
  }

  console.log('[RSS订阅] 生成/rss/feed.xml')
  const feed = await createFeed({
    siteInfo,
    NOTION_CONFIG,
    posts: latestPosts,
    allPages: props.allPages,
    subPath: NOTION_CONFIG?.SUB_PATH || BLOG.SUB_PATH
  })

  try {
    fs.mkdirSync('./public/rss', { recursive: true })
    fs.writeFileSync('./public/rss/feed.xml', feed.rss2())
    fs.writeFileSync('./public/rss/atom.xml', feed.atom1())
    fs.writeFileSync('./public/rss/feed.json', feed.json1())
  } catch (error) {
    // 在vercel运行环境是只读的，这里会报错；
    // 但在vercel编译阶段、或VPS等其他平台这行代码会成功执行
    // RSS被高频词访问将大量消耗服务端资源，故作为静态文件
  }
}

/**
 * 检查上次更新，如果60分钟内更新过就不操作。
 * @param {*} filePath
 * @param {*} intervalMinutes
 * @returns
 */
function isFeedRecentlyUpdated(filePath, intervalMinutes = 60) {
  try {
    const stats = fs.statSync(filePath)
    const now = new Date()
    const lastModified = new Date(stats.mtime)
    const timeDifference = (now - lastModified) / (1000 * 60) // 转换为分钟
    return timeDifference < intervalMinutes
  } catch (error) {
    // 如果文件不存在，我们需要创建它
    return false
  }
}
