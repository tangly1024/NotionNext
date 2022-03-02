import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import { LayoutSearch } from '@/themes'
import BLOG from '@/blog.config'
import { useGlobal } from '@/lib/global'
import { getDataFromCache } from '@/lib/cache/cache_manager'
import { getPostBlocks } from '@/lib/notion/getPostBlocks'

/**
 * 将对象的指定字段拼接到字符串
 * @param sourceTextArray
 * @param targetObj
 * @param key
 * @returns {*}
 */
function appendText (sourceTextArray, targetObj, key) {
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
function getTextContent (textArray) {
  if (typeof textArray === 'object') {
    let result = ''
    for (const textObj of textArray) {
      result = result + getTextContent(textObj)
    }
    return result
  } else if (typeof textArray === 'string') {
    return textArray
  }
}

export async function getServerSideProps ({ params: { keyword } }) {
  const {
    allPosts,
    categories,
    tags,
    postCount,
    latestPosts,
    customNav
  } = await getGlobalNotionData({ from: 'search-props', pageType: ['Post'] })

  const filterPosts = []
  for (const post of allPosts) {
    // const cacheKey = 'page_block_' + post.id
    const page = await getPostBlocks(post.id, 'search')
    const tagContent = post.tags ? post.tags.join(' ') : ''
    const categoryContent = post.category ? post.category.join(' ') : ''
    const articleInfo = post.title + post.summary + tagContent + categoryContent
    let hit = articleInfo.indexOf(keyword) > -1
    let indexContent = [post.summary]
    if (page !== null) {
      const contentIds = Object.keys(page.block)
      contentIds.forEach(id => {
        const properties = page?.block[id]?.value?.properties
        indexContent = appendText(indexContent, properties, 'title')
        indexContent = appendText(indexContent, properties, 'caption')
      })
    }
    console.log('搜索是否命中缓存', page !== null, indexContent)

    post.results = []
    let hitCount = 0
    const re = new RegExp(`${keyword}`, 'gim')
    for (const i in indexContent) {
      const c = indexContent[i]
      const index = c.toLowerCase().indexOf(keyword.toLowerCase())
      const referText = c?.replace(re, `<span class='text-red-500'>${keyword}</span>`)
      if (index > -1) {
        hit = true
        hitCount += 1
        post.results.push(`<span>${referText}</span>`)
      } else {
        if ((post.results.length - 1) / hitCount < 3 || i === 0) {
          post.results.push(`<span>${referText}</span>`)
        }
      }
    }
    if (hit) {
      filterPosts.push(post)
    }
  }

  return {
    props: {
      posts: filterPosts,
      tags,
      categories,
      postCount,
      latestPosts,
      customNav,
      keyword
    }
  }
}

const Index = (props) => {
  const { keyword } = props
  const { locale } = useGlobal()
  const meta = {
    title: `${keyword || ''} | ${locale.NAV.SEARCH} | ${BLOG.TITLE}  `,
    description: BLOG.DESCRIPTION,
    type: 'website'
  }
  return <LayoutSearch {...props} meta={meta} currentSearch={keyword} />
}

export default Index
