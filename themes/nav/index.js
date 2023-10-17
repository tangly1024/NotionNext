'use client'

import CONFIG from './config'
import { useRouter } from 'next/router'
import { useEffect, useState, createContext, useContext } from 'react'
import { isBrowser } from '@/lib/utils'
import Footer from './components/Footer'
import InfoCard from './components/InfoCard'
import RevolverMaps from './components/RevolverMaps'
import TopNavBar from './components/TopNavBar'
import SearchInput from './components/SearchInput'
import { useGlobal } from '@/lib/global'
import Live2D from '@/components/Live2D'
import BLOG from '@/blog.config'
import NavPostList from './components/NavPostList'
import ArticleInfo from './components/ArticleInfo'
import Catalog from './components/Catalog'
import Announcement from './components/Announcement'
import PageNavDrawer from './components/PageNavDrawer'
import FloatTocButton from './components/FloatTocButton'
import { AdSlot } from '@/components/GoogleAdsense'
import JumpToTopButton from './components/JumpToTopButton'
import ShareBar from '@/components/ShareBar'
import CategoryItem from './components/CategoryItem'
import TagItemMini from './components/TagItemMini'
import ArticleAround from './components/ArticleAround'
import Comment from '@/components/Comment'
import TocDrawer from './components/TocDrawer'
import NotionPage from '@/components/NotionPage'
import { ArticleLock } from './components/ArticleLock'
import { Transition } from '@headlessui/react'
import { Style } from './style'
import CommonHead from '@/components/CommonHead'
import BlogArchiveItem from './components/BlogArchiveItem'
import BlogPostListAll from './components/BlogPostListAll'
import BlogPostListPage from './components/BlogPostListPage'
import BlogPostCard from './components/BlogPostCard'
import LogoBar from './components/LogoBar'
import Link from 'next/link'
import dynamic from 'next/dynamic'
const WWAds = dynamic(() => import('@/components/WWAds'), { ssr: false })

import { MenuItem } from './components/MenuItem'

// 主题全局变量
const ThemeGlobalNav = createContext()
export const useNavGlobal = () => useContext(ThemeGlobalNav)

/**
 * 基础布局
 * 采用左右两侧布局，移动端使用顶部导航栏
 * @returns {JSX.Element}
 * @constructor
 */
