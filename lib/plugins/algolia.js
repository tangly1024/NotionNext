import BLOG from '@/blog.config'
import algoliasearch from 'algoliasearch'
import { getPageContentText } from '@/lib/db/notion/getPageContentText'

// 全局初始化 Algolia 客户端和索引
let algoliaClient
let algoliaIndex

const initAlgolia = () => {
  if (!algoliaClient) {
    if (
      !BLOG.ALGOLIA_APP_ID ||
      !BLOG.ALGOLIA_ADMIN_APP_KEY ||
      !BLOG.ALGOLIA_INDEX
    ) {
      // console.warn('Algolia configuration is missing')
    }
    algoliaClient = algoliasearch(
      BLOG.ALGOLIA_APP_ID,
      BLOG.ALGOLIA_ADMIN_APP_KEY
    )
    algoliaIndex = algoliaClient.initIndex(BLOG.ALGOLIA_INDEX)
  }
  return { client: algoliaClient, index: algoliaIndex }
}

// 初始化全局实例
initAlgolia()

/**
 * 生成全文索引
 * @param {*} allPages
 */
const generateAlgoliaSearch = ({ allPages, force = false }) => {
  allPages?.forEach(p => {
    // 判断这篇文章是否需要重新创建索引
    if (p && !p.password) {
      uploadDataToAlgolia(p)
    }
  })
}

/**
 * 检查数据是否需要从algolia删除
 * @param {*} props
 */
export const checkDataFromAlgolia = async props => {
  const { allPages } = props
  const deletions = (allPages || [])
    .map(p => {
      if (p && (p.password || p.status === 'Draft')) {
        return deletePostDataFromAlgolia(p)
      }
    })
    .filter(Boolean) // 去除 undefined
  await Promise.all(deletions)
}

/**
 * 删除数据
 * @param post
 */
const deletePostDataFromAlgolia = async post => {
  if (!post) {
    return
  }

  // 检查是否有索引
  let existed
  try {
    existed = await algoliaIndex.getObject(post.id)
  } catch (error) {
    // 通常是不存在索引
  }

  if (existed) {
    await algoliaIndex
      .deleteObject(post.id)
      .wait()
      .then(r => {
        console.log('Algolia索引删除成功', r)
      })
      .catch(err => {
        console.log('Algolia异常', err)
      })
  }
}

/**
 * 上传数据
 * 根据上次修改文章日期和上次更新索引数据判断是否需要更新algolia索引
 */
const uploadDataToAlgolia = async post => {
  if (!post) {
    return
  }

  // 检查是否有索引
  let existed
  let needUpdateIndex = false
  try {
    existed = await algoliaIndex.getObject(post.id)
  } catch (error) {
    // 通常是不存在索引
  }

  if (!existed || !existed?.lastEditedDate || !existed?.lastIndexDate) {
    needUpdateIndex = true
  } else {
    const lastEditedDate = new Date(post.lastEditedDate)
    const lastIndexDate = new Date(existed.lastIndexDate)
    if (lastEditedDate.getTime() > lastIndexDate.getTime()) {
      needUpdateIndex = true
    }
  }

  // 如果需要更新搜索
  if (needUpdateIndex) {
    const record = {
      objectID: post.id,
      title: post.title,
      category: post.category,
      tags: post.tags,
      pageCover: post.pageCover,
      slug: post.slug,
      summary: post.summary,
      lastEditedDate: post.lastEditedDate, // 更新文章时间
      lastIndexDate: new Date(), // 更新索引时间
      content: truncate(getPageContentText(post, post.blockMap), 8192) // 索引8192个字符，API限制总请求内容上限1万个字节
    }
    // console.log('更新Algolia索引', record)
    algoliaIndex
      .saveObject(record)
      .wait()
      .then(r => {
        console.log('Algolia索引更新', r)
      })
      .catch(err => {
        console.log('Algolia异常', err)
      })
  }
}

/**
 * 限制内容字节数
 * @param {*} str
 * @param {*} maxBytes
 * @returns
 */
function truncate(str, maxBytes) {
  let count = 0
  let result = ''
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i)
    if (code <= 0x7f) {
      count += 1
    } else if (code <= 0x7ff) {
      count += 2
    } else if (code <= 0xffff) {
      count += 3
    } else {
      count += 4
    }
    if (count <= maxBytes) {
      result += str[i]
    } else {
      break
    }
  }
  return result
}

export { uploadDataToAlgolia, generateAlgoliaSearch }
