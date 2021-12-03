import { getAllCategories, getAllPosts, getAllTags } from '@/lib/notion'
import BLOG from '@/blog.config'
import BaseLayout from '@/layouts/BaseLayout'
import { getNotionPageData } from '@/lib/notion/getNotionData'
import StickyBar from '@/components/StickyBar'
import React from 'react'
import { useGlobal } from '@/lib/global'
import BlogPostArchive from '@/components/BlogPostArchive'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArchive } from '@fortawesome/free-solid-svg-icons'

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
    title: `${BLOG.title} | ${locale.NAV.ARCHIVE} `,
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

  return (
    <BaseLayout meta={meta} tags={tags} categories={categories}>
      <div className='flex-grow bg-gray-200 dark:bg-black shadow-inner pt-16 '>
        <StickyBar>
          <div className='py-4 text-lg lg:mx-14 dark:text-gray-200'><FontAwesomeIcon icon={faArchive} className='mr-4'/>{locale.NAV.ARCHIVE}</div>
        </StickyBar>
        <div className='mt-20 mx-2 lg:mx-20 bg-white p-12 dark:bg-gray-800'>
          {Object.keys(archivePosts).map(archiveTitle => (
             <BlogPostArchive key={archiveTitle} posts={archivePosts[archiveTitle]} archiveTitle={archiveTitle}/>
          ))}
        </div>
      </div>
    </BaseLayout>
  )
}

export default Index
