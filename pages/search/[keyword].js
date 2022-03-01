import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import { LayoutSearch } from '@/themes'
import BLOG from '@/blog.config'
import { useGlobal } from '@/lib/global'
import cache from 'memory-cache'

export async function getStaticPaths () {
  return {
    paths: [],
    fallback: true
  }
}

/**
 * 将对象的指定字段拼接到字符串
 * @param sourceText
 * @param targetObj
 * @param key
 * @returns {*}
 */
function concatPropsText (sourceText, targetObj, key) {
  if (!targetObj) {
    return sourceText
  }
  const textArray = targetObj[key]
  const text = textArray ? textArray[0][0] : ''
  if (text && text !== 'Untitled') {
    return sourceText.concat(text)
  }
  return sourceText
}

export async function getStaticProps ({ params: { keyword } }) {
  const {
    allPosts,
    categories,
    tags,
    postCount,
    latestPosts,
    customNav
  } = await getGlobalNotionData({ from: 'search-props', pageType: ['Post'] })

  const filterPosts = []
  allPosts.forEach(post => {
    const cacheKey = 'page_block_' + post.id
    const page = cache.get(cacheKey)
    const tagContent = post.tags ? post.tags.join(' ') : ''
    const categoryContent = post.category ? post.category.join(' ') : ''
    let indexContent = post.title + ' ' + post.summary + ' ' + tagContent + ' ' + categoryContent
    if (page != null) {
      const contentIds = Object.keys(page.block)
      contentIds.forEach(id => {
        const properties = page?.block[id]?.value?.properties
        indexContent = concatPropsText(indexContent, properties, 'title')
        indexContent = concatPropsText(indexContent, properties, 'caption')
      })
    }
    post.results = []
    const index = indexContent.indexOf(keyword)
    if (index > -1) {
      filterPosts.push(post)
      let start = index - 20
      let end = index + 20
      if (start < 0) start = 0
      if (end > indexContent.length) end = indexContent.length
      const referText = indexContent.substr(start, end).replaceAll(keyword, `<span class='text-red-500'>${keyword}</span>`)
      post.results.push(`<span>${referText}</span>`)
    }
  })

  console.log(filterPosts)

  return {
    props: {
      posts: filterPosts,
      tags,
      categories,
      postCount,
      latestPosts,
      customNav,
      keyword
    },
    revalidate: 1
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
