import { useRef } from 'react'
import SideBarDrawer from '@/components/SideBarDrawer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import BLOG from '@/blog.config'
import Link from 'next/link'
import Image from 'next/image'
import { useGlobal } from '@/lib/global'

const TopNav = ({ tags, currentTag, post, posts, currentSearch, categories, currentCategory }) => {
  const drawer = useRef()
  const { locale } = useGlobal()

  return (<div id='top-nav' className='block lg:hidden'>
    {/* 侧面抽屉 */}
    <SideBarDrawer post={post} currentTag={currentTag} cRef={drawer} tags={tags} posts={posts} categories={categories} currentCategory={currentCategory}/>

    {/* 导航栏 */}
    <div id='sticky-nav' className='fixed w-full top-0 z-20 transform duration-500 glassmorphism'>
      <div className='w-full flex justify-between items-center p-4 shadow-lg'>
        {/* 左侧LOGO */}
        <div className='flex'>
          <div className='relative w-10' ><Image
            alt={BLOG.title}
            layout='fill'
            loading='lazy'
            src='/avatar.svg'
            className='border-black'
          /></div>
          <Link href='/' passHref>
            <a>
             <h1 className='cursor-pointer ml-2 text-xl hover:scale-105 duration-200 transform font-serif dark:text-gray-200 whitespace-nowrap overflow-x-hidden'>{BLOG.title }</h1>
            </a>
          </Link>
        </div>

        {/* 右侧功能 */}
        <div className='mr-1 flex justify-end items-center text-sm flex-nowrap space-x-4 font-serif dark:text-gray-200'>
        <Link href='/'>
            <a>{locale.NAV.INDEX}</a>
          </Link>
          <Link href='/archive'>
            <a>{locale.NAV.ARCHIVE}</a>
          </Link>
          <Link href='/about'>
            <a>{locale.NAV.ABOUT}</a>
          </Link>
          <div onClick={() => { drawer.current.handleSwitchSideDrawerVisible() }}
               className='ppb-1z-30 text-gray-600 text-2xl flex items-center cursor-pointer dark:text-gray-300'>
            <FontAwesomeIcon icon={faBars} className='hover:scale-125 transform duration-200'
            />
          </div>
        </div>
      </div>
    </div>

  </div>)
}

export default TopNav
