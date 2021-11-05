import { useRef } from 'react'
import DarkModeButton from '@/components/DarkModeButton'
import SearchInput from '@/components/SearchInput'
import SideBarDrawer from '@/components/SideBarDrawer'

const TopNav = ({ tags, currentTag, post, posts, currentSearch, categories, currentCategory }) => {
  const drawer = useRef()

  return (<>
    {/* 侧面抽屉 */}
    <SideBarDrawer post={post} currentTag={currentTag} cRef={drawer} tags={tags} posts={posts} categories={categories} currentCategory={currentCategory}/>

    {/* 导航栏 */}
    <div id='sticky-nav' className='fixed w-full top-0 z-20 transform duration-500 bg-white dark:bg-gray-900 border-b dark:border-gray-700'>
      <div className='text-sm m-auto w-full flex flex-row justify-between items-center px-4 py-2 shadow-md'>
        {/* 左侧LOGO */}
        <div className='flex ml-12'>
          <div onClick={() => { drawer.current.handleSwitchSideDrawerVisible() }}
               className='fixed top-3 left-0 z-30 py-1 px-5 text-gray-600 text-2xl cursor-pointer dark:text-gray-300'>
            <i className='fa hover:scale-125 transform duration-200 fa-bars '
            />
          </div>
        </div>

        {/* 中间搜索框 */}
        <div className='w-96'>
          <SearchInput currentTag={currentTag} currentSearch={currentSearch}/>
        </div>

        {/* 右侧功能 */}
        <div className='flex flex-nowrap space-x-1 ml-2'>
          <DarkModeButton />
        </div>
      </div>
    </div>

  </>)
}

export default TopNav
