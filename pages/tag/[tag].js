import { getAllCategories, getAllPosts, getAllTags } from '@/lib/notion'
import BLOG from '@/blog.config'
import StickyBar from '@/components/StickyBar'
import BaseLayout from '@/layouts/BaseLayout'
import BlogPostListScroll from '@/components/BlogPostListScroll'
import TagList from '@/components/TagList'
import { getNotionPageData } from '@/lib/notion/getNotionData'

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
  const from = 'tag-props'
  const notionPageData = await getNotionPageData({ from })
  const allPosts = await getAllPosts({ notionPageData, from })
  const categories = await getAllCategories(allPosts)
  const tagOptions = notionPageData.tagOptions
  const tags = await getAllTags({ allPosts, tagOptions })
  const filteredPosts = allPosts.filter(
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
  let posts = []
  let tags = []
  if (BLOG.isProd) {
    posts = await getAllPosts({ from: 'tag-props' })
    tags = await getAllTags(posts)
  }
  return {
    paths: Object.keys(tags).map(tag => ({ params: { tag } })),
    fallback: true
  }
}
