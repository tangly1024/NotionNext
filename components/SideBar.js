import React from 'react'
import MenuButtonGroup from '@/components/MenuButtonGroup'
import InfoCard from '@/components/InfoCard'
import TagList from '@/components/TagList'

const SideBar = ({ tags, currentTag, post }) => {
  return <aside className='z-10 dark:border-gray-500 border-gray-200 bg-white hidden md:block'>
    <div className='dark:bg-gray-800 border-r dark:border-gray-700 h-full scroll-hidden left-0 duration-500 ease-in-out min-h-screen'>
      <div className='hidden md:block sticky top-16'>

        <InfoCard/>
        <div className={post ? 'hidden xl:block' : 'block'}>
          <MenuButtonGroup allowCollapse={true}/>
        </div>

        {tags && (
          <div className='p-4'>
            {/* 标签云  */}
            <section>
              <strong className='text-xl text-gray-600 dark:text-gray-400'>标签</strong>
              <TagList tags={tags} currentTag={currentTag} />
            </section>
          </div>
        )}

      </div>
    </div>
  </aside>
}
export default SideBar
