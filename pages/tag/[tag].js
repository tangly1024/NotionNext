import { getAllPosts, getAllTags } from '@/lib/notion'
import IndexLayout from '@/layouts/IndexLayout'
import BLOG from '@/blog.config'

export default function Tag ({ tags, posts, currentTag }) {
  return <IndexLayout tags={tags} posts={posts} currentTag={currentTag} />
}

export async function getStaticProps ({ params }) {
  const currentTag = params.tag
  let posts = await getAllPosts()
  posts = posts.filter(
    post => post.status[0] === 'Published' && post.type[0] === 'Post'
  )
  const tags = await getAllTags(posts)
  const filteredPosts = posts.filter(
    post => post && post.tags && post.tags.includes(currentTag)
  )
  return {
    props: {
      tags,
      posts: filteredPosts,
      currentTag
    },
    revalidate: 1
  }
}

export async function getStaticPaths () {
  if (BLOG.isProd) {
    // 预渲染
    const tags = await getAllTags()
    return {
      paths: Object.keys(tags).map(tag => ({ params: { tag } })),
      fallback: true
    }
  } else {
    return {
      paths: [],
      fallback: true
    }
  }
}
