import React from 'react'
import TocBar from '@/components/TocBar'
import MenuButtonGroup from '@/components/MenuButtonGroup'

const SideBar = ({ tags, currentTag, post }) => {
  return <aside className='z-10 bg-white dark:border-gray-500 border-gray-200 hidden xl:block'>
    <div className='dark:bg-gray-800 border-r dark:border-gray-700 h-full scroll-hidden left-0 duration-500 ease-in-out min-h-screen'>
      <div className='hidden md:block sticky top-16'>
        <div className={post ? 'hidden 2xl:block' : 'block'}>
          <MenuButtonGroup allowCollapse={true}/>
        </div>
      </div>

      {post && (
        <div className='sticky top-12'>
          <TocBar toc={post.toc} />
        </div>
      )}
    </div>
  </aside>
}
export default SideBar
