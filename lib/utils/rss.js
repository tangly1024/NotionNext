import BLOG from '@/blog.config'
import NotionPage from '@/components/NotionPage'
import { getPostBlocks } from '@/lib/db/SiteDataApi'
import { formatNotionBlock } from '@/lib/db/notion/getPostBlocks'
import { siteConfig } from '@/lib/config'
import { Feed } from 'feed'
import fs from 'fs'
import ReactDOMServer from 'react-dom/server'
import { decryptEmail } from '@/lib/plugins/mailEncrypt'
import { adapterNotionBlockMap } from './notion.util'

/**
 * 生成RSS内容
 * @param {*} post
 * @returns
 */
const createFeedContent = async post => {
  // 加密的文章内容只返回摘要
  if (post.password && post.password !== '') {
    return post.summary || ''
  }

  try {
    const rawBlockMap = await getPostBlocks(post.id, 'rss-content')
    if (!rawBlockMap?.block) {
      return post.summary || ''
    }

    const blockMap = adapterNotionBlockMap(rawBlockMap)
    const safePost = {
      ...post,
      blockMap: {
        ...blockMap,
        block: formatNotionBlock(blockMap.block)
      }
    }
    const content = ReactDOMServer.renderToString(<NotionPage post={safePost} />)
    const regexExp =
      /<div class="notion-collection-row"><div class="notion-collection-row-body"><div class="notion-collection-row-property"><div class="notion-collection-column-title"><svg.*?class="notion-collection-column-title-icon">.*?<\/svg><div class="notion-collection-column-title-body">.*?<\/div><\/div><div class="notion-collection-row-value">.*?<\/div><\/div><\/div><\/div>/g
    return content.replace(regexExp, '')
  } catch (error) {
    console.warn(
      `[RSS] Failed to render post content, fallback to summary: ${post?.id || 'unknown'}`,
      error
    )
    return post.summary || ''
  }

  return post.summary || ''
}

const trimTrailingSlash = path => path?.replace(/\/+$/, '') || ''

const normalizeSubPath = path => {
  if (!path) {
    return ''
  }
  const normalizedPath = `${path}`.trim().replace(/^\/+|\/+$/g, '')
  return normalizedPath ? `/${normalizedPath}` : ''
}

const joinUrl = (baseUrl, path = '') => {
  const cleanBaseUrl = trimTrailingSlash(baseUrl)
  const cleanPath = `${path}`.replace(/^\/+/, '')
  return cleanPath ? `${cleanBaseUrl}/${cleanPath}` : cleanBaseUrl
}

export async function buildFeed(props) {
  const { NOTION_CONFIG, siteInfo, latestPosts } = props
  const TITLE = siteConfig('TITLE', siteInfo?.title, NOTION_CONFIG)
  const DESCRIPTION = siteConfig(
    'DESCRIPTION',
    siteInfo?.description,
    NOTION_CONFIG
  )
  const LINK = trimTrailingSlash(
    siteConfig('LINK', siteInfo?.link, NOTION_CONFIG) || BLOG.LINK
  )
  const AUTHOR = siteConfig('AUTHOR', BLOG.AUTHOR, NOTION_CONFIG)
  const LANG = siteConfig('LANG', BLOG.LANG, NOTION_CONFIG)
  const SUB_PATH = normalizeSubPath(
    siteConfig('SUB_PATH', BLOG.SUB_PATH, NOTION_CONFIG)
  )
  const CONTACT_EMAIL = decryptEmail(
    siteConfig('CONTACT_EMAIL', BLOG.CONTACT_EMAIL, NOTION_CONFIG)
  )
  const SITE_LINK = `${LINK}${SUB_PATH}`

  const year = new Date().getFullYear()
  const feed = new Feed({
    title: TITLE,
    description: DESCRIPTION,
    link: SITE_LINK,
    language: LANG,
    favicon: joinUrl(SITE_LINK, 'favicon.ico'),
    copyright: `All rights reserved ${year}, ${AUTHOR}`,
    author: {
      name: AUTHOR,
      email: CONTACT_EMAIL,
      link: LINK
    }
  })

  for (const post of latestPosts || []) {
    feed.addItem({
      title: post.title,
      link: joinUrl(SITE_LINK, post.slug),
      description: post.summary,
      content: await createFeedContent(post),
      date: new Date(post?.publishDay)
    })
  }

  return feed
}

export async function buildRssXml(props) {
  const feed = await buildFeed(props)
  return feed.rss2()
}

/**
 * 生成RSS数据
 * @param {*} props
 */
export async function generateRss(props) {
  // 检查 feed 文件是否在10分钟内更新过
  if (isFeedRecentlyUpdated('./public/rss.xml', 10)) {
    return
  }

  console.log('[RSS订阅] 生成/rss.xml')
  const feed = await buildFeed(props)
  const rssXml = feed.rss2()

  try {
    fs.mkdirSync('./public/rss', { recursive: true })
    fs.writeFileSync('./public/rss.xml', rssXml)
    fs.writeFileSync('./public/rss/feed.xml', rssXml)
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
