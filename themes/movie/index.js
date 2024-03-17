'use client'

import AlgoliaSearchModal from '@/components/AlgoliaSearchModal'
import Comment from '@/components/Comment'
import replaceSearchResult from '@/components/Mark'
import NotionPage from '@/components/NotionPage'
import ShareBar from '@/components/ShareBar'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { loadWowJS } from '@/lib/plugins/wow'
import { isBrowser } from '@/lib/utils'
import { Transition } from '@headlessui/react'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import ArchiveDateList from './components/ArchiveDateList'
import { ArticleInfo } from './components/ArticleInfo'
import { ArticleLock } from './components/ArticleLock'
import BlogListGroupByDate from './components/BlogListGroupByDate'
import { BlogListPage } from './components/BlogListPage'
import { BlogListScroll } from './components/BlogListScroll'
import BlogRecommend from './components/BlogRecommend'
import CategoryGroup from './components/CategoryGroup'
import CategoryItem from './components/CategoryItem'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import JumpToTopButton from './components/JumpToTopButton'
import LatestPostsGroup from './components/LatestPostsGroup'
import SlotBar from './components/SlotBar'
import TagGroups from './components/TagGroups'
import TagItem from './components/TagItem'
import CONFIG from './config'
import { Style } from './style'

// 主题全局状态
const ThemeGlobalMovie = createContext()
export const useMovieGlobal = () => useContext(ThemeGlobalMovie)

/**
 * 基础布局框架
 * 1.其它页面都嵌入在LayoutBase中
 * 2.采用左右两侧布局，移动端使用顶部导航栏
 * @returns {JSX.Element}
 * @constructor
 */
