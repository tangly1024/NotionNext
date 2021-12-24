import { getAllCategories, getAllPosts, getAllTags, getPostBlocks } from '@/lib/notion'
import BLOG from '@/blog.config'
import { getPageTableOfContents } from 'notion-utils'

import BaseLayout from '@/layouts/BaseLayout'
import Custom404 from '@/pages/404'

import ArticleDetail from '@/components/ArticleDetail'
import { getNotionPageData } from '@/lib/notion/getNotionData'

/**
 * 根据notion的slug访问页面
 * @param {*} param0
 * @returns
 */
const Slug = ({ post, blockMap, tags, prev, next, allPosts, recommendPosts, categories }) => {
  if (!post) {
    return <Custom404 />
  }
  const meta = {
    title: `${post.title} | ${BLOG.title}`,
    description: post.summary,
    type: 'article',
    tags: post.tags
  }

  return <BaseLayout meta={meta} tags={tags} post={post} totalPosts={allPosts} categories={categories}>
    <ArticleDetail post={post} blockMap={blockMap} recommendPosts={recommendPosts} prev={prev} next={next}/>
  </BaseLayout>
}

export async function getStaticPaths () {
  let posts = []
  if (BLOG.isProd) {
    posts = await getAllPosts({ from: 'slug - paths', includePage: true })
  }
  return {
    paths: posts.map(row => `${BLOG.path}/article/${row.slug}`),
    fallback: true
  }
}

export async function getStaticProps ({ params: { slug } }) {
  const from = `slug-props-${slug}`
  const notionPageData = await getNotionPageData({ from })
  let allPosts = await getAllPosts({ notionPageData, from, includePage: true })
  const post = allPosts.find(p => p.slug === slug)

  if (!post) {
    return { props: {}, revalidate: 1 }
  }

  const blockMap = await getPostBlocks(post.id, 'slug')
  if (blockMap) {
    post.content = Object.keys(blockMap.block)
    post.toc = getPageTableOfContents(post, blockMap)
  }

  allPosts = allPosts.filter(post => post.type[0] === 'Post')
  const tagOptions = notionPageData.tagOptions
  const tags = await getAllTags({ allPosts, tagOptions })
  const categories = await getAllCategories(allPosts)
  // 上一篇、下一篇文章关联
  const index = allPosts.indexOf(post)
  const prev = allPosts.slice(index - 1, index)[0] ?? allPosts.slice(-1)[0]
  const next = allPosts.slice(index + 1, index + 2)[0] ?? allPosts[0]

  const recommendPosts = getRecommendPost(post, allPosts)

  return {
    props: { post, blockMap, tags, prev, next, allPosts, recommendPosts, categories },
    revalidate: 1
  }
}

/**
 *
 * @param {获取文章推荐文章} post
 * @param {*} allPosts
 * @param {*} count
 * @returns
 */
function getRecommendPost (post, allPosts, count = 5) {
  let filteredPosts = Object.create(allPosts)
  // 筛选同标签
  if (post.tags && post.tags.length) {
    const currentTag = post.tags[0]
    filteredPosts = filteredPosts.filter(
      p =>
        p &&
      p.tags &&
        p.tags.includes(currentTag) &&
        p.slug !== post.slug
    )
  }
  shuffleSort(filteredPosts)

  // 筛选前5个
  if (filteredPosts.length > count) {
    filteredPosts = filteredPosts.slice(0, count)
  }
  return filteredPosts
}

/**
 * 洗牌乱序：从数组的最后位置开始，从前面随机一个位置，对两个数进行交换，直到循环完毕
 * @param arr
 * @returns {*}
 */
function shuffleSort (arr) {
  let i = arr.length - 1
  while (i > 0) {
    const rIndex = Math.floor(Math.random() * i)
    const temp = arr[rIndex]
    arr[rIndex] = arr[i]
    arr[i] = temp
    i--
  }
  return arr
}

export default Slug
