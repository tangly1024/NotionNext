import { getAllPosts, getAllTags } from '@/lib/notion'
import BLOG from '@/blog.config'
import BaseLayout from '@/layouts/BaseLayout'
import TagsBar from '@/components/TagsBar'
import BlogPostListScroll from '@/components/BlogPostListScroll'

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

const index = ({ posts, tags, meta }) => {
  return (
    <BaseLayout meta={meta} tags={tags}>
      <div className='flex-grow'>
        <TagsBar tags={tags} />
        <BlogPostListScroll posts={posts} tags={tags} />
      </div>
    </BaseLayout>
  )
}

export default index
