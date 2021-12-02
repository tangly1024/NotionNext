import { getAllCategories, getAllPosts, getAllTags } from '@/lib/notion'
import BLOG from '@/blog.config'
import BaseLayout from '@/layouts/BaseLayout'
import BlogPostListScroll from '@/components/BlogPostListScroll'
import { getNotionPageData } from '@/lib/notion/getNotionData'
import StickyBar from '@/components/StickyBar'
import React from 'react'
import { useGlobal } from '@/lib/global'

export async function getStaticProps () {
  const from = 'index'
  const notionPageData = await getNotionPageData({ from })
  const allPosts = await getAllPosts({ notionPageData, from })
  const categories = await getAllCategories(allPosts)
  const tagOptions = notionPageData.tagOptions
  const tags = await getAllTags({ allPosts, tagOptions })
  return {
    props: {
      allPosts,
      tags,
      categories
    },
    revalidate: 1
  }
}

const Index = ({ allPosts, tags, categories }) => {
  const { locale } = useGlobal()
  // 深拷贝
  const postsSortByDate = Object.create(allPosts)

  // 时间排序
  postsSortByDate.sort((a, b) => {
    const dateA = new Date(a?.lastEditedTime || a.createdTime)
    const dateB = new Date(b?.lastEditedTime || b.createdTime)
    return dateB - dateA
  })

  const meta = {
    title: `${BLOG.title} | ${locale.COMMON.LATEST_POSTS} `,
    description: BLOG.description,
    type: 'website'
  }

  return (
    <BaseLayout meta={meta} tags={tags} categories={categories}>
      <div className='flex-grow bg-gray-200 dark:bg-black shadow-inner pt-16'>
        <StickyBar>
          <div className='py-4 text-lg lg:mx-14'><i className='fa fa-newspaper-o mr-4'/>{locale.COMMON.LATEST_POSTS}</div>
        </StickyBar>
        <BlogPostListScroll posts={postsSortByDate} tags={tags} />
      </div>
    </BaseLayout>
  )
}

export default Index
