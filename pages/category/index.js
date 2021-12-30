import { getAllCategories, getAllPosts, getAllTags } from '@/lib/notion'
import BLOG from '@/blog.config'
import BaseLayout from '@/layouts/BaseLayout'
import { getNotionPageData } from '@/lib/notion/getNotionData'
import { useGlobal } from '@/lib/global'
import React from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder, faThList } from '@fortawesome/free-solid-svg-icons'

export default function Category ({ tags, allPosts, categories }) {
  const { locale } = useGlobal()
  const meta = {
    title: `${locale.COMMON.CATEGORY} | ${BLOG.title}`,
    description: BLOG.description,
    type: 'website'
  }
  return <BaseLayout meta={meta} totalPosts={allPosts} tags={tags}>
      <div className='bg-white dark:bg-gray-700 px-10 py-10 shadow'>
        <div className='dark:text-gray-200 mb-5'><FontAwesomeIcon icon={faThList} className='mr-4' />{locale.COMMON.CATEGORY}:</div>
        <div id='category-list' className='duration-200 flex flex-wrap'>
          {Object.keys(categories).map(category => {
            return <Link key={category} href={`/category/${category}`} passHref>
              <div className={'hover:text-black dark:hover:text-white dark:text-gray-300 dark:hover:bg-gray-600 px-5 cursor-pointer py-2 hover:bg-gray-100'}>
                <FontAwesomeIcon icon={faFolder} className='mr-4' />{category}({categories[category]})</div>
            </Link>
          })}
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
