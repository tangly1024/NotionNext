import React from 'react'
import MenuButtonGroup from '@/components/MenuButtonGroup'
import InfoCard from '@/components/InfoCard'
import TagGroups from '@/components/TagGroups'
import LatestPostsGroup from '@/components/LatestPostsGroup'
import CategoryGroup from '@/components/CategoryGroup'
import Toc from '@/components/Toc'
import SearchInput from '@/components/SearchInput'
import Link from 'next/link'
import { useGlobal } from '@/lib/global'

/**
 * 侧边栏
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
const SideBar = ({ tags, currentTag, post, posts, categories, currentCategory, currentSearch }) => {
  const { locale } = useGlobal()
  return <aside id='sidebar' className='pt-10 bg-white dark:bg-gray-800 w-72 z-10 dark:border-gray-500 border-gray-200 scroll-hidden h-full'>
    <section>
      <InfoCard />
    </section>

    <div className={(!post ? 'sticky top-0' : '') + ' bg-white dark:bg-gray-800 pb-4'}>

      {/* 搜索框 */}
      <section className='p-5'>
        <SearchInput currentTag={currentTag} currentSearch={currentSearch} />
      </section>

      <section>
        <hr className='dark:border-gray-700' />
        <MenuButtonGroup allowCollapse={true} />
        <hr className='dark:border-gray-700 my-2' />
      </section>

      {/* 分类  */}
      {categories && (
        <section className='mt-2'>
          <div className='text-sm font-bold py-2 px-5  flex flex-nowrap justify-between'>
            <div className='text-black font-bold dark:text-gray-200'><i className='fa fa-th-list mr-4'/>{locale.COMMON.CATEGORY}</div>
              <Link href='/category'>
                <div className='text-gray-400 hover:text-black dark:text-gray-400 dark:hover:text-white hover:underline cursor-pointer'>
                  {locale.COMMON.MORE} <i className='fa fa-angle-double-right'/>
                </div>
              </Link>
          </div>
          <CategoryGroup currentCategory={currentCategory} categories={categories} />
        </section>
      )}

      {/* 最新文章 */}
      {posts && (
        <section className='mt-3'>
          <div className='text-sm font-bold py-2 px-5  flex flex-nowrap justify-between'>
            <div className='text-black font-bold dark:text-gray-200'><i className='fa fa-newspaper-o mr-4'/>{locale.COMMON.LATEST_POSTS}</div>
            <Link href='/blogs'>
              <div className='text-gray-400 hover:text-black dark:text-gray-400 dark:hover:text-white hover:underline cursor-pointer'>
                {locale.COMMON.MORE} <i className='fa fa-angle-double-right'/>
              </div>
            </Link>
          </div>
          <LatestPostsGroup posts={posts} />
        </section>
      )}

      {/* 标签云  */}
      {tags && (
        <section className='mt-3'>
          <div className='text-sm font-bold py-2 px-5 flex flex-nowrap justify-between'>
            <div className='text-black font-bold dark:text-gray-200'><i className='fa fa-tags mr-4'/>{locale.COMMON.TAGS}</div>
            <Link href='/tag'>
              <div className='text-gray-400 hover:text-black dark:text-gray-400 dark:hover:text-white hover:underline cursor-pointer'>
                {locale.COMMON.MORE} <i className='fa fa-angle-double-right'/>
              </div>
            </Link>
          </div>
            <div className='px-5'>
              <TagGroups tags={tags} currentTag={currentTag} />
            </div>
        </section>
      )}
    </div>

    {post && (
      <section id='left-toc' className='sticky top-0 bg-white dark:bg-gray-800'>
        <div
          className='border-b text-2xl bg-white font-bold text-black dark:bg-gray-700 dark:text-white py-6 px-6'>
          {locale.COMMON.TABLE_OF_CONTENTS}
        </div>
        <Toc toc={post.toc} />
      </section>
    )}

     <section id='blank' className='bg-white dark:bg-gray-800 py-20'/>

  </aside>
}
export default SideBar
