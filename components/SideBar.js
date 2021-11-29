import React from 'react'
import MenuButtonGroup from '@/components/MenuButtonGroup'
import InfoCard from '@/components/InfoCard'
import TagGroups from '@/components/TagGroups'
import LatestPosts from '@/components/LatestPosts'
import CategoryGroup from '@/components/CategoryGroup'
import Toc from '@/components/Toc'
import SearchInput from '@/components/SearchInput'
import Link from 'next/link'

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
          <CategoryGroup currentCategory={currentCategory} categories={categories} />
        </section>
      )}

      {/* 最新文章 */}
      {posts && (
        <section className='mt-2'>
          <LatestPosts posts={posts} />
        </section>
      )}

      {/* 标签云  */}
      {tags && (
        <section className='mt-2'>
          <section
            className='text-sm font-bold py-3 px-5 text-gray-600 dark:text-gray-400 duration-100 flex flex-nowrap justify-between'>
            <div>标签</div>
            <div><Link href='/tag'><div className='hover:underline cursor-pointer opacity-50'>更多标签</div></Link></div>
          </section>
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
          文章目录
        </div>
        <Toc toc={post.toc} />
      </section>
    )}

     <section id='blank' className='bg-white dark:bg-gray-800 py-20'/>

  </aside>
}
export default SideBar
