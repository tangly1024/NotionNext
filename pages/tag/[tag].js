import { getAllPosts, getAllTags } from '@/lib/notion'
import BLOG from '@/blog.config'
import TagsBar from '@/components/TagsBar'
import BlogPostList from '@/components/BlogPostList'
import BaseLayout from '@/layouts/BaseLayout'

export default function Tag ({ tags, posts, currentTag }) {
  const meta = {
    title: `${BLOG.title} | ${currentTag}`,
    description: BLOG.description,
    type: 'website'
  }
  return <BaseLayout meta={meta} tags={tags} currentTag={currentTag}>
    <div className='flex-grow'>
      <TagsBar tags={tags} currentTag={currentTag}/>
      <BlogPostList posts={posts} tags={tags}/>
    </div>
  </BaseLayout>
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
