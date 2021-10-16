import { getAllPosts, getAllTags } from '@/lib/notion'
import IndexLayout from '@/layouts/IndexLayout'
import BLOG from '@/blog.config'

export async function getStaticProps () {
  let posts = await getAllPosts()
  posts = posts.filter(
    post => post.status[0] === 'Published' && post.type[0] === 'Post'
  )
  const tags = await getAllTags(posts)
  const meta = {
    title: `${BLOG.title} | 首页`,
    description: BLOG.description,
    type: 'website'
  }
  return {
    props: {
      page: 1, // current page is 1
      posts,
      tags,
      meta
    },
    revalidate: 1
  }
}

const index = ({ posts, page, tags, meta }) => {
  return (
    <IndexLayout tags={tags} posts={posts} page={page} meta={meta} />
  )
}

export default index
