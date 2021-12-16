import { getAllCategories, getAllPosts, getAllTags } from '@/lib/notion'
import BLOG from '@/blog.config'
import StickyBar from '@/components/StickyBar'
import BaseLayout from '@/layouts/BaseLayout'
import BlogPostListScroll from '@/components/BlogPostListScroll'
import TagList from '@/components/TagList'
import { getNotionPageData } from '@/lib/notion/getNotionData'

export default function Tag ({ tags, allPosts, filteredPosts, tag, categories }) {
  const meta = {
    title: `${BLOG.title} | #${tag}`,
    description: BLOG.description,
    type: 'website'
  }

  return <BaseLayout meta={meta} tags={tags} currentTag={tag} categories={categories} totalPosts={allPosts}>
    <div className='pt-16'>
      <StickyBar>
        <TagList tags={tags} currentTag={tag}/>
      </StickyBar>
      <BlogPostListScroll posts={filteredPosts} tags={tags} currentTag={tag}/>
    </div>
  </BaseLayout>
}

export async function getStaticProps ({ params }) {
  const tag = params.tag
  const from = 'tag-props'
  const notionPageData = await getNotionPageData({ from })
  const allPosts = await getAllPosts({ notionPageData, from })
  const categories = await getAllCategories(allPosts)
  const tagOptions = notionPageData.tagOptions
  const tags = await getAllTags({ allPosts, tagOptions, sliceCount: 0 })
  const filteredPosts = allPosts.filter(
    post => post && post.tags && post.tags.includes(tag)
  )
  return {
    props: {
      tags,
      allPosts,
      filteredPosts,
      tag,
      categories
    },
    revalidate: 1
  }
}

export async function getStaticPaths () {
  // const tags = []
  const from = 'tag-static-path'
  const notionPageData = await getNotionPageData({ from })
  const posts = await getAllPosts({ notionPageData, from })
  const categories = await getAllCategories(posts)

  // const tagOptions = notionPageData.tagOptions
  // tags = await getAllTags({ posts, tagOptions, sliceCount: 0 })
  return {
    paths: Object.keys(categories).map(category => ({ params: { category } })),
    // paths: tags.map(t => ({ params: { tag: t.name } })),
    fallback: true
  }
}
