import { Feed } from 'feed'
import BLOG from '@/blog.config'

export function generateRss (posts) {
  const year = new Date().getFullYear()
  const feed = new Feed({
    title: BLOG.TITLE,
    description: BLOG.DESCRIPTION,
    id: `${BLOG.LINK}/${BLOG.PATH}`,
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
  posts.forEach(post => {
    feed.addItem({
      title: post.title,
      id: `${BLOG.LINK}/article/${post.slug}`,
      link: `${BLOG.LINK}/article/${post.slug}`,
      description: post.summary,
      date: new Date(post?.date?.start_date || post.createdTime)
    })
  })
  return feed.rss2()
}