const LayoutBase = (props) => {
  const { customMenu, children, post, allNavPages, categoryOptions, slotLeft, slotRight, slotTop, meta } = props
  const { onLoading } = useGlobal()
  const router = useRouter()
  const [tocVisible, changeTocVisible] = useState(false)
  const [pageNavVisible, changePageNavVisible] = useState(false)
  const [filteredNavPages, setFilteredNavPages] = useState(allNavPages)

  const showTocButton = post?.toc?.length > 1

  useEffect(() => {
    setFilteredNavPages(allNavPages)
  }, [post])

  let links = customMenu
  // let categoryOptions = filteredNavPages

  return (
        <ThemeGlobalNav.Provider value={{ tocVisible, changeTocVisible, filteredNavPages, setFilteredNavPages, allNavPages, pageNavVisible, changePageNavVisible, categoryOptions }}>
            <CommonHead meta={meta}/>
            {/* <Head>
                <script>
                  // Stack - 自动将数据库卡片视图下的卡片链接替换为网址
                  // 获取所有的notion-collection-card元素
                  document.addEventListener("DOMContentLoaded", function() {
                    console.log("DOM content loaded!");
                    updateHref();
                  });
                    
                  // 创建一个MutationObserver对象，用于监听body元素的变化
                  let observer = new MutationObserver(function(mutations) {
                    // 遍历每个变化记录
                    for (let mutation of mutations) {
                      // 如果变化类型是子节点变化
                      if (mutation.type === "childList") {
                        // 调用一个函数，用于更新notion-collection-card元素的href属性
                        updateHref();
                      }
                    }
                  });
    
                  // 定义一个函数，用于更新notion-collection-card元素的href属性
                  function updateHref() {
                    let cards = document.querySelectorAll(".notion-collection-card");;
                    // 遍历每个元素
                    for (let card of cards) {
                      // 获取该元素下的最后一个notion-property元素
                      let lastProperty = card.querySelector(".notion-collection-card-property:last-child");
                      // 如果该元素存在，并且包含一个网址
                      if (lastProperty && lastProperty.textContent.startsWith("http")) {
                        // 获取该网址
                        let url = lastProperty.textContent;
                        // 将该元素的href属性设置为该网址
                        if(card.href == url) continue;
                        card.href = url;
                        // 将该元素的target属性设置为"_blank"，使链接在新窗口或标签页中打开
                        card.target = "_blank";
                      }
                    }
                  }
    
                  //   console.log("load");
                  // 在页面载入时，调用一次updateHref函数，并将isLoaded设为true
                  window.addEventListener("load", function() {
                    console.log("window load");
                    updateHref();
                  });
    
                  // 在页面大小改变时，调用一次updateHref函数
                  // window.addEventListener("resize", updateHref);
    
                  // 开始监听body元素的变化，配置选项为子节点变化和子孙节点变化
                  observer.observe(document.body, {childList: true, subtree: true});
    
                  // 在每个变化记录之后，检查isLoaded是否为true，如果是，则执行updateHref函数
                  // observer.disconnect(); // 停止监听body元素的变化
                  // observer.observe(document.body, {childList: true, subtree: true}); // 重新开始监听body元素的变化
                </script>
            </Head> */}
            <Style/>

            <div id='theme-onenav' className=' dark:bg-hexo-black-gray w-full h-screen min-h-screen justify-center dark:text-gray-300'>
                {/* 顶部导航栏 */}
                <TopNavBar {...props} />
                <div id='nav-bg' className=' fixed -top-20 w-full h-14 z-20 shadow glassmorphism duration-300 transition-all '
                data-aos="fade-up"
                data-aos-duration="300"
                data-aos-once="false"
                data-aos-anchor-placement="top-center"
                >a</div>

                <main id='wrapper' className={(BLOG.LAYOUT_SIDEBAR_REVERSE ? 'flex-row-reverse' : '') + 'relative flex justify-between w-full h-screen mx-auto'}>

                        {/* 左侧图标Logo */}
                        <div className='absolute top-0 left-5 md:left-4 z-40 pt-3 md:pt-4 md:pt-0'>
                          <LogoBar {...props} />
                        </div>
                    {/* 左侧推拉抽屉 */}
                    <div className={'font-sans hidden md:block dark:border-transparent relative z-10 ml-4 h- max-h-full pb-44'}>

                        <div className='main-menu z-20 w-48 mt-20 pl-9 pr-7 pb-5 sticky pt-1 top-0 overflow-y-scroll h-fit max-h-full scroll-hidden bg-white dark:bg-neutral-800 rounded-xl '>
                            {slotLeft}
                            <div className='grid pt-2'>
                                {/* 所有文章列表 */}
                                {CONFIG.USE_CUSTEM_MENU && links && links?.map((link, index) => <MenuItem key={index} link={link} />)}
                                {/* {!CONFIG.USE_CUSTEM_MENU && <NavPostList {...props}/>} */}
                                {/* {links && links?.map((link, index) => {

                                })} */}
                                
                                {/* href={`/category/${category.name}`} */}
                                {!CONFIG.USE_CUSTEM_MENU && categoryOptions && categoryOptions?.map(category => {
                                  // let selected = currentCategory === category.name
                                  let selected = false;
                                  return (
                                    <Link
                                      key={category.name}
                                      href={`#${category.name}`}
                                      passHref
                                      className={(selected
                                        ? 'hover:text-black dark:hover:text-neutral text-black '
                                        : 'dark:text-neutral-400 text-gray-500 hover:text-black dark:hover:text-white ') +
                                        '  text-sm text-gray w-full items-center duration-300 px-2  cursor-pointer py-1 font-light pt-2 pb-2'}>

                                      <div className='font-bold '> <i className={`mr-2 fas ${selected ? 'fa-folder-open' : 'fa-hashtag'}`} />{category.name}({category.count})</div>

                                    </Link>
                                  )
                                })}
                            </div>

                        </div>

                        <div className='w-56 fixed left-0 bottom-0 z-0'>
                            <Footer {...props} />
                        </div>
                    </div>

                    <div id='center-wrapper' className='flex flex-col justify-between w-full relative z-10 pt-20 md:pt-5 pb-8 min-h-screen overflow-y-auto'>

                        <div id='container-inner' className='w-full px-6 pb-6 md:pb-20 max-w-8xl justify-center mx-auto'>
                            {slotTop}
                            <WWAds className='w-full' orientation='horizontal'/>

                            <Transition
                                show={!onLoading}
                                appear={true}
                                enter="transition ease-in-out duration-700 transform order-first"
                                enterFrom="opacity-0 translate-y-16"
                                enterTo="opacity-100"
                                leave="transition ease-in-out duration-300 transform"
                                leaveFrom="opacity-100 translate-y-0"
                                leaveTo="opacity-0 -translate-y-16"
                                unmount={false}
                            >
                                {children}
                            </Transition>

                            {/* Google广告 */}
                            <AdSlot type='in-article' />
                            <WWAds className='w-full' orientation='horizontal'/>

                            {/* 回顶按钮 */}
                            <JumpToTopButton />
                        </div>

                        {/* 底部 */}
                        <div className='md:hidden'>
                            <Footer {...props} />
                        </div>
                    </div>

                    {/*  右侧侧推拉抽屉 */}
                    {/*<div style={{ width: '32rem' }} className={'hidden xl:block dark:border-transparent relative z-10 '}>
                        <div className='py-14 px-6 sticky top-0'>
                            <ArticleInfo post={props?.post ? props?.post : props.notice} />

                            <div className='py-4'>
                                <Catalog {...props} />
                                {slotRight}
                                {router.route === '/' && <>
                                    <InfoCard {...props} />
                                    {CONFIG.WIDGET_REVOLVER_MAPS === 'true' && <RevolverMaps />}
                                    <Live2D />
                                </>}*/}
                                {/* onenav主题首页只显示公告 */}
                                {/*<Announcement {...props} />
                            </div>

                            <AdSlot type='in-article' />
                            <Live2D />

                        </div>
                    </div>*/}

                </main>

                {/* 移动端悬浮目录按钮 */}
                {showTocButton && !tocVisible && <div className='md:hidden fixed right-0 bottom-52 z-30 bg-white border-l border-t border-b dark:border-neutral-800 rounded'>
                    <FloatTocButton {...props} />
                </div>}

                {/* 移动端导航抽屉 */}
                <PageNavDrawer {...props} filteredNavPages={filteredNavPages} />

                {/* 移动端底部导航栏 */}
                {/* <BottomMenuBar {...props} className='block md:hidden' /> */}

            </div>
        </ThemeGlobalNav.Provider>
  )
}


