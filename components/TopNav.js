import { useRef } from 'react'
import DarkModeButton from '@/components/DarkModeButton'
import SideBarDrawer from '@/components/SideBarDrawer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import BLOG from '@/blog.config'
import Link from 'next/link'

const TopNav = ({ tags, currentTag, post, posts, currentSearch, categories, currentCategory }) => {
  const drawer = useRef()

  return (<div id='top-nav' className='block lg:hidden'>
    {/* 侧面抽屉 */}
    <SideBarDrawer post={post} currentTag={currentTag} cRef={drawer} tags={tags} posts={posts} categories={categories} currentCategory={currentCategory}/>

    {/* 导航栏 */}
    <div id='sticky-nav' className='fixed w-full top-0 z-20 transform duration-500 bg-white dark:bg-gray-700 border-b dark:border-gray-700'>
      <div className='text-sm m-auto w-full flex flex-row justify-between items-center px-4 py-2 shadow-md'>
        {/* 左侧LOGO */}
        <div className='flex ml-12'>
          <div onClick={() => { drawer.current.handleSwitchSideDrawerVisible() }}
               className='fixed top-3 left-0 z-30 ml-5 text-gray-600 text-2xl cursor-pointer dark:text-gray-300'>
            <FontAwesomeIcon icon={faBars} className='hover:scale-125 transform duration-200'
            />
          </div>
        </div>

        {/* 中间搜索框 */}
        <div className='w-96'>
          <Link href='/' passHref>
            <div className='cursor-pointer'>
             <h1 className='text-lg font-serif dark:text-gray-200 whitespace-nowrap overflow-x-hidden'>{BLOG.title }</h1>
            </div>
          </Link>
        </div>

        {/* 右侧功能 */}
        <div className='flex flex-nowrap space-x-1 ml-2 dark:text-gray-200'>
          <DarkModeButton />
        </div>
      </div>
    </div>

  </div>)
}

export default TopNav
