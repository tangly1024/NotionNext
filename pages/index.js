import { getAllCategories, getAllPosts, getAllTags } from '@/lib/notion'
import BLOG from '@/blog.config'
import BaseLayout from '@/layouts/BaseLayout'
import BlogPostListScroll from '@/components/BlogPostListScroll'

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
      categories,
      meta
    },
    revalidate: 1
  }
}

const Index = ({ posts, tags, meta, categories }) => {
  return (
    <BaseLayout meta={meta} tags={tags} totalPosts={posts} categories={categories}>
      <div className='flex-grow bg-gray-200 dark:bg-black shadow-inner'>
        <BlogPostListScroll posts={posts} tags={tags} />
      </div>
    </BaseLayout>
  )
}

export default Index