/**
 * 首页
 * @param {*} props
 * @returns 此主题首页就是列表
 */
const LayoutIndex = props => {
  return <LayoutPostListIndex {...props} />
}

/**
 * 首页列表
 * @param {*} props
 * @returns
 */
const LayoutPostListIndex = props => {
  // const { customMenu, children, post, allNavPages, categoryOptions, slotLeft, slotRight, slotTop, meta } = props
  // const [filteredNavPages, setFilteredNavPages] = useState(allNavPages)
  return (
    <LayoutBase {...props} >
        <Announcement {...props} />
        <BlogPostListAll { ...props } />
    </LayoutBase>
  )
}

/**
 * 首页
 * @param {*} props
 * @returns 此主题首页就是列表
 */
const LayoutIndexNew = props => {
  return <LayoutPostList props={[customMenu, filteredNavPages]} />
}

/**
 * 文章列表
 * @param {*} props
 * @returns
 */
const LayoutPostList = props => {
  const { posts, category, tag } = props
  // 顶部如果是按照分类或标签查看文章列表，列表顶部嵌入一个横幅
  // 如果是搜索，则列表顶部嵌入 搜索框
  return (
    <LayoutBase {...props} >
        <div className='w-full max-w-7xl mx-auto justify-center mt-8'>
            <div id='posts-wrapper' class='card-list grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
                {posts?.map(post => (
                    <BlogPostCard key={post.id} post = {post} className='card' />
                ))}
            </div>
        </div>
    </LayoutBase>
  )
}

/**
 * 首页
 * 重定向到某个文章详情页
 * @param {*} props
 * @returns
 */
const LayoutIndexCustemPage = (props) => {
  const router = useRouter()
  useEffect(() => {
    router.push(CONFIG.INDEX_PAGE).then(() => {
      // console.log('跳转到指定首页', CONFIG.INDEX_PAGE)
      setTimeout(() => {
        if (isBrowser) {
          const article = document.getElementById('notion-article')
          if (!article) {
            console.log('请检查您的Notion数据库中是否包含此slug页面： ', CONFIG.INDEX_PAGE)
            const containerInner = document.querySelector('#theme-onenav #container-inner')
            const newHTML = `<h1 class="text-3xl pt-12  dark:text-gray-300">配置有误</h1><blockquote class="notion-quote notion-block-ce76391f3f2842d386468ff1eb705b92"><div>请在您的notion中添加一个slug为${CONFIG.INDEX_PAGE}的文章</div></blockquote>`
            containerInner?.insertAdjacentHTML('afterbegin', newHTML)
          }
        }
      }, 7 * 1000)
    })
  }, [])

  return <LayoutBase {...props} />
}

/**
 * 文章列表 无
 * 全靠页面导航
 * @param {*} props
 * @returns
 */
