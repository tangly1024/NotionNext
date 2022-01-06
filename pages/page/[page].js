import { getAllCategories, getAllPosts, getAllTags } from '@/lib/notion'
import BLOG from '@/blog.config'
import BaseLayout from '@/layouts/BaseLayout'
import { getNotionPageData } from '@/lib/notion/getNotionData'
import Header from '@/components/Header'
import Custom404 from '../404'
import BlogPostListPage from '@/components/BlogPostListPage'

const Page = ({ page, allPosts, tags, meta, categories }) => {
  if (!meta || BLOG.postListStyle !== 'page') {
    return <Custom404/>
  }

  return (
    <BaseLayout
    headerSlot={BLOG.home.showHomeBanner && <Header />}
    meta={meta}
    tags={tags}
    totalPosts={allPosts}
    categories={categories}
  >
    <BlogPostListPage page={page} posts={allPosts} tags={tags} />
  </BaseLayout>
  )
}

export async function getStaticPaths () {
  const from = 'page'
  const notionPageData = await getNotionPageData({ from })
  const allPosts = await getAllPosts({ notionPageData, from })
  const totalPages = Math.ceil(allPosts?.length / BLOG.postsPerPage)
  return {
    // remove first page, we 're not gonna handle that.
    paths: Array.from({ length: totalPages - 1 }, (_, i) => ({ params: { page: '' + (i + 2) } })),
    fallback: true
  }
}

export async function getStaticProps ({ params: { page } }) {
  const from = 'page'
  const notionPageData = await getNotionPageData({ from })
  const allPosts = await getAllPosts({ notionPageData, from })
  const categories = await getAllCategories(allPosts)
  const tagOptions = notionPageData.tagOptions
  const tags = await getAllTags({ allPosts, tagOptions })
  const meta = {
    title: `${page} | Page | ${BLOG.title}`,
    description: BLOG.description,
    type: 'website'
  }
  return {
    props: {
      page,
      allPosts,
      tags,
      categories,
      meta
    },
    revalidate: 1
  }
}

export default Page
