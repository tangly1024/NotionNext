import { getAllPosts, getAllTags } from '@/lib/notion'
import BLOG from '@/blog.config'
import BaseLayout from '@/layouts/BaseLayout'
import TagsBar from '@/components/TagsBar'
import BlogPostList from '@/components/BlogPostList'

const Page = ({ posts, tags, page }) => {
  const meta = {
    title: `${BLOG.title} | 博客列表`,
    description: BLOG.description,
    type: 'website'
  }
  return <BaseLayout meta={meta} tags={tags}>
    <div className='flex-grow'>
      <TagsBar tags={tags} />
      <BlogPostList posts={posts} tags={tags} page={page} />
    </div>
  </BaseLayout>
}

export async function getStaticPaths () {
  let posts = await getAllPosts()
  posts = posts.filter(
    post => post.status[0] === 'Published' && post.type[0] === 'Post'
  )
  const totalPosts = posts.length
  const totalPages = Math.ceil(totalPosts / BLOG.postsPerPage)
  return {
    // remove first page, we 're not gonna handle that.
    paths: Array.from({ length: totalPages - 1 }, (_, i) => ({
      params: { page: '' + (i + 2) }
    })),
    fallback: true
  }
}

export async function getStaticProps (context) {
  const { page } = context.params // Get Current Page No.
  let posts = await getAllPosts()
  posts = posts.filter(
    post => post.status[0] === 'Published' && post.type[0] === 'Post'
  )
  const tags = await getAllTags(posts)
  return {
    props: {
      tags,
      posts,
      page
    },
    revalidate: 1
  }
}

export default Page
