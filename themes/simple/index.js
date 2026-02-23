import { AdSlot } from '@/components/GoogleAdsense'
import replaceSearchResult from '@/components/Mark'
import NotionPage from '@/components/NotionPage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { isBrowser } from '@/lib/utils'
import { Transition } from '@headlessui/react'
import dynamic from 'next/dynamic'
import SmartLink from '@/components/SmartLink'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import {
  BookOpen,
  BookText,
  ChevronRight,
  Compass,
  FileText,
  Globe,
  Globe2,
  Layers3,
  Library,
  Lightbulb,
  Menu,
  MessageCircle,
  Mic,
  Music2,
  Star,
  Users,
  Volume2,
  X
} from 'lucide-react'
import BlogPostBar from './components/BlogPostBar'
import CONFIG from './config'
import { Style } from './style'

const AlgoliaSearchModal = dynamic(
  () => import('@/components/AlgoliaSearchModal'),
  { ssr: false }
)

const BookLibrary = dynamic(() => import('@/components/BookLibrary'), {
  ssr: false
})

// 主题组件
const BlogListScroll = dynamic(() => import('./components/BlogListScroll'), {
  ssr: false
})
const BlogArchiveItem = dynamic(() => import('./components/BlogArchiveItem'), {
  ssr: false
})
const ArticleLock = dynamic(() => import('./components/ArticleLock'), {
  ssr: false
})
const ArticleInfo = dynamic(() => import('./components/ArticleInfo'), {
  ssr: false
})
const Comment = dynamic(() => import('@/components/Comment'), { ssr: false })
const ArticleAround = dynamic(() => import('./components/ArticleAround'), {
  ssr: false
})
const ShareBar = dynamic(() => import('@/components/ShareBar'), { ssr: false })
const TopBar = dynamic(() => import('./components/TopBar'), { ssr: false })
const Header = dynamic(() => import('./components/Header'), { ssr: false })
const NavBar = dynamic(() => import('./components/NavBar'), { ssr: false })
const SideBar = dynamic(() => import('./components/SideBar'), { ssr: false })
const JumpToTopButton = dynamic(() => import('./components/JumpToTopButton'), {
  ssr: false
})
const Footer = dynamic(() => import('./components/Footer'), { ssr: false })
const SearchInput = dynamic(() => import('./components/SearchInput'), {
  ssr: false
})
const WWAds = dynamic(() => import('@/components/WWAds'), { ssr: false })
const BlogListPage = dynamic(() => import('./components/BlogListPage'), {
  ssr: false
})
const RecommendPosts = dynamic(() => import('./components/RecommendPosts'), {
  ssr: false
})

// 主题全局状态
const ThemeGlobalSimple = createContext()
export const useSimpleGlobal = () => useContext(ThemeGlobalSimple)

