import BLOG from '@/blog.config'
import SideBarDrawer from '@/components/SideBarDrawer'
import { useGlobal } from '@/lib/global'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { useCallback, useEffect, useRef } from 'react'
import Image from 'next/image'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import throttle from 'lodash.throttle'

let windowTop = 0

/**
 * 顶部导航
 * @param {*} param0
 * @returns
 */
const TopNav = ({ tags, currentTag, post, posts, categories, currentCategory, autoHide = true }) => {
  const drawer = useRef()
  const { locale } = useGlobal()

  const scrollTrigger = useCallback(throttle(() => {
    const scrollS = window.scrollY
    if (scrollS >= windowTop && scrollS > 10) {
      const nav = document.querySelector('#sticky-nav')
      nav && nav.classList.replace('top-0', '-top-16')
      windowTop = scrollS
    } else {
      const nav = document.querySelector('#sticky-nav')
      nav && nav.classList.replace('-top-16', 'top-0')
      windowTop = scrollS
    }
  }, 200))

  // 监听滚动
  useEffect(() => {
    if (autoHide) {
      scrollTrigger()
      window.addEventListener('scroll', scrollTrigger)
    }
    return () => {
      autoHide && window.removeEventListener('scroll', scrollTrigger)
    }
  }, [])

  return (<div id='top-nav'>
    {/* 侧面抽屉 */}
    <SideBarDrawer post={post} currentTag={currentTag} cRef={drawer} tags={tags} posts={posts} categories={categories} currentCategory={currentCategory}/>

    {/* 导航栏 */}
    <div id='sticky-nav' className='flex animate__animated animate__fadeIn fixed lg:relative w-full top-0 z-20 transform duration-500'>
      <div className='w-full flex justify-between items-center p-4 glassmorphism'>
        {/* 左侧LOGO 标题 */}
        <div className='flex flex-none flex-grow-0'>
          <div onClick={() => { drawer.current.handleSwitchSideDrawerVisible() }}
               className='w-8 cursor-pointer dark:text-gray-300 block lg:hidden'>
            <FontAwesomeIcon icon={faBars} size={'lg'}/>
          </div>
          <div className='relative w-10 hidden lg:block' ><Image
            alt={BLOG.title}
            layout='fill'
            loading='lazy'
            src='/favicon.svg'
            className='border-black'
          /></div>
          <Link href='/' passHref>
            <a>
             <h1 className='cursor-pointer ml-2 w-full hover:scale-105 duration-200 transform font-serif dark:text-gray-200 whitespace-nowrap overflow-x-hidden'>{ BLOG.title }</h1>
            </a>
          </Link>
        </div>

        {/* 右侧功能 */}
        <div className='mr-1 flex flex-nowrap flex-grow justify-end items-center text-sm space-x-4 font-serif dark:text-gray-200'>
        <Link href='/'>
            <a>{locale.NAV.INDEX}</a>
          </Link>
          <Link href='/archive'>
            <a>{locale.NAV.ARCHIVE}</a>
          </Link>
          <Link href='/about'>
            <a>{locale.NAV.ABOUT}</a>
          </Link>
        </div>
      </div>
    </div>

  </div>)
}

export default TopNav
