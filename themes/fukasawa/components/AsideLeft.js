import Logo from './Logo'
import GroupCategory from './GroupCategory'
import { MenuList } from './MenuList'
import GroupTag from './GroupTag'
import SearchInput from './SearchInput'
import SiteInfo from './SiteInfo'
import Catalog from './Catalog'
import Announcement from './Announcement'
import { useRouter } from 'next/router'
import DarkModeButton from '@/components/DarkModeButton'
import SocialButton from './SocialButton'
import CONFIG from '@/themes/fukasawa/config'
import { AdSlot } from '@/components/GoogleAdsense'
import { siteConfig } from '@/lib/config'
import MailChimpForm from './MailChimpForm'
import { useGlobal } from '@/lib/global'
import { useEffect, useMemo, useState } from 'react'
import { isBrowser } from '@/lib/utils'
import { debounce } from 'lodash'

/**
 * 侧边栏
 * @param {*} props
 * @returns
 */
function AsideLeft(props) {
  const { tagOptions, currentTag, categoryOptions, currentCategory, post, slot, notice } = props
  const router = useRouter()
  const { fullWidth } = useGlobal()

  const FUKASAWA_SIDEBAR_COLLAPSE_SATUS_DEFAULT = fullWidth || siteConfig('FUKASAWA_SIDEBAR_COLLAPSE_SATUS_DEFAULT', null, CONFIG)

  // 侧边栏折叠从 本地存储中获取 open 状态的初始值
  const [isCollapsed, setIsCollapse] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('fukasawa-sidebar-collapse') === 'true' || FUKASAWA_SIDEBAR_COLLAPSE_SATUS_DEFAULT
    }
    return FUKASAWA_SIDEBAR_COLLAPSE_SATUS_DEFAULT
  })

  // 在组件卸载时保存 open 状态到本地存储中
  useEffect(() => {
    if (isBrowser) {
      localStorage.setItem('fukasawa-sidebar-collapse', isCollapsed)
    }
  }, [isCollapsed])

  const position = useMemo(() => {
    const isReverse = JSON.parse(siteConfig('LAYOUT_SIDEBAR_REVERSE'))
    if (isCollapsed) {
      if (isReverse) {
        return 'right-2'
      } else {
        return 'left-2'
      }
    } else {
      if (isReverse) {
        return 'right-80'
      } else {
        return 'left-80'
      }
    }
  }, [isCollapsed])

  // 折叠侧边栏
  const toggleOpen = () => {
    setIsCollapse(!isCollapsed)
  }

  // 自动折叠侧边栏 onResize 窗口宽度小于1366 || 滚动条滚动至页面的300px时 ; 将open设置为false
  useEffect(() => {
    if (!siteConfig('FUKASAWA_SIDEBAR_COLLAPSE_ON_SCROLL', false, CONFIG)) {
      return
    }
    const handleResize = debounce(() => {
      if (window.innerWidth < 1366 || window.scrollY >= 1366) {
        setIsCollapse(true)
      } else {
        setIsCollapse(false)
      }
    }, 100)

    if (post) {
      window.addEventListener('resize', handleResize)
      window.addEventListener('scroll', handleResize, { passive: true })
    }

    return () => {
      if (post) {
        window.removeEventListener('resize', handleResize)
        window.removeEventListener('scroll', handleResize, { passive: true })
      }
    }
  }, [])
 
 
  return <div className={`sideLeft relative ${isCollapsed ? 'w-0' : 'w-80'} duration-300 transition-all bg-white dark:bg-hexo-black-gray min-h-screen hidden lg:block z-20`}>
        {/* 折叠按钮 */}
    {siteConfig('FUKASAWA_SIDEBAR_COLLAPSE_BUTTON', null, CONFIG) && <div className={`${position} hidden lg:block fixed top-0 cursor-pointer hover:scale-110 duration-300 px-3 py-2   dark:text-white`} onClick={toggleOpen}>
            {isCollapsed ? <i className="fa-solid fa-indent text-xl"></i> : <i className='fas fa-bars text-xl'></i>}
        </div>}

        <div className={`h-full ${isCollapsed ? 'hidden' : 'p-8'}`}>

            <Logo {...props} />

            <section className='siteInfo flex flex-col dark:text-gray-300 pt-8'>
                {siteConfig('DESCRIPTION')}
            </section>

            <section className='flex flex-col text-gray-600'>
                <div className='w-12 my-4' />
                <MenuList {...props} />
            </section>

            <section className='flex flex-col text-gray-600'>
                <div className='w-12 my-4' />
                <SearchInput {...props} />
            </section>

            <section className='flex flex-col dark:text-gray-300'>
                <div className='w-12 my-4' />
                <Announcement post={notice} />
            </section>

            <section>
                <MailChimpForm />
            </section>

            <section>
                <AdSlot type='in-article' />
            </section>

            {router.asPath !== '/tag' && <section className='flex flex-col'>
                <div className='w-12 my-4' />
                <GroupTag tags={tagOptions} currentTag={currentTag} />
            </section>}

            {router.asPath !== '/category' && <section className='flex flex-col'>
                <div className='w-12 my-4' />
                <GroupCategory categories={categoryOptions} currentCategory={currentCategory} />
            </section>}

            <section className='flex flex-col'>
                <div className='w-12 my-4' />
                <SocialButton />
                <SiteInfo />
            </section>

            <section className='flex justify-center dark:text-gray-200 pt-4'>
                <DarkModeButton />
            </section>

            <section className='sticky top-0 pt-12  flex flex-col max-h-screen '>
                <Catalog toc={post?.toc} />
                <div className='flex justify-center'>
                    <div>{slot}</div>
                </div>
            </section>
        </div>
    </div>
}

export default AsideLeft