const LayoutPostListOld = (props) => {
  return <LayoutBase {...props} >
            <div className='mt-10'><BlogPostListPage {...props} /></div>
    </LayoutBase>
}

/**
 * 文章详情
 * @param {*} props
 * @returns
 */
const LayoutSlug = (props) => {
  const { post, prev, next, lock, validPassword } = props

  return (
        <LayoutBase {...props} >
            {/* 文章锁 */}
            {lock && <ArticleLock validPassword={validPassword} />}

            {!lock && <div id='container'>

                {/* title */}
                <h1 className="text-3xl pt-4 md:pt-12  dark:text-gray-300">{post?.title}</h1>

                {/* Notion文章主体 */}
                {post && (<section id="article-wrapper" className="px-1">
                    <NotionPage post={post} />

                    {/* 分享 */}
                    {/* <ShareBar post={post} /> */}
                    {/* 文章分类和标签信息 */}
                    <div className='flex justify-between'>
                        {CONFIG.POST_DETAIL_CATEGORY && post?.category && <CategoryItem category={post.category} />}
                        <div>
                            {CONFIG.POST_DETAIL_TAG && post?.tagItems?.map(tag => <TagItemMini key={tag.name} tag={tag} />)}
                        </div>
                    </div>

                    {/* 上一篇、下一篇文章 */}
                    {/* {post?.type === 'Post' && <ArticleAround prev={prev} next={next} />} */}

                    <AdSlot />
                    <WWAds className='w-full' orientation='horizontal'/>

                    <Comment frontMatter={post} />
                </section>)}

                <TocDrawer {...props} />
            </div>}
        </LayoutBase>
  )
}

/**
 * 没有搜索
 * 全靠页面导航
 * @param {*} props
 * @returns
 */
const LayoutSearch = (props) => {
  return <LayoutBase {...props}></LayoutBase>
}

/**
 * 归档页面基本不会用到
 * 全靠页面导航
 * @param {*} props
 * @returns
 */
const LayoutArchive = (props) => {
  const { archivePosts } = props

  return <LayoutBase {...props}>
        <div className="mb-10 pb-20 md:py-12 py-3  min-h-full">
            {Object.keys(archivePosts)?.map(archiveTitle => <BlogArchiveItem key={archiveTitle} archiveTitle={archiveTitle} archivePosts={archivePosts} />)}
        </div>
  </LayoutBase>
}

/**
 * 404
 */
const Layout404 = props => {
  return <LayoutBase {...props}>
        <div className='w-full h-96 py-80 flex justify-center items-center'>404 Not found.</div>
    </LayoutBase>
}

/**
 * 分类列表
 */
const LayoutCategoryIndex = (props) => {
  const { categoryOptions } = props
  const { locale } = useGlobal()
  return <LayoutBase {...props}>
     <div className='bg-white dark:bg-gray-700 py-10'>
                <div className='dark:text-gray-200 mb-5'>
                    <i className='mr-4 fas fa-th' />{locale.COMMON.CATEGORY}:
                </div>
                <div id='category-list' className='duration-200 flex flex-wrap'>
                    {categoryOptions?.map(category => {
                      return (
                            <Link
                                key={category.name}
                                href={`/category/${category.name}`}
                                passHref
                                legacyBehavior>
                                <div
                                    className={'hover:text-black dark:hover:text-white dark:text-gray-300 dark:hover:bg-gray-600 px-5 cursor-pointer py-2 hover:bg-gray-100'}>
                                    <i className='mr-4 fas fa-folder' />{category.name}({category.count})
                                </div>
                            </Link>
                      )
                    })}
                </div>
            </div>
  </LayoutBase>
}

/**
 * 标签列表
 */
const LayoutTagIndex = (props) => {
  const { tagOptions } = props
  const { locale } = useGlobal()

  return <LayoutBase {...props}>
     <div className="bg-white dark:bg-gray-700 py-10">
                <div className="dark:text-gray-200 mb-5">
                    <i className="mr-4 fas fa-tag" />
                    {locale.COMMON.TAGS}:
                </div>
                <div id="tags-list" className="duration-200 flex flex-wrap">
                    {tagOptions?.map(tag => {
                      return (
                            <div key={tag.name} className="p-2">
                                <TagItemMini key={tag.name} tag={tag} />
                            </div>
                      )
                    })}
                </div>
            </div>
  </LayoutBase>
}

export {
  CONFIG as THEME_CONFIG,
  LayoutIndex,
  LayoutSearch,
  LayoutArchive,
  LayoutSlug,
  Layout404,
  LayoutCategoryIndex,
  LayoutPostList,
  LayoutTagIndex
}