// ===================== 学习首页配置 =====================
const pinyinNav = [
  {
    zh: '声母',
    mm: 'ဗျည်း',
    icon: Mic,
    href: '/pinyin/initials',
    bg: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
  {
    zh: '韵母',
    mm: 'သရ',
    icon: Music2,
    href: '/pinyin/finals',
    bg: 'bg-emerald-100',
    iconColor: 'text-emerald-600'
  },
  {
    zh: '整体',
    mm: 'အသံတွဲ',
    icon: Layers3,
    href: '/pinyin/syllables',
    bg: 'bg-purple-100',
    iconColor: 'text-purple-600'
  },
  {
    zh: '声调',
    mm: 'အသံ',
    icon: FileText,
    href: '/pinyin/tones',
    bg: 'bg-orange-100',
    iconColor: 'text-orange-600'
  }
]

const coreTools = [
  {
    zh: 'AI 翻译',
    mm: 'AI ဘာသာပြန်',
    icon: Globe,
    href: '/ai-translate',
    bg: 'bg-indigo-100',
    iconColor: 'text-indigo-600'
  },
  {
    zh: '免费书籍',
    mm: 'စာကြည့်တိုက်',
    icon: Library,
    action: 'open-library',
    bg: 'bg-cyan-100',
    iconColor: 'text-cyan-600'
  },
  {
    zh: '单词收藏',
    mm: 'မှတ်ထားသော စာလုံး',
    icon: Star,
    href: '/words',
    bg: 'bg-slate-200',
    iconColor: 'text-slate-700'
  },
  {
    zh: '口语收藏',
    mm: 'မှတ်ထားသော စကားပြော',
    icon: Volume2,
    href: '/oral',
    bg: 'bg-slate-200',
    iconColor: 'text-slate-700'
  }
]

const drawerLinks = [
  { label: '首页', href: '/' },
  { label: 'HSK 课程', href: '/course/hsk1' },
  { label: '免费书籍', action: 'open-library' },
  { label: '设置', href: '/settings' }
]

const systemCourses = [
  {
    badge: 'Words',
    sub: '词汇 (VOCABULARY)',
    title: '日常高频词汇',
    mmDesc: 'အခြေခံ စကားလုံးများကို လေ့လာပါ。',
    zhDesc: '掌握生活与考试中最核心的词汇',
    bgImg:
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=1200',
    href: '/course/words'
  },
  {
    badge: 'Spoken',
    sub: '口语 (ORAL)',
    title: '地道汉语口语',
    mmDesc: 'နေ့စဉ်သုံး စကားပြောဆိုမှုများကို လေ့ကျင့်ပါ。',
    zhDesc: '跟读与练习最纯正的日常交流口语',
    bgImg:
      'https://images.unsplash.com/photo-1528712306091-ed0763094c98?auto=format&fit=crop&q=80&w=1200',
    href: '/course/oral'
  },
  {
    badge: 'HSK 1',
    sub: '入门 (INTRO)',
    title: 'HSK 1',
    mmDesc: 'အသုံးအများဆုံး စကားလုံးများနှင့် သဒ္ဒါ',
    zhDesc: '掌握最常用词语和基本语法',
    bgImg:
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=1200',
    href: '/course/hsk1'
  }
]

const drawerWidth = 288

const LayoutLearningHome = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [drawerX, setDrawerX] = useState(-drawerWidth)
  const [isDragging, setIsDragging] = useState(false)
  const [isLibraryOpen, setIsLibraryOpen] = useState(false)

  const touchStartXRef = useRef(null)
  const drawerStartXRef = useRef(-drawerWidth)

  const openDrawer = () => {
    setIsDrawerOpen(true)
    setDrawerX(0)
  }

  const closeDrawer = () => {
    setIsDrawerOpen(false)
    setDrawerX(-drawerWidth)
  }

  const handleTouchStart = e => {
    const startX = e.touches?.[0]?.clientX ?? 0
    if (!isDrawerOpen && startX > 24) return
    touchStartXRef.current = startX
    drawerStartXRef.current = drawerX
    setIsDragging(true)
  }

  const handleTouchMove = e => {
    if (!isDragging || touchStartXRef.current === null) return
    const currentX = e.touches?.[0]?.clientX ?? 0
    const deltaX = currentX - touchStartXRef.current
    const nextX = Math.max(
      -drawerWidth,
      Math.min(0, drawerStartXRef.current + deltaX)
    )
    setDrawerX(nextX)
  }

  const handleTouchEnd = () => {
    if (!isDragging) return
    setIsDragging(false)
    touchStartXRef.current = null
    if (drawerX > -drawerWidth * 0.55) openDrawer()
    else closeDrawer()
  }

  const openProgress = (drawerX + drawerWidth) / drawerWidth
  const overlayOpacity = Math.max(0, Math.min(0.5, openProgress * 0.5))
  const showDrawerLayer = isDrawerOpen || isDragging || drawerX > -drawerWidth

  const glassCard =
    'rounded-2xl border border-white/80 bg-white/94 backdrop-blur-2xl shadow-[0_10px_26px_rgba(15,23,42,0.12)]'
  const glassCardHover = `${glassCard} transition-all duration-200 hover:bg-white/97`

  return (
    <main
      className='relative min-h-screen overflow-x-hidden text-slate-900'
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}>
      <div className='fixed inset-0 -z-20 overflow-hidden'>
        <div
          className='absolute inset-[-36px] scale-110 bg-cover bg-center blur-[18px]'
          style={{ backgroundImage: "url('/images/home-bg.jpg')" }}
        />
        <div className='absolute inset-0 bg-slate-900/32' />
        <div className='absolute inset-0 bg-white/10' />
      </div>

      <div
        className='fixed inset-0 -z-10'
        style={{
          background:
            'radial-gradient(circle at 18% 8%, rgba(255,255,255,0.14), transparent 34%), radial-gradient(circle at 92% 0%, rgba(59,130,246,0.12), transparent 30%)'
        }}
      />

      <div className={`fixed inset-0 z-40 ${showDrawerLayer ? '' : 'pointer-events-none'}`}>
        <div
          className='absolute inset-0 bg-black transition-opacity duration-200'
          style={{ opacity: overlayOpacity }}
          onClick={closeDrawer}
        />
        <aside
          className={`absolute inset-y-0 left-0 w-72 border-r border-white/70 bg-white/96 backdrop-blur-3xl shadow-2xl ${
            isDragging ? '' : 'transition-transform duration-300 ease-out'
          }`}
          style={{ transform: `translateX(${drawerX}px)` }}>
          <div className='flex items-center justify-between p-5'>
            <div>
              <p className='text-xs font-semibold text-slate-500'>菜单</p>
              <h2 className='mt-1 text-xl font-black text-slate-800'>中缅文学习中心</h2>
            </div>
            <button
              type='button'
              onClick={closeDrawer}
              aria-label='关闭菜单'
              className='rounded-lg p-1 text-slate-500 hover:bg-slate-100'>
              <X className='h-5 w-5' />
            </button>
          </div>

          <nav className='space-y-1 px-3'>
            {drawerLinks.map(item =>
              item.action === 'open-library' ? (
                <button
                  key={item.label}
                  type='button'
                  onClick={() => {
                    setIsLibraryOpen(true)
                    closeDrawer()
                  }}
                  className='block w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-100'>
                  {item.label}
                </button>
              ) : (
                <Link
                  key={item.label}
                  href={item.href ?? '/'}
                  className='block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100'>
                  {item.label}
                </Link>
              )
            )}
          </nav>
        </aside>
      </div>

      <div className='relative z-10 mx-auto w-full max-w-lg px-4 pb-36 pt-3'>
        <header className='mb-4 flex items-center gap-3 text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]'>
          <button type='button' onClick={openDrawer} aria-label='打开菜单' className='p-0.5'>
            <Menu className='h-7 w-7' />
          </button>
          <div>
            <h1 className='text-[18px] font-black leading-none'>中缅文学习中心</h1>
            <p className='mt-1 text-[11px] text-white/90'>Chinese Learning Hub</p>
          </div>
        </header>

        <section className='grid grid-cols-4 gap-3'>
          {pinyinNav.map(item => (
            <Link key={item.zh} href={item.href} className={`${glassCardHover} px-1 py-4`}>
              <div className='flex flex-col items-center gap-2'>
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${item.bg}`}>
                  <item.icon className={`h-4 w-4 ${item.iconColor}`} />
                </div>
                <div className='text-center'>
                  <p className='text-[13px] font-bold leading-none text-slate-800'>{item.zh}</p>
                  <p className='mt-1 text-[10px] font-medium leading-none text-slate-500'>{item.mm}</p>
                </div>
              </div>
            </Link>
          ))}
        </section>

        <section className='mt-4'>
          <Link
            href='/tips'
            className={`${glassCardHover} flex items-center justify-between px-4 py-3`}>
            <div className='flex items-center gap-3'>
              <div className='rounded-full bg-orange-100 p-1.5'>
                <Lightbulb className='h-4 w-4 text-orange-500' />
              </div>
              <div>
                <p className='text-[14px] font-bold text-slate-800'>发音技巧 (Tips)</p>
                <p className='text-[11px] text-slate-500'>အသံထွက်နည်းလမ်းများ</p>
              </div>
            </div>
            <ChevronRight className='h-5 w-5 text-slate-400' />
          </Link>
        </section>

        <section className='mt-4 grid grid-cols-2 gap-3'>
          {coreTools.map(tool => {
            const content = (
              <>
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${tool.bg}`}>
                  <tool.icon className={`h-4 w-4 ${tool.iconColor}`} />
                </div>
                <div className='min-w-0'>
                  <p className='truncate text-[14px] font-bold text-slate-800'>{tool.zh}</p>
                  <p className='mt-0.5 truncate text-[10px] text-slate-500'>{tool.mm}</p>
                </div>
              </>
            )

            if (tool.action === 'open-library') {
              return (
                <button
                  key={tool.zh}
                  type='button'
                  onClick={() => setIsLibraryOpen(true)}
                  className={`${glassCardHover} flex items-center gap-3 p-3.5 text-left`}>
                  {content}
                </button>
              )
            }

            if (tool.external && tool.href) {
              return (
                <a key={tool.zh} href={tool.href} className={`${glassCardHover} flex items-center gap-3 p-3.5`}>
                  {content}
                </a>
              )
            }

            return (
              <Link
                key={tool.zh}
                href={tool.href ?? '/'}
                className={`${glassCardHover} flex items-center gap-3 p-3.5`}>
                {content}
              </Link>
            )
          })}
        </section>

        <section className='mt-8'>
          <div className='mb-3 flex items-center gap-2 px-1'>
            <BookText className='h-4 w-4 text-slate-700' />
            <h2 className='text-[13px] font-bold tracking-wider text-slate-700'>
              SYSTEM COURSES (သင်ရိုး)
            </h2>
          </div>

          <div className='flex flex-col gap-4'>
            {systemCourses.map(course => (
              <Link
                key={course.title}
                href={course.href}
                className='group relative block overflow-hidden rounded-3xl border border-white/55 shadow-[0_12px_30px_rgba(2,6,23,0.20)]'>
                <div className='absolute inset-0 bg-slate-800' />
                <div
                  className='absolute inset-0 bg-cover bg-center opacity-[0.86] transition-transform duration-700 group-hover:scale-105'
                  style={{ backgroundImage: `url(${course.bgImg})` }}
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/88 via-black/42 to-transparent' />
                <div className='relative flex min-h-[170px] flex-col justify-between p-4'>
                  <span className='w-fit rounded-full bg-white/95 px-3 py-1 text-[11px] font-black text-slate-800'>
                    {course.badge}
                  </span>
                  <div className='mt-8'>
                    <p className='mb-1 text-[11px] font-bold tracking-widest text-cyan-300'>{course.sub}</p>
                    <h3 className='mb-1.5 text-2xl font-black text-white'>{course.title}</h3>
                    <p className='truncate text-[13px] text-slate-200'>{course.mmDesc}</p>
                    <p className='truncate text-[12px] font-medium text-slate-300'>{course.zhDesc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <nav className='fixed bottom-0 left-0 right-0 z-30 mx-auto w-full max-w-lg border-t border-slate-200 bg-white px-2 pt-2 pb-[calc(env(safe-area-inset-bottom)+10px)] shadow-[0_-10px_22px_rgba(15,23,42,0.10)] sm:hidden'>
        <div className='flex items-center justify-between'>
          <a
            href='https://bbs.886.best/user/mei/chats'
            className='flex flex-1 flex-col items-center justify-center gap-1 text-slate-600'>
            <MessageCircle className='h-6 w-6' />
            <span className='text-[12px] font-semibold leading-none'>消息</span>
          </a>

          <a
            href='https://bbs.886.best'
            className='flex flex-1 flex-col items-center justify-center gap-1 text-slate-600'>
            <Globe2 className='h-6 w-6' />
            <span className='text-[12px] font-semibold leading-none'>社区</span>
          </a>

          <a
            href='https://bbs.886.best/partners'
            className='flex flex-1 flex-col items-center justify-center gap-1 text-slate-600'>
            <Users className='h-6 w-6' />
            <span className='text-[12px] font-semibold leading-none'>语伴</span>
          </a>

          <a
            href='https://bbs.886.best/category/5/%E5%8A%A8%E6%80%81'
            className='flex flex-1 flex-col items-center justify-center gap-1 text-slate-600'>
            <Compass className='h-6 w-6' />
            <span className='text-[12px] font-semibold leading-none'>动态</span>
          </a>

          <Link href='/' className='flex flex-1 flex-col items-center justify-center gap-1 text-indigo-600'>
            <div className='rounded-lg bg-indigo-100 p-1.5'>
              <BookOpen className='h-6 w-6' />
            </div>
            <span className='text-[12px] font-bold leading-none'>学习</span>
          </Link>
        </div>
      </nav>

      <BookLibrary isOpen={isLibraryOpen} onClose={() => setIsLibraryOpen(false)} />
    </main>
  )
}

/**
 * 基础布局
 */
const LayoutBase = props => {
  const { children, slotTop } = props
  const { onLoading, fullWidth } = useGlobal()
  const searchModal = useRef(null)
  const router = useRouter()

  // 首页使用学习站专属布局（不显示主题默认头部/侧栏/底部）
  const isLearningHome = router?.pathname === '/'

  if (isLearningHome) {
    return (
      <ThemeGlobalSimple.Provider value={{ searchModal }}>
        <div id='theme-simple' className={`${siteConfig('FONT_STYLE')} min-h-screen`}>
          <Style />
          {children}
        </div>
      </ThemeGlobalSimple.Provider>
    )
  }

  return (
    <ThemeGlobalSimple.Provider value={{ searchModal }}>
      <div
        id='theme-simple'
        className={`${siteConfig('FONT_STYLE')} min-h-screen flex flex-col dark:text-gray-300  bg-white dark:bg-black scroll-smooth`}>
        <Style />

        {siteConfig('SIMPLE_TOP_BAR', null, CONFIG) && <TopBar {...props} />}

        {/* 顶部LOGO */}
        <Header {...props} />

        {/* 导航栏 */}
        <NavBar {...props} />

        {/* 主体 */}
        <div
          id='container-wrapper'
          className={
            (JSON.parse(siteConfig('LAYOUT_SIDEBAR_REVERSE'))
              ? 'flex-row-reverse'
              : '') + ' w-full flex-1 flex items-start max-w-9/10 mx-auto pt-12'
          }>
          <div id='container-inner ' className='w-full flex-grow min-h-fit'>
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
              {slotTop}
              {children}
            </Transition>
            <AdSlot type='native' />
          </div>

          {fullWidth ? null : (
            <div
              id='right-sidebar'
              className='hidden xl:block flex-none sticky top-8 w-96 border-l dark:border-gray-800 pl-12 border-gray-100'>
              <SideBar {...props} />
            </div>
          )}
        </div>

        <div className='fixed right-4 bottom-4 z-20'>
          <JumpToTopButton />
        </div>

        {/* 搜索框 */}
        <AlgoliaSearchModal cRef={searchModal} {...props} />

        <Footer {...props} />
      </div>
    </ThemeGlobalSimple.Provider>
  )
}

/**
 * 博客首页 -> 改为学习首页
 */
const LayoutIndex = props => {
  return <LayoutLearningHome {...props} />
}

/**
 * 博客列表
 */
const LayoutPostList = props => {
  return (
    <>
      <BlogPostBar {...props} />
      {siteConfig('POST_LIST_STYLE') === 'page' ? (
        <BlogListPage {...props} />
      ) : (
        <BlogListScroll {...props} />
      )}
    </>
  )
}

/**
 * 搜索页
 */
const LayoutSearch = props => {
  const { keyword } = props

  useEffect(() => {
    if (isBrowser) {
      replaceSearchResult({
        doms: document.getElementById('posts-wrapper'),
        search: keyword,
        target: {
          element: 'span',
          className: 'text-red-500 border-b border-dashed'
        }
      })
    }
  }, [])

  const slotTop = siteConfig('ALGOLIA_APP_ID') ? null : (
    <SearchInput {...props} />
  )

  return <LayoutPostList {...props} slotTop={slotTop} />
}

/**
 * 归档页
 */
const LayoutArchive = props => {
  const { archivePosts } = props
  return (
    <div className='mb-10 pb-20 md:py-12 p-3 min-h-screen w-full'>
      {Object.keys(archivePosts).map(archiveTitle => (
        <BlogArchiveItem
          key={archiveTitle}
          archiveTitle={archiveTitle}
          archivePosts={archivePosts}
        />
      ))}
    </div>
  )
}

/**
 * 文章详情
 */
const LayoutSlug = props => {
  const { post, lock, validPassword, prev, next, recommendPosts } = props
  const { fullWidth } = useGlobal()

  return (
    <>
      {lock && <ArticleLock validPassword={validPassword} />}

      {!lock && post && (
        <div className={`px-2 ${fullWidth ? '' : 'xl:max-w-4xl 2xl:max-w-6xl'}`}>
          <ArticleInfo post={post} />

          <WWAds orientation='horizontal' className='w-full' />

          <div id='article-wrapper'>
            {!lock && <NotionPage post={post} />}
          </div>

          <ShareBar post={post} />

          <AdSlot type='in-article' />

          {post?.type === 'Post' && (
            <>
              <ArticleAround prev={prev} next={next} />
              <RecommendPosts recommendPosts={recommendPosts} />
            </>
          )}

          <Comment frontMatter={post} />
        </div>
      )}
    </>
  )
}

/**
 * 404
 */
const Layout404 = props => {
  const { post } = props
  const router = useRouter()
  const waiting404 = siteConfig('POST_WAITING_TIME_FOR_404') * 1000

  useEffect(() => {
    if (!post) {
      setTimeout(() => {
        if (isBrowser) {
          const article = document.querySelector('#article-wrapper #notion-article')
          if (!article) {
            router.push('/404').then(() => {
              console.warn('找不到页面', router.asPath)
            })
          }
        }
      }, waiting404)
    }
  }, [post])

  return <>404 Not found.</>
}

/**
 * 分类列表
 */
const LayoutCategoryIndex = props => {
  const { categoryOptions } = props
  return (
    <div id='category-list' className='duration-200 flex flex-wrap'>
      {categoryOptions?.map(category => {
        return (
          <SmartLink
            key={category.name}
            href={`/category/${category.name}`}
            passHref
            legacyBehavior>
            <div className='hover:text-black dark:hover:text-white dark:text-gray-300 dark:hover:bg-gray-600 px-5 cursor-pointer py-2 hover:bg-gray-100'>
              <i className='mr-4 fas fa-folder' />
              {category.name}({category.count})
            </div>
          </SmartLink>
        )
      })}
    </div>
  )
}

/**
 * 标签列表
 */
const LayoutTagIndex = props => {
  const { tagOptions } = props
  return (
    <div id='tags-list' className='duration-200 flex flex-wrap'>
      {tagOptions.map(tag => {
        return (
          <div key={tag.name} className='p-2'>
            <SmartLink
              key={tag}
              href={`/tag/${encodeURIComponent(tag.name)}`}
              passHref
              className={`cursor-pointer inline-block rounded hover:bg-gray-500 hover:text-white duration-200  mr-2 py-1 px-2 text-xs whitespace-nowrap dark:hover:text-white text-gray-600 hover:shadow-xl dark:border-gray-400 notion-${tag.color}_background dark:bg-gray-800`}>
              <div className='font-light dark:text-gray-400'>
                <i className='mr-1 fas fa-tag' />{' '}
                {tag.name + (tag.count ? `(${tag.count})` : '')}{' '}
              </div>
            </SmartLink>
          </div>
        )
      })}
    </div>
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
