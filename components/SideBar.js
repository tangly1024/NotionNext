import React from 'react'
import MenuButtonGroup from '@/components/MenuButtonGroup'
import InfoCard from '@/components/InfoCard'
import TagList from '@/components/TagList'

const SideBar = ({ tags, currentTag, post }) => {
  return <aside className='z-10 dark:border-gray-500 border-gray-200 bg-white hidden md:block'>
    <div
      className='dark:bg-gray-800 border-r dark:border-gray-700 h-full scroll-hidden left-0 duration-500 ease-in-out min-h-screen'>
      <div id='sidebar' className='hidden md:block sticky top-20 duration-500'>
        <div className={post ? 'block' : 'hidden xl:block'}>
          <InfoCard />
          <hr className='dark:border-gray-700' />
          <MenuButtonGroup allowCollapse={true} />
        </div>

        {tags && (
          <div>
            {/* 标签云  */}
            <hr className='dark:border-gray-700' />
            <section
              className='py-3 px-5 text-gray-600 dark:text-gray-400 dark:hover:bg-black duration-100 flex flex-nowrap align-middle'>
              <div className='my-auto w-5 text-xl justify-center flex'>
                <i className='fa fa-tags' />
              </div>
              <div className='ml-4 w-32'>标签</div>
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
