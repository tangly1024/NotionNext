import { getAllCategories, getAllPosts, getAllTags } from '@/lib/notion'
import BLOG from '@/blog.config'
import StickyBar from '@/components/StickyBar'
import BaseLayout from '@/layouts/BaseLayout'
import BlogPostListScroll from '@/components/BlogPostListScroll'
import TagList from '@/components/TagList'

export default function Tag ({ tags, posts, currentTag, categories }) {
  const meta = {
    title: `${BLOG.title} | #${currentTag}`,
    description: BLOG.description,
    type: 'website'
  }
  return <BaseLayout meta={meta} tags={tags} currentTag={currentTag} categories={categories} totalPosts={posts}>
    <div className='flex-grow bg-gray-200 dark:bg-black shadow-inner'>
      <StickyBar>
        <TagList tags={tags} currentTag={currentTag}/>
      </StickyBar>
      <BlogPostListScroll posts={posts} tags={tags} currentTag={currentTag}/>
    </div>
  </BaseLayout>
}

export async function getStaticProps ({ params }) {
  const currentTag = params.tag
  let posts = await getAllPosts({ from: 'tag-props' })
  posts = posts.filter(
    post => post.status[0] === 'Published' && post.type[0] === 'Post'
  )
  const tags = await getAllTags(posts)
  const categories = await getAllCategories(posts)
  const filteredPosts = posts.filter(
    post => post && post.tags && post.tags.includes(currentTag)
  )
  return {
    props: {
      tags,
      posts: filteredPosts,
      currentTag,
      categories
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
