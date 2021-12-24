import { getAllCategories, getAllPosts, getAllTags } from '@/lib/notion'
import BLOG from '@/blog.config'
import StickyBar from '@/components/StickyBar'
import BaseLayout from '@/layouts/BaseLayout'
import BlogPostListScroll from '@/components/BlogPostListScroll'
import React from 'react'
import CategoryList from '@/components/CategoryList'
import { getNotionPageData } from '@/lib/notion/getNotionData'
import { useGlobal } from '@/lib/global'

export default function Category ({ tags, allPosts, filteredPosts, category, categories }) {
  const { locale } = useGlobal()
  const meta = {
    title: `${category} | ${locale.COMMON.CATEGORY} | ${BLOG.title}`,
    description: BLOG.description,
    type: 'website'
  }
  return <BaseLayout meta={meta} tags={tags} currentCategory={category} totalPosts={allPosts} categories={categories}>
      <StickyBar>
        <CategoryList currentCategory={category} categories={categories} />
      </StickyBar>
      <div className='md:mt-8'>
         <BlogPostListScroll posts={filteredPosts} tags={tags} currentCategory={category}/>
      </div>
  </BaseLayout>
}

export async function getStaticProps ({ params }) {
  const from = 'category-props'
  const category = params.category
  const notionPageData = await getNotionPageData({ from })
  const allPosts = await getAllPosts({ notionPageData, from })
  const categories = await getAllCategories(allPosts)
  const tagOptions = notionPageData.tagOptions
  const tags = await getAllTags({ allPosts, tagOptions })
  const filteredPosts = allPosts.filter(
    post => post && post.category && post.category.includes(category)
  )
  return {
    props: {
      tags,
      allPosts,
      filteredPosts,
      category,
      categories
    },
    revalidate: 1
  }
}

export async function getStaticPaths () {
  let posts = []
  let categories = []
  posts = await getAllPosts({ from: 'category-path' })
  categories = await getAllCategories(posts)
  return {
    paths: Object.keys(categories).map(category => ({ params: { category } })),
    fallback: true
  }
}
