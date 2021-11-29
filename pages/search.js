import { getAllCategories, getAllPosts, getAllTags } from '@/lib/notion'
import BLOG from '@/blog.config'
import BaseLayout from '@/layouts/BaseLayout'
import StickyBar from '@/components/StickyBar'
import BlogPostListScroll from '@/components/BlogPostListScroll'
import { useRouter } from 'next/router'

export async function getStaticProps () {
  let posts = await getAllPosts({ from: 'index' })
  posts = posts.filter(
    post => post.status[0] === 'Published' && post.type[0] === 'Post'
  )
  const tags = await getAllTags(posts)
  const categories = await getAllCategories(posts)

  const meta = {
    title: `${BLOG.title} | ${BLOG.description} `,
    description: BLOG.description,
    type: 'website'
  }
  return {
    props: {
      posts,
      tags,
      meta,
      categories
    },
    revalidate: 1
  }
}

const Search = ({ posts, tags, meta, categories }) => {
  // 处理查询过滤 支持标签、关键词过滤
  let filteredPosts = []
  const searchKey = getSearchKey()
  if (searchKey) {
    filteredPosts = posts.filter(post => {
      const tagContent = post.tags ? post.tags.join(' ') : ''
      const searchContent = post.title + post.summary + tagContent
      return searchContent.toLowerCase().includes(searchKey.toLowerCase())
    })
  }
  return (
    <BaseLayout meta={meta} tags={tags} totalPosts={posts} currentSearch={searchKey} categories={categories}>
      <div className='flex-grow bg-gray-200 dark:bg-black shadow-inner'>
        <StickyBar>
          <div className='p-4 dark:text-gray-200'><i className='fa fa-search mr-1'/> 搜索词： {searchKey}</div>
        </StickyBar>
        <BlogPostListScroll posts={filteredPosts} tags={tags} currentSearch={searchKey} />
      </div>
    </BaseLayout>
  )
}

export function getSearchKey () {
  const router = useRouter()
  if (router.query && router.query.s) {
    return router.query.s
  }
  return null
}
export default Search
