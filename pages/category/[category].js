import BLOG from '@/blog.config'
import BlogPostListScroll from '@/components/BlogPostListScroll'
import CategoryList from '@/components/CategoryList'
import StickyBar from '@/components/StickyBar'
import BaseLayout from '@/layouts/BaseLayout'
import { useGlobal } from '@/lib/global'
import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import React from 'react'

export default function Category ({ tags, posts, category, categories, latestPosts, postCount }) {
  const { locale } = useGlobal()
  const meta = {
    title: `${category} | ${locale.COMMON.CATEGORY} | ${BLOG.title}`,
    description: BLOG.description,
    type: 'website'
  }
  return <BaseLayout meta={meta} tags={tags} currentCategory={category} postCount={postCount} latestPosts={latestPosts} categories={categories}>
      <StickyBar>
        <CategoryList currentCategory={category} categories={categories} />
      </StickyBar>
      <div className='md:mt-8'>
         <BlogPostListScroll posts={posts} tags={tags} currentCategory={category}/>
      </div>
  </BaseLayout>
}

export async function getStaticProps ({ params }) {
  const from = 'category-props'
  const category = params.category
  const { allPosts, categories, tags, postCount, latestPosts } = await getGlobalNotionData({ from })
  const filteredPosts = allPosts.filter(
    post => post && post.category && post.category.includes(category)
  )
  return {
    props: {
      tags,
      posts: filteredPosts,
      category,
      categories,
      postCount,
      latestPosts
    },
    revalidate: 1
  }
}

export async function getStaticPaths () {
  const from = 'category-paths'
  const { categories } = await getGlobalNotionData({ from })
  return {
    paths: Object.keys(categories).map(category => ({ params: { category } })),
    fallback: true
  }
}
