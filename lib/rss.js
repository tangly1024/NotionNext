import NotionPage from '@/components/NotionPage'
import { getPostBlocks } from '@/lib/db/getSiteData'
import { Feed } from 'feed'
import fs from 'fs'
import ReactDOMServer from 'react-dom/server'
import { siteConfig } from './config'

/**
 * 生成RSS内容
 * @param {*} post
 * @returns
 */
const createFeedContent = async post => {
  // 加密的文章内容只返回摘要
  if (post.password && post.password !== '') {
    return post.summary
  }
  const blockMap = await getPostBlocks(post.id, 'rss-content')
  if (blockMap) {
    post.blockMap = blockMap
    const content = ReactDOMServer.renderToString(<NotionPage post={post} />)
    const regexExp =
      /<div class="notion-collection-row"><div class="notion-collection-row-body"><div class="notion-collection-row-property"><div class="notion-collection-column-title"><svg.*?class="notion-collection-column-title-icon">.*?<\/svg><div class="notion-collection-column-title-body">.*?<\/div><\/div><div class="notion-collection-row-value">.*?<\/div><\/div><\/div><\/div>/g
    return content.replace(regexExp, '')
  }
}

export async function generateRss(NOTION_CONFIG, posts) {
  const link = siteConfig('LINK', '', NOTION_CONFIG)
  const author = siteConfig('AUTHOR', '', NOTION_CONFIG)
  const lang = siteConfig('LANG', '', NOTION_CONFIG)
  const subPath = siteConfig('SUB_PATH', '', NOTION_CONFIG)

  const year = new Date().getFullYear()
  const feed = new Feed({
    title: siteConfig('TITLE', '', NOTION_CONFIG),
    description: siteConfig('DESCRIPTION', '', NOTION_CONFIG),
    link: `${link}/${subPath}`,
    language: lang,
    favicon: `${link}/favicon.png`,
    copyright: `All rights reserved ${year}, ${author}`,
    author: {
      name: author,
      email: siteConfig('CONTACT_EMAIL', '', NOTION_CONFIG),
      link: link
    }
  })
  for (const post of posts) {
    feed.addItem({
      title: post.title,
      link: `${link}/${post.slug}`,
      description: post.summary,
      content: await createFeedContent(post),
      date: new Date(post?.publishDay)
    })
  }

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
