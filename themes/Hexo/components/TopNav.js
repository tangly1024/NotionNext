import { useGlobal } from '@/lib/global'
import { faAngleDoubleRight, faBars, faTag, faThList, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import throttle from 'lodash.throttle'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import CategoryGroup from './CategoryGroup'
import Collapse from './Collapse'
import Logo from './Logo'
import MenuButtonGroup from './MenuButtonGroup'
import SearchDrawer from './SearchDrawer'
import TagGroups from './TagGroups'
import CONFIG_HEXO from '../config_hexo'
import SearchInput from './SearchInput'

let windowTop = 0

/**
 * 顶部导航
 * @param {*} param0
 * @returns
 */
const TopNav = ({ tags, currentTag, categories, currentCategory, postCount }) => {
  const { locale } = useGlobal()
  const searchDrawer = useRef()

  const scrollTrigger = throttle(() => {
    const scrollS = window.scrollY
    const nav = document.querySelector('#sticky-nav')
    if (scrollS >= windowTop && scrollS > 20) {
      nav && nav.classList.replace('top-0', '-top-16')
      windowTop = scrollS
    } else {
      nav && nav.classList.replace('-top-16', 'top-0')
      windowTop = scrollS
    }
  }, 200)

  // 监听滚动
  useEffect(() => {
    if (CONFIG_HEXO.NAV_TYPE === 'autoCollapse') {
      scrollTrigger()
      window.addEventListener('scroll', scrollTrigger)
    }
    return () => {
      CONFIG_HEXO.NAV_TYPE === 'autoCollapse' && window.removeEventListener('scroll', scrollTrigger)
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
            <div className='text-gray-600 dark:text-gray-200'><FontAwesomeIcon icon={faThList} className='mr-2' />{locale.COMMON.CATEGORY}</div>
            <Link href={'/category'} passHref>
              <a className='mb-3 text-gray-400 hover:text-black dark:text-gray-400 dark:hover:text-white hover:underline cursor-pointer'>
                {locale.COMMON.MORE} <FontAwesomeIcon icon={faAngleDoubleRight} />
              </a>
            </Link>
          </div>
          <CategoryGroup currentCategory={currentCategory} categories={categories} />
        </section>
    ) }

    { tags && (
        <section className='mt-4'>
          <div className='text-sm py-2 px-2 flex flex-nowrap justify-between font-light dark:text-gray-200'>
            <div className='text-gray-600 dark:text-gray-200'><FontAwesomeIcon icon={faTag} className='mr-2'/>{locale.COMMON.TAGS}</div>
            <Link href={'/tag'} passHref>
              <a className='text-gray-400 hover:text-black  dark:hover:text-white hover:underline cursor-pointer'>
                {locale.COMMON.MORE} <FontAwesomeIcon icon={faAngleDoubleRight} />
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
    <div id='sticky-nav' className={`${CONFIG_HEXO.NAV_TYPE !== 'normal' ? 'fixed' : ''} bg-white  bg-opacity-70 text-black w-full top-0 z-20 transform duration-500 font-sans`}>
      <div className='w-full flex justify-between items-center p-4  shadow-md'>
        <div className='flex'>
         <Logo/>
        </div>

        {/* 右侧功能 */}
        <div className='mr-1 flex lg:hidden justify-end items-center text-sm space-x-4 font-serif dark:text-gray-200'>
          <div onClick={toggleMenuOpen} className='w-8 cursor-pointer'>
          { isOpen ? <FontAwesomeIcon icon={faTimes} size={'lg'}/> : <FontAwesomeIcon icon={faBars} size={'lg'}/> }
          </div>
        </div>
      </div>

      <Collapse isOpen={isOpen} className='shadow-xl'>
        <div className='bg-white pt-1 py-2 px-5'>
          <MenuButtonGroup postCount={postCount}/>
          <SearchInput/>
        </div>
      </Collapse>
    </div>

  </div>)
}

export default TopNav
