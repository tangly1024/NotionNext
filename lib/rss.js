import { Feed } from 'feed'
import BLOG from '@/blog.config'
import ReactDOMServer from 'react-dom/server'
import { NotionRenderer, Equation, Code, Collection, CollectionRow } from 'react-notion-x'
import { getPostBlocks } from './notion'

const mapPageUrl = id => 'https://www.notion.so/' + id.replace(/-/g, '')

const createFeedContent = async post => {
  // 加密的文章内容只返回摘要
  if (post.password && post.password !== '') {
    return post.summary
  }
  const blockMap = await getPostBlocks(post.id, 'rss-content')
  if (blockMap) {
    const content = ReactDOMServer.renderToString(<NotionRenderer
      recordMap={blockMap}
      components={{
        equation: Equation,
        code: Code,
        collection: Collection,
        collectionRow: CollectionRow
      }}
      mapPageUrl={mapPageUrl}
    />)
    const regexExp = /<div class="notion-collection-row"><div class="notion-collection-row-body"><div class="notion-collection-row-property"><div class="notion-collection-column-title"><svg.*?class="notion-collection-column-title-icon">.*?<\/svg><div class="notion-collection-column-title-body">.*?<\/div><\/div><div class="notion-collection-row-value">.*?<\/div><\/div><\/div><\/div>/g
    return content.replace(regexExp, '')
  }
  return post.summary
}

export async function generateRss (posts) {
  const year = new Date().getFullYear()
  const feed = new Feed({
    title: BLOG.TITLE,
    description: BLOG.DESCRIPTION,
    link: `${BLOG.LINK}/${BLOG.PATH}`,
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
      date: new Date(post?.date?.start_date || post.createdTime)
    })
  }
  return feed.atom1()
}
