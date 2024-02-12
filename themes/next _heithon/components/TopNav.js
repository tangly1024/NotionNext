import { useGlobal } from '@/lib/global'
import throttle from 'lodash.throttle'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import CategoryGroup from './CategoryGroup'
import Collapse from '@/components/Collapse'
import Logo from './Logo'
import { MenuList } from './MenuList'
import SearchDrawer from './SearchDrawer'
import TagGroups from './TagGroups'
import CONFIG from '../config'
import { siteConfig } from '@/lib/config'
import { useNextGlobal } from '..'
import { useRouter } from 'next/router'

let windowTop = 0

/**
 * 顶部导航
 * @param {*} param0
 * @returns
 */
const TopNav = (props) => {
  const { tags, currentTag, categories, currentCategory } = props
  const { locale } = useGlobal()
  const searchDrawer = useRef()
  const collapseRef = useRef(null)
  const router = useRouter()

  const scrollTrigger = useCallback(throttle(() => {
    const scrollS = window.scrollY
    if (scrollS >= windowTop && scrollS > 10) {
      const nav = document.querySelector('#sticky-nav')
      nav && nav.classList.replace('top-0', '-top-40')
      windowTop = scrollS
    } else {
      const nav = document.querySelector('#sticky-nav')
      nav && nav.classList.replace('-top-40', 'top-0')
      windowTop = scrollS
    }
  }, 200), [])

  // 监听滚动
  useEffect(() => {
    if (siteConfig('NEXT_NAV_TYPE', null, CONFIG) === 'autoCollapse') {
      scrollTrigger()
      window.addEventListener('scroll', scrollTrigger)
    }
    return () => {
      siteConfig('NEXT_NAV_TYPE', null, CONFIG) === 'autoCollapse' && window.removeEventListener('scroll', scrollTrigger)
    }
  }, [])

  const [isOpen, changeShow] = useState(false)

  // 监听滚动
  useEffect(() => {
    router.events.on('routeChangeComplete', menuCollapseHide)
    return () => {
      router.events.off('routeChangeComplete', menuCollapseHide)
    }
  }, [])

  /**
   * 点击切换页面后关闭这点菜单
   */
  const menuCollapseHide = () => {
    changeShow(false)
  }

  const toggleMenuOpen = () => {
    changeShow(!isOpen)
  }

  const { searchModal } = useNextGlobal()
  const showSearchModal = () => {
    if (siteConfig('ALGOLIA_APP_ID')) {
      searchModal?.current?.openSearch()
    } else {
      searchDrawer?.current?.show()
    }
  }

  //   搜索栏
  const searchDrawerSlot = <>
        {categories && (
            <section className='mt-8'>
                <div className='text-sm flex flex-nowrap justify-between font-light px-2'>
                    <div className='text-gray-600 dark:text-gray-200'><i className='mr-2 fas fa-th-list' />{locale.COMMON.CATEGORY}</div>
                    <Link
                        href={'/category'}
                        passHref
                        className='mb-3 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white hover:underline cursor-pointer'>

                        {locale.COMMON.MORE} <i className='fas fa-angle-double-right' />

                    </Link>
                </div>
                <CategoryGroup currentCategory={currentCategory} categories={categories} />
            </section>
        )}

        {tags && (
            <section className='mt-4'>
                <div className='text-sm py-2 px-2 flex flex-nowrap justify-between font-light dark:text-gray-200'>
                    <div className='text-gray-600 dark:text-gray-200'><i className='mr-2 fas fa-tag' />{locale.COMMON.TAGS}</div>
                    <Link
                        href={'/tag'}
                        passHref
                        className='text-gray-500 hover:text-black  dark:hover:text-white hover:underline cursor-pointer'>

                        {locale.COMMON.MORE} <i className='fas fa-angle-double-right' />

                    </Link>
                </div>
                <div className='p-2'>
                    <TagGroups tags={tags} currentTag={currentTag} />
                </div>
            </section>
        )}
    </>

  return (
        <div id='top-nav' className='block lg:hidden'>
            <SearchDrawer cRef={searchDrawer} slot={searchDrawerSlot} />

            {/* 导航栏 */}
            <div id='sticky-nav' className={`${siteConfig('NEXT_NAV_TYPE', null, CONFIG) !== 'normal' ? 'fixed' : 'relative'} lg:relative w-full top-0 z-20 transform duration-500`}>
                <div className='w-full flex justify-between items-center p-4 bg-black dark:bg-gray-800 text-white'>
                    {/* 左侧LOGO 标题 */}
                    <div className='flex flex-none flex-grow-0'>
                        <div onClick={toggleMenuOpen} className='w-8 cursor-pointer'>
                            {isOpen ? <i className='fas fa-times' /> : <i className='fas fa-bars' />}
                        </div>
                    </div>

                    <div className='flex'>
                        <Logo {...props} />
                    </div>

                    {/* 右侧功能 */}
                    <div className='mr-1 flex justify-end items-center text-sm space-x-4 font-serif dark:text-gray-200'>
                        <div className="cursor-pointer block lg:hidden" onClick={showSearchModal}>
                            <i className="mr-2 fas fa-search" />
                        </div>
                    </div>
                </div>

                <Collapse collapseRef={collapseRef} type='vertical' isOpen={isOpen}>
                    <MenuList onHeightChange={(param) => collapseRef.current?.updateCollapseHeight(param)} {...props} from='top' />
                </Collapse>
            </div>

        </div>)
}

export default TopNav
