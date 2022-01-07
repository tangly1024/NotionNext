import BLOG from '@/blog.config'
import BaseLayout from '@/layouts/BaseLayout'
import { useGlobal } from '@/lib/global'
import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import { faFolder, faThList } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import React from 'react'

export default function Category ({ tags, allPosts, categories, postCount, latestPosts }) {
  const { locale } = useGlobal()
  const meta = {
    title: `${locale.COMMON.CATEGORY} | ${BLOG.title}`,
    description: BLOG.description,
    type: 'website'
  }
  return <BaseLayout meta={meta} totalPosts={allPosts} tags={tags} postCount={postCount} latestPosts={latestPosts}>
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
  const from = 'category-index-props'
  const { allPosts, categories, tags, postCount, latestPosts } = await getGlobalNotionData({ from })

  return {
    props: {
      tags,
      allPosts,
      categories,
      postCount,
      latestPosts
    },
    revalidate: 1
  }
}
