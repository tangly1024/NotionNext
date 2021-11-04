import React from 'react'
import MenuButtonGroup from '@/components/MenuButtonGroup'
import InfoCard from '@/components/InfoCard'
import TagList from '@/components/TagList'
import LatestPosts from '@/components/LatestPosts'

const SideBar = ({ tags, currentTag, post, posts }) => {
  // 按时间排序
  if (posts) {
    posts = posts.sort((a, b) => {
      const dateA = new Date(a?.lastEditedTime || a.createdTime)
      const dateB = new Date(b?.lastEditedTime || b.createdTime)
      return dateB - dateA
    }).slice(0, 5)
  }

  return <aside className='z-10 dark:border-gray-500 border-gray-200 bg-white hidden xl:block'>
    <div
      className='w-72 dark:bg-gray-800 h-full scroll-hidden left-0 duration-500 ease-in-out min-h-screen'>
      <div id='sidebar' className='hidden md:block sticky top-20 pb-56 duration-500'>
        <>
          <InfoCard />
          <hr className='dark:border-gray-700' />
          <MenuButtonGroup allowCollapse={true} />
        </>

        <hr className='dark:border-gray-700 my-2' />

        {/* 最新文章 */}
        {posts && (
          <div className='mt-2'>
            <LatestPosts posts={posts}/>
          </div>
        )}

        {/* 标签云  */}
        {tags && (
          <div className='mt-2'>
            <section
              className='text-sm font-bold py-3 px-5 text-gray-600 dark:text-gray-400 duration-100 flex flex-nowrap align-middle'>
              <div className='w-32'>标签</div>
            </section>
            <div className='px-5'>
              <TagList tags={tags} currentTag={currentTag} />
            </div>
          </div>
        )}

      </div>
    </div>
  </aside>
}
export default SideBar
