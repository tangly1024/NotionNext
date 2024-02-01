'use client'

import CONFIG from './config'
import { useEffect } from 'react'
import { Header } from './components/Header'
import { Nav } from './components/Nav'
import { Footer } from './components/Footer'
import { Title } from './components/Title'
import { SideBar } from './components/SideBar'
import { BlogListPage } from './components/BlogListPage'
import { BlogListScroll } from './components/BlogListScroll'
import { useGlobal } from '@/lib/global'
import { ArticleLock } from './components/ArticleLock'
import { ArticleInfo } from './components/ArticleInfo'
import JumpToTopButton from './components/JumpToTopButton'
import NotionPage from '@/components/NotionPage'
import Comment from '@/components/Comment'
import ShareBar from '@/components/ShareBar'
import SearchInput from './components/SearchInput'
import replaceSearchResult from '@/components/Mark'
import { isBrowser } from '@/lib/utils'
import BlogListGroupByDate from './components/BlogListGroupByDate'
import CategoryItem from './components/CategoryItem'
import TagItem from './components/TagItem'
import { useRouter } from 'next/router'
import { Transition } from '@headlessui/react'
import { Style } from './style'
import CommonHead from '@/components/CommonHead'
import { siteConfig } from '@/lib/config'

/**
 * 基础布局框架
 * 1.其它页面都嵌入在LayoutBase中
 * 2.采用左右两侧布局，移动端使用顶部导航栏
 * @returns {JSX.Element}
 * @constructor
 */
const LayoutBase = props => {
  const { children, meta } = props
  const { onLoading, fullWidth } = useGlobal()
  const router = useRouter()
  const { category, tag } = props
  // 顶部如果是按照分类或标签查看文章列表，列表顶部嵌入一个横幅
  // 如果是搜索，则列表顶部嵌入 搜索框
  let slotTop = null
  if (category) {
    slotTop = <div className='pb-12'><i className="mr-1 fas fa-folder-open" />{category}</div>
  } else if (tag) {
    slotTop = <div className='pb-12'>#{tag}</div>
  } else if (props.slotTop) {
    slotTop = props.slotTop
  } else if (router.route === '/search') {
    // 嵌入一个搜索框在顶部
    slotTop = <div className='pb-12'><SearchInput {...props} /></div>
  }

  // 增加一个状态以触发 Transition 组件的动画
  //   const [showTransition, setShowTransition] = useState(true)
  //   useEffect(() => {
  //     // 当 location 或 children 发生变化时，触发动画
  //     setShowTransition(false)
  //     setTimeout(() => setShowTransition(true), 5)
  //   }, [onLoading])

  return (
        <div id='theme-example' className='dark:text-gray-300  bg-white dark:bg-black'>

            {/* SEO信息 */}
            <CommonHead meta={meta}/>

            <Style/>

            {/* 页头 */}
            <Header {...props} />

            {/* 菜单 */}
            <Nav {...props} />

            {/* 主体 */}
            <div id='container-inner' className="w-full relative z-10">

                {/* 标题栏 */}
                {fullWidth ? null : <Title {...props} />}

                <div id='container-wrapper' className={(JSON.parse(siteConfig('LAYOUT_SIDEBAR_REVERSE')) ? 'flex-row-reverse' : '') + 'relative container mx-auto justify-center md:flex items-start py-8 px-2'}>

                    {/* 内容 */}
                    <div className={`w-full ${fullWidth ? '' : 'max-w-3xl'} xl:px-14 lg:px-4`}>
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
                            {/* 嵌入模块 */}
                            {slotTop}
                            {children}
                        </Transition>
                    </div>

                    {/* 侧边栏 */}
                    {!fullWidth && <SideBar {...props} />}

                </div>

            </div>

            {/* 页脚 */}
            <Footer {...props} />

            {/* 回顶按钮 */}
            <div className='fixed right-4 bottom-4 z-10'>
                <JumpToTopButton />
            </div>
        </div>
  )
}

/**
 * 首页
 * @param {*} props
 * @returns 此主题首页就是列表
 */
const LayoutIndex = props => {
  return <LayoutPostList {...props} />
}

/**
 * 文章列表
 * @param {*} props
 * @returns
 */
const LayoutPostList = props => {
  return (
        <>
            {siteConfig('POST_LIST_STYLE') === 'page' ? <BlogListPage {...props} /> : <BlogListScroll {...props} />}
        </>
  )
}

/**
 * 文章详情页
 * @param {*} props
 * @returns
 */
const LayoutSlug = props => {
  const { post, lock, validPassword } = props
  return (
        <>
            {lock
              ? <ArticleLock validPassword={validPassword} />
              : <div id="article-wrapper" className="px-2">
                    <ArticleInfo post={post} />
                    <NotionPage post={post} />
                    <ShareBar post={post} />
                    <Comment frontMatter={post} />
                </div>}
        </>
  )
}

/**
 * 404页
 * @param {*} props
 * @returns
 */
const Layout404 = (props) => {
  return <>404 Not found.</>
}

/**
 * 搜索页
 * @param {*} props
 * @returns
 */
const LayoutSearch = props => {
  const { keyword } = props
  const router = useRouter()
  useEffect(() => {
    if (isBrowser) {
      // 高亮搜索到的结果
      const container = document.getElementById('posts-wrapper')
      if (keyword && container) {
        replaceSearchResult({
          doms: container,
          search: keyword,
          target: {
            element: 'span',
            className: 'text-red-500 border-b border-dashed'
          }
        })
      }
    }
  }, [router])

  return <LayoutPostList {...props} />
}

/**
 * 归档列表
 * @param {*} props
 * @returns 按照日期将文章分组排序
 */
const LayoutArchive = props => {
  const { archivePosts } = props
  return (<>
            <div className="mb-10 pb-20 md:py-12 p-3  min-h-screen w-full">
                {Object.keys(archivePosts).map(archiveTitle => (
                    <BlogListGroupByDate key={archiveTitle} archiveTitle={archiveTitle} archivePosts={archivePosts} />
                ))}
            </div>
        </>)
}

/**
 * 分类列表
 * @param {*} props
 * @returns
 */
const LayoutCategoryIndex = props => {
  const { categoryOptions } = props
  return (
        <>
            <div id='category-list' className='duration-200 flex flex-wrap'>
                {categoryOptions?.map(category => <CategoryItem key={category.name} category={category} />)}
            </div>
        </>
  )
}

/**
 * 标签列表
 * @param {*} props
 * @returns
 */
const LayoutTagIndex = (props) => {
  const { tagOptions } = props
  return (
        <>
            <div id='tags-list' className='duration-200 flex flex-wrap'>
                {tagOptions.map(tag => <TagItem key={tag.name} tag={tag} />)}
            </div>
        </>
  )
}

export {
  CONFIG as THEME_CONFIG,
  LayoutBase,
  LayoutIndex,
  LayoutPostList,
  LayoutSearch,
  LayoutArchive,
  LayoutSlug,
  Layout404,
  LayoutCategoryIndex,
  LayoutTagIndex
}
