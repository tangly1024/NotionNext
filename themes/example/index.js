'use client'


import BLOG from '@/blog.config'
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

/**
 * 基础布局框架
 * 1.其它页面都嵌入在LayoutBase中
 * 2.采用左右两侧布局，移动端使用顶部导航栏
 * @returns {JSX.Element}
 * @constructor
 */
const LayoutBase = props => {
  const { children, slotTop, meta } = props
  const { onLoading } = useGlobal()

  // 增加一个状态以触发 Transition 组件的动画
  //   const [showTransition, setShowTransition] = useState(true)
  //   useEffect(() => {
  //     // 当 location 或 children 发生变化时，触发动画
  //     setShowTransition(false)
  //     setTimeout(() => setShowTransition(true), 5)
  //   }, [onLoading])

  return (
        <!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Document</title>
<script src="https://cdn.bootcss.com/vue/2.5.16/vue.min.js"></script>
<style>
.timeline-item {
   background: #fff;
   border: 1px solid;
   border-color: #e5e6e9 #dfe0e4 #d0d1d5;
   border-radius: 3px;
   padding: 12px;
   margin: 0 auto;
   max-width: 472px;
   min-height: 200px;
}


@keyframes placeHolderShimmer{
    0% {
        background-position: -468px 0
    }
    100%{
        background-position: 468px 0
    }
}

.animated-background {
    animation-duration: 1s;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
    animation-name: placeHolderShimmer;
    animation-timing-function: linear;
    background: #f6f7f8;
    background: linear-gradient(to right, #eeeeee 8%, #dddddd 18%, #eeeeee 33%);
    background-size: 800px 104px;
    height: 40px;
    position: relative;
}


.background-masker {
    background: #fff;
    position: absolute;
}

.background-masker.header-top,
.background-masker.header-bottom,
.background-masker.subheader-bottom {
    top: 0;
    left: 40px;
    right: 0;
    height: 10px;
}

.background-masker.header-left,
.background-masker.subheader-left,
.background-masker.header-right,
.background-masker.subheader-right {
    top: 10px;
    left: 40px;
    height: 8px;
    width: 10px;
}

.background-masker.header-bottom {
    top: 18px;
    height: 6px;
}

.background-masker.subheader-left,
.background-masker.subheader-right {
    top: 24px;
    height: 6px;
}


.background-masker.header-right,
.background-masker.subheader-right {
    width: auto;
    left: 300px;
    right: 0;
}

.background-masker.subheader-right {
    left: 230px;
}

.background-masker.subheader-bottom {
    top: 30px;
    height: 10px;
}

.background-masker.content-top,
.background-masker.content-second-line,
.background-masker.content-third-line,
.background-masker.content-second-end,
.background-masker.content-third-end,
.background-masker.content-first-end {
    top: 40px;
    left: 0;
    right: 0;
    height: 6px;
}

.background-masker.content-top {
    height:20px;
}

.background-masker.content-first-end,
.background-masker.content-second-end,
.background-masker.content-third-end{
    width: auto;
    left: 380px;
    right: 0;
    top: 60px;
    height: 8px;
}

.background-masker.content-second-line  {
    top: 68px;
}

.background-masker.content-second-end {
    left: 420px;
    top: 74px;
}

.background-masker.content-third-line {
    top: 82px;
}

.background-masker.content-third-end {
    left: 300px;
    top: 88px;
}
</style>
<body>
    <div id="app">
      <div v-for="user in users" class="items" v-if="loading">
        <user-item :name="user.name" :email="user.email"></user-item>
      </div>
      <div v-for="load in loades" v-if="!loading">
        <loading-item></loading-item>
      </div>
    </div>
</body>
<script>
    // https://cloud.tencent.com/developer/article/1006169
    Vue.component('user-item', {
      props: ['email', 'name'],
      template: `<div>
          <h2 v-text="name"></h2>
          <p v-text="email"></p>
        </div>`
    })

    Vue.component('loading-item', {
      template: `<div class="animated-background">
         <div class="background-masker header-top"></div>
         <div class="background-masker header-left"></div>
         <div class="background-masker header-right"></div>
         <div class="background-masker header-bottom"></div>
         <div class="background-masker subheader-left"></div>
         <div class="background-masker subheader-right"></div>
         <div class="background-masker subheader-bottom"></div>
       </div>`
    })

    var app = new Vue({
      el: '#app',
      data: {
        users: [],
        loading: false,
        loades: 10
      },
      methods: {
        getUserDetails: function() {
          fetch('https://jsonplaceholder.typicode.com/users')
            .then(result => result.json())
            .then(result => {
              this.users = result
              this.loading = true
            });
        }
      },
      beforeMount: function() {
        setTimeout(() => {
          this.getUserDetails()
        }, 3000);
      }
    });
</script>
</html>
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
                <Title {...props} />

                <div id='container-wrapper' className={(BLOG.LAYOUT_SIDEBAR_REVERSE ? 'flex-row-reverse' : '') + 'relative container mx-auto justify-center md:flex items-start py-8 px-2'}>

                    {/* 内容 */}
                    <div className='w-full max-w-3xl xl:px-14 lg:px-4 '>
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
                    <SideBar {...props} />

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
  }
  return (
        <LayoutBase {...props} slotTop={slotTop}>
            {BLOG.POST_LIST_STYLE === 'page' ? <BlogListPage {...props} /> : <BlogListScroll {...props} />}
        </LayoutBase>
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
        <LayoutBase {...props}>
            {lock
              ? <ArticleLock validPassword={validPassword} />
              : <div id="article-wrapper" className="px-2">
                    <ArticleInfo post={post} />
                    <NotionPage post={post} />
                    <ShareBar post={post} />
                    <Comment frontMatter={post} />
                </div>}
        </LayoutBase>
  )
}

/**
 * 404页
 * @param {*} props
 * @returns
 */
const Layout404 = (props) => {
  return <LayoutBase {...props}>404 Not found.</LayoutBase>
}

/**
 * 搜索页
 * @param {*} props
 * @returns
 */
const LayoutSearch = props => {
  const { keyword } = props
  // 嵌入一个搜索框在顶部
  const slotTop = <div className='pb-12'><SearchInput {...props} /></div>
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

  return <LayoutPostList slotTop={slotTop} {...props} />
}

/**
 * 归档列表
 * @param {*} props
 * @returns 按照日期将文章分组排序
 */
const LayoutArchive = props => {
  const { archivePosts } = props
  return (
        <LayoutBase {...props}>
            <div className="mb-10 pb-20 md:py-12 p-3  min-h-screen w-full">
                {Object.keys(archivePosts).map(archiveTitle => (
                    <BlogListGroupByDate key={archiveTitle} archiveTitle={archiveTitle} archivePosts={archivePosts} />
                ))}
            </div>
        </LayoutBase>
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
        <LayoutBase {...props}>
            <div id='category-list' className='duration-200 flex flex-wrap'>
                {categoryOptions?.map(category => <CategoryItem key={category.name} category={category} />)}
            </div>
        </LayoutBase>
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
        <LayoutBase {...props}>
            <div id='tags-list' className='duration-200 flex flex-wrap'>
                {tagOptions.map(tag => <TagItem key={tag.name} tag={tag} />)}
            </div>
        </LayoutBase>
  )
}

export {
  CONFIG as THEME_CONFIG,
  LayoutIndex,
  LayoutPostList,
  LayoutSearch,
  LayoutArchive,
  LayoutSlug,
  Layout404,
  LayoutCategoryIndex,
  LayoutTagIndex
}
