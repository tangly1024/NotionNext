import BLOG from '@/blog.config'
import { getPageContentText } from '@/pages/search/[keyword]'
import algoliasearch from 'algoliasearch'

/**
 * 生成全文索引
 * @param {*} allPages
 */
const generateAlgoliaSearch = async({ allPages, force = false }) => {
  allPages?.forEach(p => {
    // 判断这篇文章是否需要重新创建索引
    if (p && !p.password) {
      uploadDataToAlgolia(p)
    }
  })
}

/**
 * 上传数据
 */
const uploadDataToAlgolia = (post) => {
  // Connect and authenticate with your Algolia app
  const client = algoliasearch(BLOG.ALGOLIA_APP_ID, BLOG.ALGOLIA_ADMIN_APP_KEY)

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

export { uploadDataToAlgolia, generateAlgoliaSearch }
