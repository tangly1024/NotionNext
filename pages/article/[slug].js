import BLOG from '@/blog.config'
import ArticleDetail from '@/components/ArticleDetail'
import Card from '@/components/Card'
import LatestPostsGroup from '@/components/LatestPostsGroup'
import Live2D from '@/components/Live2D'
import TocDrawer from '@/components/TocDrawer'
import TocDrawerButton from '@/components/TocDrawerButton'
import BaseLayout from '@/layouts/BaseLayout'
import { getPostBlocks } from '@/lib/notion'
import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import Custom404 from '@/pages/404'
import { getPageTableOfContents } from 'notion-utils'
import { useRef } from 'react'

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

  const drawerRight = useRef(null)
  const targetRef = typeof window !== 'undefined' ? document.getElementById('container') : null
  post.content = Object.keys(post?.blockMap?.block)
  post.toc = getPageTableOfContents(post, post.blockMap)
  const floatSlot = post?.toc?.length > 1 ? <div className="block lg:hidden"><TocDrawerButton onClick={() => { drawerRight?.current?.handleSwitchVisible() }} /></div> : null

  return (
    <BaseLayout
      meta={meta}
      tags={tags}
      post={post}
      postCount={postCount}
      latestPosts={latestPosts}
      categories={categories}
      floatSlot={floatSlot}
      rightAreaSlot={
        BLOG.widget?.showLatestPost && <Card><LatestPostsGroup posts={latestPosts} /></Card>
      }
    >
      <ArticleDetail
        post={post}
        recommendPosts={recommendPosts}
        prev={prev}
        next={next}
      />

      {/* 悬浮目录按钮 */}
      <div className="block lg:hidden">
        <TocDrawer post={post} cRef={drawerRight} targetRef={targetRef} />
      </div>

      {/* 宠物 */}
      <Live2D/>

    </BaseLayout>
  )
}

export async function getStaticPaths () {
  if (!BLOG.isProd) {
    return {
      paths: [],
      fallback: true
    }
  }

  const from = '[slug-paths'
  const { allPosts } = await getGlobalNotionData({ from, includePage: false })
  return {
    paths: allPosts.map(row => ({ params: { slug: row.slug } })),
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

  post.blockMap = await getPostBlocks(post.id, 'slug')

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
