import { getAllCategories, getAllPosts, getAllTags } from '@/lib/notion'
import BLOG from '@/blog.config'
import BaseLayout from '@/layouts/BaseLayout'
import TagItem from '@/components/TagItem'
import { getNotionPageData } from '@/lib/notion/getNotionData'
import { useGlobal } from '@/lib/global'
import CategoryGroup from '@/components/CategoryGroup'
import React from 'react'
import Link from 'next/link'

export default function Category ({ tags, allPosts, categories }) {
  const { locale } = useGlobal()
  const meta = {
    title: `${BLOG.title} | ${locale.COMMON.CATEGORY}`,
    description: BLOG.description,
    type: 'website'
  }
  return <BaseLayout meta={meta} totalPosts={allPosts} tags={tags}>
    <div className='flex-grow bg-gray-200 dark:bg-black shadow-inner p-14'>
    <div className='bg-white dark:bg-gray-700 px-10 py-10 mt-20 lg:mt-16'>
      <div className='dark:text-gray-200 mb-5'>{locale.COMMON.TAGS}:</div>
      <div id='category-list' className='duration-200 flex flex-wrap'>
        {Object.keys(categories).map(category => {
          return <Link key={category} href={`/category/${category}`}>
            <div className={'hover:text-black dark:hover:text-white dark:hover:bg-gray-600 px-5 cursor-pointer py-2 hover:bg-gray-100'}><i className='fa fa-folder-open-o mr-4'/>{category}({categories[category]})</div>
          </Link>
        })}      </div>
    </div>
    </div>
  </BaseLayout>
}

export async function getStaticProps () {
  const from = 'tag-index-props'
  const notionPageData = await getNotionPageData({ from })
  const allPosts = await getAllPosts({ notionPageData, from })
  const categories = await getAllCategories(allPosts)
  const tagOptions = notionPageData.tagOptions
  const tags = await getAllTags({ allPosts, sliceCount: 12, tagOptions })
  return {
    props: {
      tags,
      allPosts,
      categories
    },
    revalidate: 1
  }
}
