import BLOG from '@/blog.config'
import ArticleDetail from '@/components/ArticleDetail'
import BaseLayout from '@/layouts/BaseLayout'
import { getAllPosts, getPostBlocks } from '@/lib/notion'
import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import Custom404 from '@/pages/404'
import { getPageTableOfContents } from 'notion-utils'

/**
 * 根据notion的slug访问页面
 * @param {*} param0
 * @returns
 */
const Slug = ({
  post,
  tags,
  prev,
  next,
  allPosts,
  recommendPosts,
  categories,
  postCount,
  latestPosts
}) => {
  if (!post) {
    return <Custom404 />
  }
  const meta = {
    title: `${post.title} | ${BLOG.title}`,
    description: post.summary,
    type: 'article',
    tags: post.tags
  }

  return (
    <BaseLayout
      meta={meta}
      tags={tags}
      post={post}
      postCount={postCount}
      latestPosts={latestPosts}
      totalPosts={allPosts}
      categories={categories}
    >
      <ArticleDetail
        post={post}
        recommendPosts={recommendPosts}
        prev={prev}
        next={next}
      />
    </BaseLayout>
  )
}

export async function getStaticPaths () {
  let posts = []
  if (BLOG.isProd) {
    posts = await getAllPosts({ from: 'slug - paths', includePage: false })
  }
  return {
    paths: posts.map(row => ({ params: { slug: row.slug } })),
    fallback: true
  }
}

export async function getStaticProps ({ params: { slug } }) {
  const from = `slug-props-${slug}`
  const { allPosts, categories, tags, postCount, latestPosts } =
    await getGlobalNotionData({ from, includePage: false })

  const post = allPosts.find(p => p.slug === slug)

  if (!post) {
    return { props: {}, revalidate: 1 }
  }

  const blockMap = await getPostBlocks(post.id, 'slug')
  if (blockMap) {
    post.blockMap = blockMap
    post.content = Object.keys(blockMap.block)
    post.toc = getPageTableOfContents(post, blockMap)
    delete post.content
  }

  // 上一篇、下一篇文章关联
  const index = allPosts.indexOf(post)
  const prev = allPosts.slice(index - 1, index)[0] ?? allPosts.slice(-1)[0]
  const next = allPosts.slice(index + 1, index + 2)[0] ?? allPosts[0]

  const recommendPosts = getRecommendPost(post, allPosts)

  return {
    props: {
      post,
      tags,
      prev,
      next,
      allPosts,
      recommendPosts,
      categories,
      postCount,
      latestPosts
    },
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
      p => p && p.tags && p.tags.includes(currentTag) && p.slug !== post.slug
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
