import React from 'react'
import MenuButtonGroup from '@/components/MenuButtonGroup'
import InfoCard from '@/components/InfoCard'
import TagList from '@/components/TagList'
import BLOG from '@/blog.config'
import Link from 'next/link'

const SideBar = ({ tags, currentTag, post, posts }) => {
  // 按时间排序
  if (posts) {
    posts = posts.sort((a, b) => {
      const dateA = new Date(a?.date?.start_date || a.createdTime)
      const dateB = new Date(b?.date?.start_date || b.createdTime)
      return dateB - dateA
    }).slice(0, 5)
  }

  return <aside className='z-10 dark:border-gray-500 border-gray-200 bg-white hidden xl:block'>
    <div
      className='w-72 dark:bg-gray-800 h-full scroll-hidden left-0 duration-500 ease-in-out min-h-screen'>
      <div id='sidebar' className='hidden md:block sticky top-20 duration-500'>
        <>
          <InfoCard />
          <hr className='dark:border-gray-700' />
          <MenuButtonGroup allowCollapse={true} />
        </>

        {/* 最新文章 */}
        {posts && (
          <div className='mt-2'>
            <hr className='dark:border-gray-700' />
            <section
              className='text-sm font-bold py-3 px-5 text-gray-600 dark:text-gray-400 dark:hover:bg-black duration-100 flex flex-nowrap align-middle'>
              <div className='w-32'>最新文章</div>
            </section>
            <div>
                 {posts.map(post => {
                   return (
                      <Link key={post.id} title={post.title} href={`${BLOG.path}/article/${post.slug}`} >
                       <div className='text-sm py-1.5 px-5 cursor-pointer hover:underline hover:bg-gray-100 flex'>
                       <div className='w-12 overflow-hidden'>
                         <img className='w-12 w-12 object-cover cursor-pointer transform hover:scale-110 duration-500' src={post.page_cover} alt={post.title} />
                       </div>
                       <div className='w-60 ml-2 overflow-hidden whitespace-nowrap'>{post.title}</div>
                       </div>
                      </Link>
                   )
                 })}
            </div>
          </div>
        )}

        {/* 标签云  */}
        {tags && (
          <div className='mt-2'>
            <section
              className='text-sm font-bold py-3 px-5 text-gray-600 dark:text-gray-400 dark:hover:bg-black duration-100 flex flex-nowrap align-middle'>
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
