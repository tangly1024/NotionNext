import BLOG from '@/blog.config'
import { getPageContentText } from '@/pages/search/[keyword]'
import algoliasearch from 'algoliasearch'

/**
 * 上传数据
 */
const uploadDataToAlgolia = (post) => {
  // Connect and authenticate with your Algolia app
  const client = algoliasearch(BLOG.ALGOLIA_APP_ID, BLOG.ALGOLIA_APP_KEY)

  // Create a new index and add a record
  const index = client.initIndex(BLOG.ALGOLIA_INDEX)
  const record = {
    objectID: post.id,
    title: post.title,
    category: post.category,
    tags: post.tags,
    pageCover: post.pageCover,
    slug: post.slug,
    summary: post.summary,
    content: getPageContentText(post, post.blockMap)
  }
  index.saveObject(record).wait().then(r => {
    console.log('Algolia索引', r, record)
  })
}

export { uploadDataToAlgolia }
