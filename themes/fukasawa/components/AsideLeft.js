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
import { useFukasawaGlobal } from '..'
import CONFIG from '@/themes/fukasawa/config'
import { AdSlot } from '@/components/GoogleAdsense'
import { siteConfig } from '@/lib/config'
import MailChimpForm from './MailChimpForm'

/**
 * 侧边栏
 * @param {*} props
 * @returns
 */
function AsideLeft(props) {
  const { tagOptions, currentTag, categoryOptions, currentCategory, post, slot, notice } = props
  const router = useRouter()
  const { isCollapsed, setIsCollapse } = useFukasawaGlobal()
  // 折叠侧边栏
  const toggleOpen = () => {
    setIsCollapse(!isCollapsed)
  }

  // 自动折叠侧边栏 onResize 窗口宽度小于1366 || 滚动条滚动至页面的300px时 ; 将open设置为false
  //   useEffect(() => {
  //     const handleResize = debounce(() => {
  //       if (window.innerWidth < 1366 || window.scrollY >= 100) {
  //         setIsCollapse(true)
  //       } else {
  //         setIsCollapse(false)
  //       }
  //     }, 100)

  //     console.log('router', router)
  //     if (router.pathname === '/[...slug]') {
  //       window.addEventListener('resize', handleResize)
  //       window.addEventListener('scroll', handleResize, { passive: true })
  //     }

  //     return () => {
  //       if (router.pathname === '/[...slug]') {
  //         window.removeEventListener('resize', handleResize)
  //         window.removeEventListener('scroll', handleResize, { passive: true })
  //       }
  //     }
  //   }, [])

  return <div className={`sideLeft relative ${isCollapsed ? 'w-0' : 'w-80'} duration-150 transition-all bg-white dark:bg-hexo-black-gray min-h-screen hidden lg:block z-20`}>
        {/* 折叠按钮 */}
        {siteConfig('FUKASAWA_SIDEBAR_COLLAPSE_BUTTON', null, CONFIG) && <div className={`${isCollapsed ? '' : 'ml-80'} hidden lg:block sticky top-0 mx-2 cursor-pointer hover:scale-110 duration-150 px-3 py-2`} onClick={toggleOpen}>
            {isCollapsed ? <i className="fa-solid fa-indent text-xl"></i> : <i className='fas fa-bars text-xl'></i>}
        </div>}

        <div className={`h-full ${isCollapsed ? 'hidden' : 'px-8'}`}>

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

            <section className='sticky top-0 pt-12'>
                <Catalog toc={post?.toc} />
                <div className='flex justify-center'>
                    <div>{slot}</div>
                </div>
            </section>

        </div>
    </div>
}

export default AsideLeft
