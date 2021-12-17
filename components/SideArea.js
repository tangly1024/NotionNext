import React from 'react'
import MenuButtonGroup from '@/components/MenuButtonGroup'
import InfoCard from '@/components/InfoCard'
import TagGroups from '@/components/TagGroups'
import LatestPostsGroup from '@/components/LatestPostsGroup'
import CategoryGroup from '@/components/CategoryGroup'
import SearchInput from '@/components/SearchInput'
import Link from 'next/link'
import { useGlobal } from '@/lib/global'
import Toc from '@/components/Toc'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDoubleRight, faArchive, faTags, faThList } from '@fortawesome/free-solid-svg-icons'

/**
 * 侧边平铺
 * @param tags
 * @param currentTag
 * @param post
 * @param posts
 * @param categories
 * @param currentCategory
 * @param currentSearch
 * @returns {JSX.Element}
 * @constructor
 */
const SideArea = ({ title, tags, currentTag, post, posts, categories, currentCategory, currentSearch }) => {
  const { locale } = useGlobal()
  return <aside id='sidebar' className='w-72 z-10 scroll-hidden h-full'>

    <section className='hidden lg:block bg-white dark:bg-gray-800 rounded-xl py-8 shadow-lg'>
      <InfoCard />
    </section>

    <div className={(!post ? 'sticky top-2' : '') + ' pb-4'}>

      {/* <hr className='dark:border-gray-700 mt-5 py-1' /> */}

      <section className='hidden lg:block mt-5 py-4 rounded-xl shadow-lg bg-white dark:bg-gray-800'>
        <MenuButtonGroup allowCollapse={true} />
        <div className='px-5 pt-2'>
           <SearchInput currentTag={currentTag} currentSearch={currentSearch} />
        </div>
      </section>

      {/* 最新文章 */}
      {posts && (
        <section className='rounded-xl shadow-lg py-4 mt-5 bg-white dark:bg-gray-800'>
          <div className='text-sm pb-2 px-5  flex flex-nowrap justify-between'>
            <div className='font-light text-gray-600  dark:text-gray-200'><FontAwesomeIcon icon={faArchive} className='mr-2' />{locale.COMMON.LATEST_POSTS}</div>
          </div>
          <LatestPostsGroup posts={posts} />
        </section>
      )}

      {/* 分类  */}
      {categories && (
        <section className='rounded-xl shadow-lg py-4 mt-5 bg-white dark:bg-gray-800'>
          <div className='text-sm px-5 flex flex-nowrap justify-between font-light'>
            <div className='pb-1 text-gray-600 dark:text-gray-200'><FontAwesomeIcon icon={faThList} className='mr-2' />{locale.COMMON.CATEGORY}</div>
            <Link href='/category' passHref>
              <a className='text-gray-400 hover:text-black dark:text-gray-400 dark:hover:text-white hover:underline cursor-pointer'>
                {locale.COMMON.MORE} <FontAwesomeIcon icon={faAngleDoubleRight} />
              </a>
            </Link>
          </div>
          <CategoryGroup currentCategory={currentCategory} categories={categories} />
        </section>
      )}

      {/* 标签云  */}
      {tags && (
        <section className='rounded-xl shadow-lg py-4 mt-5 bg-white dark:bg-gray-800'>
          <div className='text-sm pb-1 px-5 flex flex-nowrap justify-between font-light dark:text-gray-200'>
            <div className='text-gray-600 dark:text-gray-200'><FontAwesomeIcon icon={faTags} className='mr-2'/>{locale.COMMON.TAGS}</div>
            <Link href='/tag' passHref>
              <a className='text-gray-400 hover:text-black  dark:hover:text-white hover:underline cursor-pointer'>
                {locale.COMMON.MORE} <FontAwesomeIcon icon={faAngleDoubleRight} />
              </a>
            </Link>
          </div>
          <div className='px-5 pt-2'>
            <TagGroups tags={tags} currentTag={currentTag} />
          </div>
        </section>
      )}
    </div>

    {post && (
      <section id='left-toc' className='sticky pb-20 top-6 rounded-xl shadow-lg bg-white dark:bg-gray-800'>
        <div className='border-b text-2xl bg-white text-black rounded-t-xl dark:border-gray-700 dark:bg-gray-700 dark:text-white py-6 px-6'>
          {locale.COMMON.TABLE_OF_CONTENTS}
        </div>
        <Toc toc={post.toc} />
      </section>
    )}

    {/* <section id='blank' className='bg-white dark:bg-gray-800 py-20' /> */}

  </aside>
}
export default SideArea
