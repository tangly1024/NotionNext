import CommonHead from '@/components/CommonHead'
import { useState, createContext, useContext, useEffect } from 'react'
import Footer from './components/Footer'
import InfoCard from './components/InfoCard'
import RevolverMaps from './components/RevolverMaps'
import CONFIG_GITBOOK from './config_gitbook'
import TopNavBar from './components/TopNavBar'
import SearchInput from './components/SearchInput'
import BottomMenuBar from './components/BottomMenuBar'
import { useGlobal } from '@/lib/global'
import Live2D from '@/components/Live2D'
import BLOG from '@/blog.config'
import BlogPostListScroll from './components/BlogPostListScroll'
import ArticleInfo from './components/ArticleInfo'
import Catalog from './components/Catalog'
import { useRouter } from 'next/router'
import Announcement from './components/Announcement'
import PageNavDrawer from './components/PageNavDrawer'
import FloatTocButton from './components/FloatTocButton'
const ThemeGlobalMedium = createContext()

/**
 * 基础布局 采用左右两侧布局，移动端使用顶部导航栏

 * @returns {JSX.Element}
 * @constructor
 */
const LayoutBase = (props) => {
  const { children, meta, post, allNavPages, slotLeft, slotRight, slotTop, siteInfo } = props
  const [tocVisible, changeTocVisible] = useState(false)
  const [pageNavVisible, changePageNavVisible] = useState(false)
  const [filterPosts, setFilterPosts] = useState(allNavPages)
  const { onLoading } = useGlobal()
  const router = useRouter()

  const showTocButton = post?.toc?.length > 1

  useEffect(() => {
    setFilterPosts(allNavPages)
  }, [post])

  const LoadingCover = <div id='cover-loading' className={`${onLoading ? 'z-50 opacity-50' : '-z-10 opacity-0'} pointer-events-none transition-all duration-300`}>
        <div className='w-full h-screen flex justify-center items-center'>
            <i className="fa-solid fa-spinner text-2xl text-black dark:text-white animate-spin">  </i>
        </div>
    </div>

  return (
        <ThemeGlobalMedium.Provider value={{ tocVisible, changeTocVisible, filterPosts, setFilterPosts, allNavPages, pageNavVisible, changePageNavVisible }}>
            <CommonHead meta={meta} />

            <div id='theme-medium' className='bg-white dark:bg-hexo-black-gray w-full h-full min-h-screen justify-center dark:text-gray-300'>
                {/* 顶部导航栏 */}
                <TopNavBar {...props} />

                <main id='wrapper' className={(BLOG.LAYOUT_SIDEBAR_REVERSE ? 'flex-row-reverse' : '') + 'relative flex justify-between w-full h-full mx-auto'}>

                    {/* 左侧推拉抽屉 */}
                    <div style={{ width: '32rem' }} className={'font-sans hidden md:block border-r dark:border-transparent relative z-10 '}>
                        <div className='py-14 px-6 sticky top-0 overflow-y-scroll h-screen'>
                            {slotLeft}

                            <SearchInput className='my-3' />

                            {/* 所有文章列表 */}
                            <BlogPostListScroll posts={filterPosts} />

                        </div>
                    </div>

                    <div id='center-wrapper' className='flex flex-col justify-between w-full relative z-10 pt-12 min-h-screen'>

                        <div id='container-inner' className='w-full px-7 max-w-3xl justify-center mx-auto'>
                            {slotTop}

                            {onLoading ? LoadingCover : children}

                            {/* 回顶按钮 */}
                            <div
                                data-aos="fade-up"
                                data-aos-duration="300"
                                data-aos-once="false"
                                data-aos-anchor-placement="top-center"
                                className='fixed xl:right-80 right-2 mr-10 bottom-24 hidden lg:block z-20 '>
                                <i className='fas fa-chevron-up cursor-pointer p-2 rounded-full border bg-white dark:bg-black dark:border-gray-800' onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }} />
                            </div>
                        </div>

                        {/* 底部 */}
                        <Footer title={siteInfo?.title} />
                    </div>

                    {/*  右侧侧推拉抽屉 */}
                    <div style={{ width: '32rem' }} className={'hidden xl:block dark:border-transparent relative z-10 '}>
                        <div className='py-14 px-6 sticky top-0'>
                            <ArticleInfo post={props?.post ? props?.post : props.notice} />

                            <div className='pt-6'>
                                <Catalog {...props} />
                                {slotRight}
                                {router.route === '/' && <>
                                    <InfoCard {...props} />
                                    {CONFIG_GITBOOK.WIDGET_REVOLVER_MAPS === 'true' && <RevolverMaps />}
                                    <Live2D />
                                </>}
                                {/* gitbook主题首页只显示公告 */}
                                <Announcement {...props} />
                            </div>

                        </div>
                    </div>

                </main>

                {showTocButton && !tocVisible && <div className='md:hidden fixed right-0 bottom-52 z-30 bg-white border-l border-t border-b dark:border-gray-800 rounded'>
                    <FloatTocButton {...props}/>
                </div>}

                <PageNavDrawer {...props}/>

                {/* 移动端底部导航栏 */}
                <BottomMenuBar {...props} className='block md:hidden' />
            </div>
        </ThemeGlobalMedium.Provider>
  )
}

export default LayoutBase
export const useMediumGlobal = () => useContext(ThemeGlobalMedium)
