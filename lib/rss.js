import { Feed } from 'feed'
import BLOG from '@/blog.config'
import ReactDOMServer from 'react-dom/server'
import { getPostBlocks } from './notion'
import NotionPage from '@/components/NotionPage'

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

export async function generateRss(posts) {
  const year = new Date().getFullYear()
  const feed = new Feed({
    title: BLOG.TITLE,
    description: BLOG.DESCRIPTION,
    link: `${BLOG.LINK}/${BLOG.SUB_PATH}`,
    language: BLOG.LANG,
    favicon: `${BLOG.LINK}/favicon.png`,
    copyright: `All rights reserved ${year}, ${BLOG.AUTHOR}`,
    author: {
      name: BLOG.AUTHOR,
      email: BLOG.CONTACT_EMAIL,
      link: BLOG.LINK
    }
  })
  for (const post of posts) {
    feed.addItem({
      title: post.title,
      guid: `${post.id}`,
      link: `${BLOG.LINK}/article/${post.slug}`,
      description: post.summary,
      content: await createFeedContent(post),
      date: new Date(post?.date?.start_date || post?.createdTime)
    })
  }
  return feed.atom1()
}
