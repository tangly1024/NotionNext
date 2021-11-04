import { getAllPosts, getAllTags } from '@/lib/notion'
import BLOG from '@/blog.config'
import BaseLayout from '@/layouts/BaseLayout'
import TagsBar from '@/components/TagsBar'
import BlogPostListScroll from '@/components/BlogPostListScroll'
import { useRouter } from 'next/router'

export async function getStaticProps () {
  let posts = await getAllPosts({ from: 'index' })
  posts = posts.filter(
    post => post.status[0] === 'Published' && post.type[0] === 'Post'
  )
  const tags = await getAllTags(posts)
  const meta = {
    title: `${BLOG.title} | ${BLOG.description} `,
    description: BLOG.description,
    type: 'website'
  }
  return {
    props: {
      posts,
      tags,
      meta
    },
    revalidate: 1
  }
}

const Search = ({ posts, tags, meta }) => {
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
    <BaseLayout meta={meta} tags={tags} totalPosts={posts} currentSearch={searchKey}>
      <div className='flex-grow bg-gray-200 dark:bg-black shadow-inner'>
        <TagsBar tags={tags} />
        <BlogPostListScroll posts={filteredPosts} tags={tags} />
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
