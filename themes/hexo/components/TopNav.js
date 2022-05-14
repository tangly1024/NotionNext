import { useGlobal } from '@/lib/global'
import throttle from 'lodash.throttle'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import CategoryGroup from './CategoryGroup'
import Collapse from './Collapse'
import Logo from './Logo'
import SearchDrawer from './SearchDrawer'
import TagGroups from './TagGroups'
import MenuButtonGroupTop from './MenuButtonGroupTop'
import MenuList from './MenuList'

let windowTop = 0

/**
 * 顶部导航
 * @param {*} param0
 * @returns
 */
const TopNav = props => {
  const { tags, currentTag, categories, currentCategory } = props
  const { locale } = useGlobal()
  const searchDrawer = useRef()

  const scrollTrigger = throttle(() => {
    const scrollS = window.scrollY
    const nav = document.querySelector('#sticky-nav')
    const header = document.querySelector('#header')
    const showNav = scrollS <= windowTop || scrollS < 5 || (header && scrollS <= header.clientHeight)// 非首页无大图时影藏顶部 滚动条置顶时隐藏

    if (!showNav) {
      nav && nav.classList.replace('top-0', '-top-20')
      windowTop = scrollS
    } else {
      nav && nav.classList.replace('-top-20', 'top-0')
      windowTop = scrollS
    }
  }, 200)

  // 监听滚动
  useEffect(() => {
    window.addEventListener('scroll', scrollTrigger)
    return () => {
      window.removeEventListener('scroll', scrollTrigger)
    }
  }, [])

  const [isOpen, changeShow] = useState(false)

  const toggleMenuOpen = () => {
    changeShow(!isOpen)
  }

  const searchDrawerSlot = <>
    { categories && (
        <section className='mt-8'>
          <div className='text-sm flex flex-nowrap justify-between font-light px-2'>
            <div className='text-gray-600 dark:text-gray-200'><i className='mr-2 fas fa-th-list' />{locale.COMMON.CATEGORY}</div>
            <Link href={'/category'} passHref>
              <a className='mb-3 text-gray-400 hover:text-black dark:text-gray-400 dark:hover:text-white hover:underline cursor-pointer'>
                {locale.COMMON.MORE} <i className='fas fa-angle-double-right' />
              </a>
            </Link>
          </div>
          <CategoryGroup currentCategory={currentCategory} categories={categories} />
        </section>
    ) }

    { tags && (
        <section className='mt-4'>
          <div className='text-sm py-2 px-2 flex flex-nowrap justify-between font-light dark:text-gray-200'>
            <div className='text-gray-600 dark:text-gray-200'><i className='mr-2 fas fa-tag'/>{locale.COMMON.TAGS}</div>
            <Link href={'/tag'} passHref>
              <a className='text-gray-400 hover:text-black  dark:hover:text-white hover:underline cursor-pointer'>
                {locale.COMMON.MORE} <i className='fas fa-angle-double-right' />
              </a>
            </Link>
          </div>
          <div className='p-2'>
            <TagGroups tags={tags} currentTag={currentTag} />
          </div>
        </section>
    ) }
    </>

  return (<div id='top-nav' className='z-40'>
    <SearchDrawer cRef={searchDrawer} slot={searchDrawerSlot}/>

    {/* 导航栏 */}
    <div id='sticky-nav' className={'top-0 shadow fixed bg-none animate__animated animate__fadeIn dark:bg-hexo-black-gray dark:text-gray-200 text-black w-full z-20 transform duration-200 font-san border-transparent  dark:border-transparent'}>
      <div className='w-full flex justify-between items-center px-4 py-2'>
        <div className='flex'>
         <Logo {...props}/>
        </div>

        {/* 右侧功能 */}
        <div className='mr-1 justify-end items-center font-serif'>
          <div className='hidden lg:flex'> <MenuButtonGroupTop {...props}/></div>
          <div onClick={toggleMenuOpen} className='w-8 justify-center items-center h-8 cursor-pointer flex lg:hidden'>
          { isOpen ? <i className='fas fa-times'/> : <i className='fas fa-bars'/> }
          </div>
        </div>
      </div>

      <Collapse type='vertical' isOpen={isOpen} className='shadow-xl'>
        <div className='bg-white dark:bg-hexo-black-gray pt-1 py-2 px-5 lg:hidden '>
          <MenuList {...props}/>
        </div>
      </Collapse>
    </div>
  </div>)
}

export default TopNav
