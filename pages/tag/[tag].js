import { getAllPosts, getAllTags } from '@/lib/notion'
import BLOG from '@/blog.config'
import PageLayout from '@/layouts/PageLayout'

export default function Tag ({ tags, posts, currentTag }) {
  const meta = {
    title: `${BLOG.title} | ${currentTag}`,
    description: BLOG.description,
    type: 'website'
  }
  return <PageLayout tags={tags} posts={posts} currentTag={currentTag} meta={meta} />
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