const LayoutBase = props => {
  const { children, slotTop } = props
  const { onLoading, fullWidth } = useGlobal()
  const collapseRef = useRef(null)

  const searchModal = useRef(null)
  const [expandMenu, updateExpandMenu] = useState(false)
  useEffect(() => {
    loadWowJS()
  }, [])

  return (
    <ThemeGlobalMovie.Provider value={{ searchModal, expandMenu, updateExpandMenu, collapseRef }}>
      <div
        id='theme-movie'
        className={`${siteConfig('FONT_STYLE')} dark:text-gray-300 duration-300 transition-all bg-white dark:bg-[#2A2A2A] scroll-smooth min-h-screen flex flex-col justify-between`}>
        <Style />

        {/* 页头 */}
        <Header {...props} />

        {/* 主体 */}
        <div id='container-inner' className='w-full relative flex-grow z-10'>
          {/* 标题栏 */}
          {/* {fullWidth ? null : <Title {...props} />} */}

          <div
            id='container-wrapper'
            className={
              (JSON.parse(siteConfig('LAYOUT_SIDEBAR_REVERSE')) ? 'flex-row-reverse' : '') +
              'relative mx-auto justify-center md:flex items-start py-8 px-2'
            }>
            {/* 内容 */}
            <div className={`w-full ${fullWidth ? '' : ''} xl:px-32 lg:px-4`}>
              <Transition
                show={!onLoading}
                appear={true}
                enter='transition ease-in-out duration-700 transform order-first'
                enterFrom='opacity-0 translate-y-16'
                enterTo='opacity-100'
                leave='transition ease-in-out duration-300 transform'
                leaveFrom='opacity-100 translate-y-0'
                leaveTo='opacity-0 -translate-y-16'
                unmount={false}>
                {/* 嵌入模块 */}
                {slotTop}
                {children}
              </Transition>
            </div>
          </div>
        </div>

        {/* 页脚 */}
        <Footer {...props} />

        {/* 搜索框 */}
        <AlgoliaSearchModal cRef={searchModal} {...props} />

        {/* 回顶按钮 */}
        <div className='fixed right-4 bottom-4 z-10'>
          <JumpToTopButton />
        </div>
      </div>
    </ThemeGlobalMovie.Provider>
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
      <SlotBar {...props} />
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
  const router = useRouter()
  useEffect(() => {
    // 用js 实现将页面中的多个视频聚合为一个分集的视频
    function combineVideo() {
      // 找到 id 为 notion-article 的元素
      const notionArticle = document.getElementById('notion-article')
      if (!notionArticle) return // 如果找不到对应的元素，则退出函数

      // 找到所有的 .notion-asset-wrapper 元素
      const assetWrappers = document.querySelectorAll('.notion-asset-wrapper')
      if (!assetWrappers || assetWrappers.length === 0) return // 如果找不到对应的元素，则退出函数

      // 不要重复创建
      const exists = document.querySelectorAll('.video-wrapper')
      if (exists && exists.length > 0) return

      // 创建一个新的容器元素
      const videoWrapper = document.createElement('div')
      videoWrapper.className = 'video-wrapper p-2 bg-gray-100 dark:bg-hexo-black-gray max-w-4xl mx-auto'

      // 创建一个新的容器元素
      const carouselWrapper = document.createElement('div')
      carouselWrapper.classList.add('notion-carousel-wrapper')

      // 创建一个用于保存 figcaption 文本内容的数组
      const figCaptionValues = []

      // 遍历所有 .notion-asset-wrapper 元素
      assetWrappers.forEach((wrapper, index) => {
        // 检查 .notion-asset-wrapper 元素是否有子元素 figcaption
        const figCaption = wrapper.querySelector('figcaption')
        if (!figCaption) return // 如果没有子元素 figcaption，则不处理该元素

        // 检查 .notion-asset-wrapper 元素是否有 notion-asset-wrapper-video 或 notion-asset-wrapper-embed 类
        if (
          !wrapper.classList.contains('notion-asset-wrapper-video') &&
          !wrapper.classList.contains('notion-asset-wrapper-embed')
        )
          return

        // 获取 figcaption 的文本内容并添加到数组中
        const figCaptionValue = figCaption.textContent.trim()
        figCaptionValues.push(figCaptionValue)

        // 创建一个新的 div 元素用于包裹当前的 .notion-asset-wrapper 元素
        const carouselItem = document.createElement('div')
        carouselItem.classList.add('notion-carousel')
        carouselItem.appendChild(wrapper)
        // 如果是第一个元素，设置为 active
        if (index === 0) {
          carouselItem.classList.add('active')
        }
        // 将元素添加到容器中
        carouselWrapper.appendChild(carouselItem)
        // 从 DOM 中移除原始的 .notion-asset-wrapper 元素
        // wrapper.parentNode.removeChild(wrapper)
      })

      // 创建一个用于保存 figcaption 值的容器元素
      const figCaptionWrapper = document.createElement('div')
      figCaptionWrapper.className = 'notion-carousel-route py-2 max-h-36 overflow-y-auto'

      // 遍历 figCaptionValues 数组，并将每个值添加到容器元素中
      figCaptionValues.forEach(value => {
        const div = document.createElement('div')
        div.textContent = value
        div.addEventListener('click', function () {
          // 遍历所有的 carouselItem 元素
          document.querySelectorAll('.notion-carousel').forEach(item => {
            // 判断当前元素是否包含该 figCaption 的文本内容，如果是则设置为 active，否则取消 active
            if (item.querySelector('figcaption').textContent.trim() === value) {
              item.classList.add('active')
            } else {
              item.classList.remove('active')
              // 不活跃窗口暂停播放，仅支持notion上传视频、不支持外链
              item.querySelectorAll('video')?.forEach(video => {
                video.pause()
              })
            }
          })
        })
        figCaptionWrapper.appendChild(div)
      })

      // 条件是带有caption的视频数量大于1个，否则不处理
      if (figCaptionValues.length > 1) {
          // 将包含 figcaption 值的容器元素添加到 notion-article 的第一个子元素插入
        videoWrapper.appendChild(carouselWrapper)
        videoWrapper.appendChild(figCaptionWrapper)
        notionArticle.insertBefore(videoWrapper, notionArticle.firstChild)
      }
    }

    setTimeout(() => {
      combineVideo()
    }, 100)

    // 404
    if (!post) {
      setTimeout(
        () => {
          if (isBrowser) {
            const article = document.getElementById('notion-article')
            if (!article) {
              router.push('/404').then(() => {
                console.warn('找不到页面', router.asPath)
              })
            }
          }
        },
        siteConfig('POST_WAITING_TIME_FOR_404') * 1000
      )
    }
    return () => {
      // 获取所有 class="video-wrapper" 的元素
      const videoWrappers = document.querySelectorAll('.video-wrapper')

      // 遍历所有匹配的元素并移除它们
      videoWrappers.forEach(wrapper => {
        wrapper.parentNode.removeChild(wrapper) // 从 DOM 中移除元素
      })
    }
  }, [post])

  return (
    <>
      {!lock ? (
        <div id='article-wrapper' className='px-2 max-w-5xl mx-auto'>
          {/* 标题 */}
          <ArticleInfo post={post} />
          {/* 页面元素 */}
          <NotionPage post={post} />
          {/* 推荐 */}
          <BlogRecommend {...props} />
          {/* 分享栏目 */}
          <ShareBar post={post} />
          {/* 评论区 */}
          <Comment frontMatter={post} />
        </div>
      ) : (
        <ArticleLock validPassword={validPassword} />
      )}
    </>
  )
}

/**
 * 404页
 * @param {*} props
 * @returns
 */
const Layout404 = props => {
  const { locale } = useGlobal()
  const { searchModal } = useMovieGlobal()
  const router = useRouter()
  // 展示搜索框
  const toggleShowSearchInput = () => {
    if (siteConfig('ALGOLIA_APP_ID')) {
      searchModal.current.openSearch()
    }
  }

  const onKeyUp = e => {
    if (e.keyCode === 13) {
      const search = document.getElementById('search').value
      if (search) {
        router.push({ pathname: '/search/' + search })
      }
    }
  }

  return (
    <>
      <div className='h-52'>
        <h2 className='text-4xl'>{locale.COMMON.NO_RESULTS_FOUND}</h2>
        <hr className='my-4' />
        <div className='max-w-md relative'>
          <input
            autoFocus
            id='search'
            onClick={toggleShowSearchInput}
            onKeyUp={onKeyUp}
            className='float-left w-full outline-none h-full p-2 rounded dark:bg-[#383838] bg-gray-100'
            aria-label='Submit search'
            type='search'
            name='s'
            autoComplete='off'
            placeholder='Type then hit enter to search...'
          />
          <i className='fas fa-search absolute right-0 my-auto p-2'></i>
        </div>
      </div>
      {/* 底部导航 */}
      <div className='h-full flex-grow grid grid-cols-4 gap-4'>
        <LatestPostsGroup {...props} />
        <CategoryGroup {...props} />
        <ArchiveDateList {...props} />
        <TagGroups {...props} />
      </div>
    </>
  )
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
  return (
    <>
      <div className='mb-10 pb-20 md:py-12 p-3  min-h-screen w-full'>
        {Object.keys(archivePosts).map(archiveTitle => (
          <BlogListGroupByDate key={archiveTitle} archiveTitle={archiveTitle} archivePosts={archivePosts} />
        ))}
      </div>
    </>
  )
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
        {categoryOptions?.map(category => (
          <CategoryItem key={category.name} category={category} />
        ))}
      </div>
    </>
  )
}

/**
 * 标签列表
 * @param {*} props
 * @returns
 */
const LayoutTagIndex = props => {
  const { tagOptions } = props
  return (
    <>
      <div id='tags-list' className='duration-200 flex flex-wrap'>
        {tagOptions.map(tag => (
          <TagItem key={tag.name} tag={tag} />
        ))}
      </div>
    </>
  )
}

export {
  Layout404,
  LayoutArchive,
  LayoutBase,
  LayoutCategoryIndex,
  LayoutIndex,
  LayoutPostList,
  LayoutSearch,
  LayoutSlug,
  LayoutTagIndex,
  CONFIG as THEME_CONFIG
}
