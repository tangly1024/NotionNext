import { getAllCategories, getAllPosts, getAllTags } from '@/lib/notion'
import BLOG from '@/blog.config'
import StickyBar from '@/components/StickyBar'
import BaseLayout from '@/layouts/BaseLayout'
import BlogPostListScroll from '@/components/BlogPostListScroll'
import React from 'react'
import CategoryList from '@/components/CategoryList'

export default function Category ({ tags, posts, category, categories }) {
  const meta = {
    title: `${BLOG.title} | ${category}`,
    description: BLOG.description,
    type: 'website'
  }
  return <BaseLayout meta={meta} tags={tags} currentCategory={category} totalPosts={posts} categories={categories}>
    <div className='flex-grow bg-gray-200 dark:bg-black shadow-inner'>
      <StickyBar >
        <CategoryList currentCategory={category} categories={categories} />
      </StickyBar>
      <BlogPostListScroll posts={posts} tags={tags} currentCategory={category}/>
    </div>
  </BaseLayout>
}

export async function getStaticProps ({ params }) {
  const category = params.category
  let posts = await getAllPosts({ from: 'category-props' })
  posts = posts.filter(
    post => post.status[0] === 'Published' && post.type[0] === 'Post'
  )
  const tags = await getAllTags(posts)
  const categories = await getAllCategories(posts)
  const filteredPosts = posts.filter(
    post => post && post.category && post.category.includes(category)
  )
  return {
    props: {
      tags,
      posts: filteredPosts,
      category,
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
