import { getAllCategories, getAllPosts, getAllTags } from '@/lib/notion'
import BLOG from '@/blog.config'
import BaseLayout from '@/layouts/BaseLayout'
import BlogPostListScroll from '@/components/BlogPostListScroll'
import { getNotionPageData } from '@/lib/notion/getNotionData'
import Header from '@/components/Header'

export async function getStaticProps () {
  const from = 'index'
  const notionPageData = await getNotionPageData({ from })
  const allPosts = await getAllPosts({ notionPageData, from })
  const categories = await getAllCategories(allPosts)
  const tagOptions = notionPageData.tagOptions
  const tags = await getAllTags({ allPosts, tagOptions })
  const meta = {
    title: `${BLOG.title}`,
    description: BLOG.description,
    type: 'website'
  }
  return {
    props: {
      allPosts,
      tags,
      categories,
      meta
    },
    revalidate: 1
  }
}

const Index = ({ allPosts, tags, meta, categories }) => {
  return (
    <BaseLayout
      headerSlot={<Header />}
      meta={meta}
      tags={tags}
      totalPosts={allPosts}
      categories={categories}
    >
      <BlogPostListScroll posts={allPosts} tags={tags} />
    </BaseLayout>
  )
}

export default Index
