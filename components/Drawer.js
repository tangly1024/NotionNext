import SearchInput from '@/components/SearchInput'
import MenuButtonGroup from '@/components/MenuButtonGroup'
import React, { useImperativeHandle, useState } from 'react'
import InfoCard from '@/components/InfoCard'
import TagList from '@/components/TagList'
import Logo from '@/components/Logo'
import LatestPosts from '@/components/LatestPosts'
import PostsCategories from '@/components/PostsCategories'

/**
 * 抽屉面板，可以从侧面拉出
 * @returns {JSX.Element}
 * @constructor
 */
const Drawer = ({ post, currentTag, cRef, tags, posts, categories, currentCategory }) => {
  // 暴露给父组件 通过cRef.current.handleMenuClick 调用
  useImperativeHandle(cRef, () => {
    return {
      handleMenuClick: () => handleMenuClick()
    }
  })
  const [isHidden, changeHiddenStatus] = useState(true)
  // 点击按钮更改侧边抽屉状态
  const handleMenuClick = () => {
    changeHiddenStatus(!isHidden)
  }
  return <>
    <div className='fixed top-0 left-0 z-50 h-screen shadow-2xl bg-white dark:bg-gray-800'>
      {/* LOGO */}
      <div
        className={(isHidden ? '-ml-72' : '') + ' duration-200 w-72  border-r dark:border-gray-600'}>
        <div className='w-72 flex space-x-4 px-5 py-1 dark:border-gray-500 '>
          <div
            className='z-10 py-2 duration-200 mr-2 text-gray-600 text-xl cursor-pointer dark:text-gray-300'>
            <i className='fa hover:scale-125 transform duration-200 fa-bars ' onClick={handleMenuClick} />
          </div>
         <Logo/>
        </div>
      </div>

      {/* 侧边菜单 */}
      <div
        className={(isHidden ? '-ml-72' : 'shadow-2xl') + ' overflow-y-scroll h-screen w-72 duration-200 overflow-y-auto'}>
        <div className='pb-56'>
          {/* 搜索框 */}
          <div className='px-5 my-3 block md:hidden'>
            <SearchInput currentTag={currentTag} />
          </div>

          {/* 信息卡 */}
          <InfoCard />
          <hr className='dark:border-gray-700' />
          <MenuButtonGroup allowCollapse={true} />

          <hr className='dark:border-gray-700 my-2' />

          {/* 最新文章 */}
          {posts && (
            <div className='mt-2 sticky top-0'>
              <LatestPosts posts={posts}/>
            </div>
          )}

          {/* 分类  */}
          {categories && (
            <div className='mt-2'>
              <PostsCategories currentCategory={currentCategory} categories={categories}/>
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
    </div>
    {/* 背景蒙版 */}
    <div id='drawer-background' className={(isHidden ? 'hidden' : 'block') + ' fixed top-0 left-0 z-30 w-full h-full bg-black bg-opacity-30'}
         onClick={handleMenuClick} />
  </>
}
export default Drawer
