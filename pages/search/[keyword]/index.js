import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import { useGlobal } from '@/lib/global'
import { getDataFromCache } from '@/lib/cache/cache_manager'
import * as ThemeMap from '@/themes'
import BLOG from '@/blog.config'

const Index = props => {
  const { keyword, siteInfo } = props
  const { locale } = useGlobal()
  const meta = {
    title: `${keyword || ''}${keyword ? ' | ' : ''}${locale.NAV.SEARCH} | ${siteInfo?.title}`,
    description: siteInfo?.title,
    image: siteInfo?.pageCover,
    slug: 'search/' + (keyword || ''),
    type: 'website'
  }
  const { theme } = useGlobal()
  const ThemeComponents = ThemeMap[theme]
  return (
    <ThemeComponents.LayoutSearch
      {...props}
      meta={meta}
      currentSearch={keyword}
    />
  )
}

/**
 * 服务端搜索
 * @param {*} param0
 * @returns
 */
export async function getStaticProps({ params: { keyword } }) {
  const props = await getGlobalNotionData({
    from: 'search-props',
    pageType: ['Post']
  })
  const { allPages } = props
  const allPosts = allPages.filter(page => page.type === 'Post' && page.status === 'Published')
  props.posts = await filterByMemCache(allPosts, keyword)
  props.postCount = props.posts.length
  // 处理分页
  if (BLOG.POST_LIST_STYLE === 'scroll') {
    // 滚动列表 给前端返回所有数据
  } else if (BLOG.POST_LIST_STYLE === 'page') {
    props.posts = props.posts?.slice(0, BLOG.POSTS_PER_PAGE - 1)
  }
  props.keyword = keyword
  return {
    props,
    revalidate: 1
  }
}

export async function getStaticPaths() {
  return {
    paths: [{ params: { keyword: BLOG.TITLE } }],
    fallback: true
  }
}

/**
 * 将对象的指定字段拼接到字符串
 * @param sourceTextArray
 * @param targetObj
 * @param key
 * @returns {*}
 */
function appendText(sourceTextArray, targetObj, key) {
  if (!targetObj) {
    return sourceTextArray
  }
  const textArray = targetObj[key]
  const text = textArray ? getTextContent(textArray) : ''
  if (text && text !== 'Untitled') {
    return sourceTextArray.concat(text)
  }
  return sourceTextArray
}

/**
 * 递归获取层层嵌套的数组
 * @param {*} textArray
 * @returns
 */
function getTextContent(textArray) {
  if (typeof textArray === 'object' && isIterable(textArray)) {
    let result = ''
    for (const textObj of textArray) {
      result = result + getTextContent(textObj)
    }
    return result
  } else if (typeof textArray === 'string') {
    return textArray
  }
}

/**
 * 对象是否可以遍历
 * @param {*} obj
 * @returns
 */
const isIterable = obj =>
  obj != null && typeof obj[Symbol.iterator] === 'function'

/**
 * 在内存缓存中进行全文索引
 * @param {*} allPosts
 * @param keyword 关键词
 * @returns
 */
async function filterByMemCache(allPosts, keyword) {
  const filterPosts = []
  if (keyword) {
    keyword = keyword.trim()
  }
  for (const post of allPosts) {
    const cacheKey = 'page_block_' + post.id
    const page = await getDataFromCache(cacheKey, true)
    const tagContent = post.tags && Array.isArray(post.tags) ? post.tags.join(' ') : ''
    const categoryContent = post.category && Array.isArray(post.category) ? post.category.join(' ') : ''
    const articleInfo = post.title + post.summary + tagContent + categoryContent
    let hit = articleInfo.toLowerCase().indexOf(keyword) > -1
    let indexContent = [post.summary]
    if (page && page.block) {
      const contentIds = Object.keys(page.block)
      contentIds.forEach(id => {
        const properties = page?.block[id]?.value?.properties
        indexContent = appendText(indexContent, properties, 'title')
        indexContent = appendText(indexContent, properties, 'caption')
      })
    }
    // console.log('全文搜索缓存', cacheKey, page != null)
    post.results = []
    let hitCount = 0
    for (const i in indexContent) {
      const c = indexContent[i]
      if (!c) {
        continue
      }
      const index = c.toLowerCase().indexOf(keyword.toLowerCase())
      if (index > -1) {
        hit = true
        hitCount += 1
        post.results.push(c)
      } else {
        if ((post.results.length - 1) / hitCount < 3 || i === 0) {
          post.results.push(c)
        }
      }
    }
    if (hit) {
      filterPosts.push(post)
    }
  }
  return filterPosts
}

export default Index
