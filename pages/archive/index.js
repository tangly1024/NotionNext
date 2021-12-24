import { getAllCategories, getAllPosts, getAllTags } from '@/lib/notion'
import BLOG from '@/blog.config'
import BaseLayout from '@/layouts/BaseLayout'
import { getNotionPageData } from '@/lib/notion/getNotionData'
import React, { useEffect } from 'react'
import { useGlobal } from '@/lib/global'
import BlogPostArchive from '@/components/BlogPostArchive'

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
    const dateA = new Date(a?.date.start_date || a.createdTime)
    const dateB = new Date(b?.date.start_date || b.createdTime)
    return dateB - dateA
  })

  const meta = {
    title: `${locale.NAV.ARCHIVE} | ${BLOG.title}`,
    description: BLOG.description,
    type: 'website'
  }

  const archivePosts = { }

  postsSortByDate.forEach(post => {
    const date = post.date.start_date.slice(0, 7)
    if (archivePosts[date]) {
      archivePosts[date].push(post)
    } else {
      archivePosts[date] = [post]
    }
  })

  useEffect(
    () => {
      if (window) {
        const anchor = window.location.hash
        if (anchor) {
          setTimeout(() => {
            const anchorElement = document.getElementById(anchor.substring(1))
            if (anchorElement) { anchorElement.scrollIntoView({ block: 'start', behavior: 'smooth' }) }
          }, 300)
        }
      }
    },
    []
  )

  return (
    <BaseLayout meta={meta} tags={tags} categories={categories}>
        <div className='mb-10 pb-20 bg-white md:p-12 p-3 dark:bg-gray-800 rounded-xl shadow-md min-h-full'>
          {Object.keys(archivePosts).map(archiveTitle => (
             <BlogPostArchive key={archiveTitle} posts={archivePosts[archiveTitle]} archiveTitle={archiveTitle}/>
          ))}
        </div>
    </BaseLayout>
  )
}

export default Index
