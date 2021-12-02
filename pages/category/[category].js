import { getAllCategories, getAllPosts, getAllTags } from '@/lib/notion'
import BLOG from '@/blog.config'
import StickyBar from '@/components/StickyBar'
import BaseLayout from '@/layouts/BaseLayout'
import BlogPostListScroll from '@/components/BlogPostListScroll'
import React from 'react'
import CategoryList from '@/components/CategoryList'
import { getNotionPageData } from '@/lib/notion/getNotionData'

export default function Category ({ tags, allPosts, filteredPosts, category, categories }) {
  const meta = {
    title: `${BLOG.title} | ${category}`,
    description: BLOG.description,
    type: 'website'
  }
  return <BaseLayout meta={meta} tags={tags} currentCategory={category} totalPosts={allPosts} categories={categories}>
    <div className='flex-grow bg-gray-200 dark:bg-black shadow-inner pt-16'>
      <StickyBar>
        <CategoryList currentCategory={category} categories={categories} />
      </StickyBar>
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
  if (BLOG.isProd) {
    posts = await getAllPosts({ from: 'category-path' })
    categories = await getAllCategories(posts)
  }
  return {
    paths: Object.keys(categories).map(category => ({ params: { category } })),
    fallback: true
  }
}
