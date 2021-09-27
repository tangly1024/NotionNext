import { getAllPosts, getAllTags } from '@/lib/notion'
import DefaultLayout from '@/layouts/DefaultLayout'

export async function getStaticProps () {
  let posts = await getAllPosts()
  posts = posts.filter(
    post => post.status[0] === 'Published' && post.type[0] === 'Post'
  )
  const tags = await getAllTags(posts)

  return {
    props: {
      page: 1, // current page is 1
      posts,
      tags
    },
    revalidate: 1
  }
}

const blog = ({ posts, page, tags }) => {
  return (
    <DefaultLayout tags={tags} posts={posts} page={page} />
  )
}

export default blog
