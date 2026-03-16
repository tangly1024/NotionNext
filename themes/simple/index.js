'use client';

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
import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
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
  X,
  Sparkles,
  Map 
} from 'lucide-react'
import BlogPostBar from './components/BlogPostBar'
import CONFIG from './config'
import { Style } from './style'

// --- 动态导入组件 ---
const AlgoliaSearchModal = dynamic(() => import('@/components/AlgoliaSearchModal'), { ssr: false, loading: () => <div className="p-4 text-center text-slate-500">加载中...</div> })
const BookLibrary = dynamic(() => import('@/components/BookLibrary'), { ssr: false, loading: () => <div className="p-4 text-center text-slate-500">加载中...</div> })
const AIChatDrawer = dynamic(() => import('@/components/AIChatDrawer'), { ssr: false, loading: () => <div className="p-4 text-center text-slate-500">加载中...</div> })
const VoiceChat = dynamic(() => import('@/components/VoiceChat'), { ssr: false, loading: () => <div className="p-4 text-center text-slate-500">加载中...</div> })

const BlogListScroll = dynamic(() => import('./components/BlogListScroll'), { ssr: false })
const BlogArchiveItem = dynamic(() => import('./components/BlogArchiveItem'), { ssr: false })
const ArticleLock = dynamic(() => import('./components/ArticleLock'), { ssr: false })
const ArticleInfo = dynamic(() => import('./components/ArticleInfo'), { ssr: false })
const Comment = dynamic(() => import('@/components/Comment'), { ssr: false })
const ArticleAround = dynamic(() => import('./components/ArticleAround'), { ssr: false })
const ShareBar = dynamic(() => import('@/components/ShareBar'), { ssr: false })
const TopBar = dynamic(() => import('./components/TopBar'), { ssr: false })
const Header = dynamic(() => import('./components/Header'), { ssr: false })
const NavBar = dynamic(() => import('./components/NavBar'), { ssr: false })
const SideBar = dynamic(() => import('./components/SideBar'), { ssr: false })
const JumpToTopButton = dynamic(() => import('./components/JumpToTopButton'), { ssr: false })
const Footer = dynamic(() => import('./components/Footer'), { ssr: false })
const SearchInput = dynamic(() => import('./components/SearchInput'), { ssr: false })
const WWAds = dynamic(() => import('@/components/WWAds'), { ssr: false })
const BlogListPage = dynamic(() => import('./components/BlogListPage'), { ssr: false })
const RecommendPosts = dynamic(() => import('./components/RecommendPosts'), { ssr: false })

const ThemeGlobalSimple = createContext()
export const useSimpleGlobal = () => useContext(ThemeGlobalSimple)

const pinyinNav = [
  { zh: '声母', mm: 'ဗျည်း', icon: Mic, href: '/pinyin/initials', bg: 'bg-blue-100/90', color: 'text-blue-700' },
  { zh: '韵母', mm: 'သရ', icon: Music2, href: '/pinyin/finals', bg: 'bg-emerald-100/90', color: 'text-emerald-700' },
  { zh: '整体', mm: 'အသံတွဲ', icon: Layers3, href: '/pinyin/whole', bg: 'bg-purple-100/90', color: 'text-purple-700' },
  { zh: '声调', mm: 'အသံ', icon: FileText, href: '/pinyin/tones', bg: 'bg-orange-100/90', color: 'text-orange-700' }
]

const coreTools = [
  { zh: 'AI 翻译', mm: 'AI ဘာသာပြန်', icon: Globe, action: 'translator', bg: 'bg-indigo-50', iconColor: 'text-indigo-600' },
  { zh: '免费书籍', mm: 'စာကြည့်တိုက်', icon: Library, action: 'library', bg: 'bg-cyan-50', iconColor: 'text-cyan-600' },
  { zh: '单词收藏', mm: 'မှတ်ထားသော စာလုံး', icon: Star, href: '/words', bg: 'bg-slate-50', iconColor: 'text-slate-700' },
  { zh: '口语收藏', mm: 'မှတ်ထားသော စကားပြော', icon: Volume2, href: '/oral', bg: 'bg-slate-50', iconColor: 'text-slate-700' }
]

const systemCourses = [
  {
    badge: 'Words',
    sub: '词汇 (VOCABULARY)',
    title: '日常高频词汇',
    mmDesc: 'အခြေခံ စကားလုံးများကို လေ့လာပါ။',
    bgImg: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=1200',
    href: '/vocabulary',
    color: 'from-blue-600/90'
  },
  {
    badge: 'Oral',
    sub: '短句 (ORAL)',
    title: '场景口语短句',
    mmDesc: 'အခြေအနေလိုက် စကားပြော လေ့ကျင့်မှု',
    bgImg: 'https://images.unsplash.com/photo-1528712306091-ed0763094c98?auto=format&fit=crop&q=80&w=1200',
    href: '/oral',
    color: 'from-emerald-600/90'
  },
  {
    badge: 'HSK 1',
    sub: '入门 (INTRO)',
    title: 'HSK Level 1',
    mmDesc: 'အသုံးအများဆုံး စကားလုံးများနှင့် သဒ္ဒါ',
    bgImg: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=1200',
    href: '/course/hsk1',
    color: 'from-indigo-600/90'
  }
]

const LayoutLearningHome = () => {
  const router = useRouter()
  const [activeOverlay, setActiveOverlay] = useState(null)

  const openOverlay = useCallback((overlayType) => {
    setActiveOverlay((prev) => {
      if (prev === overlayType) return prev
      if (typeof window !== 'undefined') {
        window.history.pushState({ overlay: overlayType }, '', window.location.href)
      }
      return overlayType
    })
  }, [])

  const closeOverlay = useCallback(() => {
    if (activeOverlay && typeof window !== 'undefined') {
      window.history.back()
      return
    }
    setActiveOverlay(null)
  }, [activeOverlay])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const onPopState = () => setActiveOverlay(null)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  // 处理弹窗时的滚动穿透问题
  useEffect(() => {
    if (typeof document === 'undefined') return
    const prev = document.body.style.overflow
    if (activeOverlay) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = prev
    }
    return () => {
      document.body.style.overflow = prev
    }
  }, [activeOverlay])

  const glassCard = 'bg-white/95 backdrop-blur-xl border border-white/60 shadow-lg shadow-slate-200/50 rounded-2xl transition-all active:scale-95 cursor-pointer hover:shadow-xl hover:shadow-slate-300/60'

  return (
    <main className='relative min-h-[100dvh] overflow-x-hidden text-slate-900'>
      {/* 背景层 */}
      <div className='fixed inset-0 -z-30'>
        <img
          src='/images/home-bg.jpg'
          alt=''
          aria-hidden='true'
          className='h-full w-full object-cover'
        />
        <div className='absolute inset-0 bg-white/50 backdrop-blur-2xl' />
        <div className='absolute inset-0 bg-gradient-to-b from-white/20 via-white/10 to-white/30' />
      </div>

      {/* 左侧菜单 */}
      <AnimatePresence>
        {activeOverlay === 'menu' && (
          <div className='fixed inset-0 z-[160] flex'>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeOverlay}
              className='absolute inset-0 bg-slate-900/50 backdrop-blur-sm'
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              drag='x'
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={{ left: 0.5, right: 0 }}
              onDragEnd={(e, info) => {
                if (info.offset.x < -80 || info.velocity.x < -400) closeOverlay()
              }}
              className='relative w-72 h-full bg-white/95 backdrop-blur-xl shadow-2xl flex flex-col border-r border-slate-100'
            >
              <div className='p-6 border-b border-slate-100 flex items-center justify-between'>
                <div>
                  <h2 className='text-xl font-black text-slate-900'>菜单</h2>
                  <p className='text-xs text-slate-500'>中缅学习中心</p>
                </div>
                <button
                  type='button'
                  onClick={closeOverlay}
                  className='p-2 bg-slate-100 hover:bg-slate-200 rounded-full active:scale-90 transition-colors'
                >
                  <X size={20} className='text-slate-800' />
                </button>
              </div>
              <nav className='p-4 space-y-2'>
                {['首页', 'HSK 课程', 'AI 翻译', '书籍库', '设置'].map(item => (
                  <button
                    key={item}
                    type='button'
                    className='w-full text-left p-4 text-slate-800 font-bold hover:bg-slate-50 rounded-xl transition-colors'
                  >
                    {item}
                  </button>
                ))}
              </nav>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      <div className='relative z-10 mx-auto w-full max-w-md px-4 pb-24 pt-6'>
        {/* 顶部 */}
        <header className='mb-8 flex items-center gap-4'>
          <button
            type='button'
            onClick={() => openOverlay('menu')}
            className='p-1.5 active:scale-90 transition-transform bg-white/80 backdrop-blur-md rounded-xl border border-white/50'
          >
            <Menu className='h-7 w-7 text-slate-800' />
          </button>
          <div>
            <h1 className='text-xl font-black text-slate-900 leading-none'>中缅文学习中心</h1>
            <div className='mt-1.5 flex items-center gap-1 text-[10px] font-bold text-slate-600 uppercase tracking-widest'>
              <Sparkles size={12} className='text-blue-500' />
              <span>Premium Hub</span>
            </div>
          </div>
        </header>

        {/* 拼音导航 */}
        <section className='grid grid-cols-4 gap-3'>
          {pinyinNav.map(item => (
            <Link
              key={item.zh}
              href={item.href}
              className={`${glassCard} flex flex-col items-center py-4`}
            >
              <div className={`flex h-9 w-9 items-center justify-center rounded-full ${item.bg} mb-2`}>
                <item.icon className={`h-4 w-4 ${item.color}`} />
              </div>
              <p className='text-[13px] font-black text-slate-800'>{item.zh}</p>
              <p className='text-[9px] font-medium text-slate-700 mt-0.5'>{item.mm}</p>
            </Link>
          ))}
        </section>

        {/* 核心工具 */}
        <section className='mt-4 grid grid-cols-2 gap-3'>
          {coreTools.map(tool => {
            const content = (
              <div className='flex items-center gap-3'>
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tool.bg} ${tool.iconColor}`}>
                  <tool.icon size={20} />
                </div>
                <div className='min-w-0'>
                  <p className='truncate text-[13px] font-black text-slate-800'>{tool.zh}</p>
                  <p className='truncate text-[9px] text-slate-700'>{tool.mm}</p>
                </div>
              </div>
            )

            return tool.action ? (
              <button
                key={tool.zh}
                type='button'
                onClick={() => openOverlay(tool.action)}
                className={`${glassCard} p-3.5 text-left`}
              >
                {content}
              </button>
            ) : (
              <Link key={tool.zh} href={tool.href} className={`${glassCard} p-3.5`}>
                {content}
              </Link>
            )
          })}
        </section>

        {/* 发音技巧 */}
        <section className='mt-4'>
          <Link href='/pinyin/tips' className={`${glassCard} flex items-center justify-between p-4`}>
            <div className='flex items-center gap-4'>
              <div className='rounded-xl bg-orange-100 p-2 text-orange-700'>
                <Lightbulb size={20} />
              </div>
              <div>
                <p className='text-[14px] font-black text-slate-800'>发音技巧 (Tips)</p>
                <p className='text-[10px] text-slate-700'>အသံထွက်နည်းလမ်းများ</p>
              </div>
            </div>
            <ChevronRight className='h-5 w-5 text-slate-400' />
          </Link>
        </section>

        {/* AI 真人私教对练 */}
        <section className='mt-8 mb-2'>
          <button
            type='button'
            onClick={() => openOverlay('ai-tutor')}
            className='group relative w-full h-[140px] overflow-hidden rounded-[2.5rem] shadow-xl text-left transition-all active:scale-95 border border-white/60'
          >
            <img
              src='https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&q=80&w=1200'
              alt='AI 真人私教对练'
              className='absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105'
            />
            <div className='absolute inset-0 bg-gradient-to-r from-slate-900/85 to-slate-900/25' />

            <div className='relative z-10 flex h-full flex-col justify-center px-6'>
              <div className='mb-2 flex items-center gap-1.5'>
                <span className='rounded-full bg-pink-500 px-2.5 py-0.5 text-[10px] font-black tracking-wider text-white shadow-sm border border-pink-400/30'>
                  AI TUTOR
                </span>
                <Sparkles size={14} className='text-pink-300 animate-pulse' />
              </div>
              <h3 className='text-xl font-black text-white drop-shadow-md'>AI 真人私教对练</h3>
              <p className='mt-1 text-xs font-medium text-white/95 drop-shadow-sm'>
                沉浸式真实口语对话
              </p>
            </div>
          </button>
        </section>

        {/* 主线闯关地图 */}
        <section className='mt-4'>
          <Link
            href='/learn'
            className={`${glassCard} relative flex items-center gap-4 p-5 overflow-hidden border-l-[6px] border-l-green-500`}
          >
            {/* 装饰微光 */}
            <div className='absolute -right-6 -top-6 h-24 w-24 rounded-full bg-green-500/10 blur-2xl' />
            
            {/* 图标盒子 */}
            <div className='relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 text-white shadow-lg shadow-green-200 transition-transform active:scale-110'>
              <Map size={26} />
            </div>

            {/* 内容区 */}
            <div className='relative flex-1'>
              <div className='flex items-center gap-2'>
                <h3 className='text-lg font-black text-slate-900 uppercase leading-tight'>主线闯关地图</h3>
                <span className='rounded bg-green-500 px-1.5 py-0.5 text-[9px] font-black text-white animate-pulse'>NEW</span>
              </div>
              <p className='text-[13px] font-bold text-slate-600 mt-0.5'>စနစ်တကျ လေ့လာရန် လမ်းပြမြေပုံ</p>
              
              {/* 游戏化进度条装饰 */}
              <div className="mt-3 flex items-center gap-2">
                <div className="h-1.5 w-full max-w-[110px] rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full w-2/5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                </div>
                <span className="text-[9px] font-black text-green-600 tracking-tighter opacity-70">CONTINUE</span>
              </div>
            </div>

            <ChevronRight className='h-5 w-5 text-slate-300 shrink-0' />
          </Link>
        </section>

        {/* 系统课程 */}
        <section className='mt-8'>
          <div className='mb-4 flex items-center gap-2 px-1'>
            <BookOpen className='h-4 w-4 text-slate-400' />
            <h2 className='text-[11px] font-black tracking-[0.2em] text-slate-500 uppercase'>
              SYSTEM COURSES
            </h2>
          </div>
          <div className='flex flex-col gap-4'>
            {systemCourses.map(course => (
              <Link
                key={course.title}
                href={course.href}
                className='group relative h-40 overflow-hidden rounded-[2.5rem] shadow-lg border border-white/60 active:scale-[0.98] transition-all'
              >
                <img
                  src={course.bgImg}
                  alt={course.title}
                  className='absolute inset-0 h-full w-full object-cover'
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${course.color} to-transparent`} />
                <div className='relative flex h-full flex-col justify-center px-8'>
                  <span className='w-fit rounded-lg bg-white/25 backdrop-blur-md px-2 py-0.5 text-[9px] font-black text-white mb-2 uppercase border border-white/30'>
                    {course.badge}
                  </span>
                  <h3 className='text-2xl font-black text-white drop-shadow-md'>{course.title}</h3>
                  <p className='text-xs font-medium text-white/95 drop-shadow-sm mt-1'>{course.mmDesc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* 底部导航 (类似微信：均匀散开全屏宽度，纯大图标，无文字，高度适中) */}
      <nav className='fixed bottom-0 left-0 right-0 z-[50] bg-white/95 backdrop-blur-xl border-t border-slate-100 pt-3 pb-[calc(env(safe-area-inset-bottom)+12px)] shadow-[0_-10px_20px_rgba(0,0,0,0.08)]'>
        <div className='flex items-center justify-between w-full max-w-md mx-auto px-6'>
          <FooterItem icon={MessageCircle} />
          <FooterItem icon={Globe2} />
          <FooterItem icon={Users} />
          <FooterItem icon={Compass} />
          {/* 主按钮带一点背景框区分 */}
          <Link href='/' className='flex flex-col items-center justify-center text-indigo-600 active:scale-90 transition-transform p-1'>
            <div className='bg-indigo-50 p-2.5 rounded-xl border border-indigo-100 shadow-sm'>
              <BookOpen size={26} strokeWidth={2.5} />
            </div>
          </Link>
        </div>
      </nav>

      {/* 所有全屏弹窗统一挂载在此，防止组件卸载导致底层滚动位置丢失 */}
      <AnimatePresence>
        {activeOverlay === 'translator' && (
          <div className='fixed inset-0 z-[150]'>
            <AIChatDrawer isOpen={true} onClose={closeOverlay} />
          </div>
        )}
        {activeOverlay === 'ai-tutor' && (
          <div className='fixed inset-0 z-[150]'>
            <VoiceChat isOpen={true} onClose={closeOverlay} />
          </div>
        )}
        {activeOverlay === 'library' && (
          <div className='fixed inset-0 z-[150]'>
            <BookLibrary isOpen={true} onClose={closeOverlay} />
          </div>
        )}
      </AnimatePresence>
    </main>
  )
}

// 修改后的 FooterItem 组件，移除文字，放大图标
function FooterItem({ icon: Icon }) {
  return (
    <button type="button" className='flex flex-col items-center justify-center p-2 text-slate-500 hover:text-slate-800 active:scale-90 transition-all'>
      <Icon size={25} strokeWidth={2} />
    </button>
  )
}

// ===================== 基础布局框架 =====================
const LayoutBase = props => {
  const { children, slotTop } = props
  const { onLoading, fullWidth } = useGlobal()
  const searchModal = useRef(null)
  const router = useRouter()
  const pathname = router?.pathname || ''

  const isLearningRoute =
    pathname === '/' ||
    pathname.startsWith('/vocabulary') ||
    pathname.startsWith('/pinyin') ||
    pathname.startsWith('/course') ||
    pathname.startsWith('/oral') ||
    pathname.startsWith('/learn')

  if (isLearningRoute) {
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
      <div id='theme-simple' className={`${siteConfig('FONT_STYLE')} min-h-screen flex flex-col bg-white dark:bg-black scroll-smooth`}>
        <Style />
        {siteConfig('SIMPLE_TOP_BAR', null, CONFIG) && <TopBar {...props} />}
        <Header {...props} />
        <NavBar {...props} />
        <div id='container-wrapper' className={(JSON.parse(siteConfig('LAYOUT_SIDEBAR_REVERSE')) ? 'flex-row-reverse' : '') + ' w-full flex-1 flex items-start max-w-9/10 mx-auto pt-12'}>
          <div id='container-inner' className='w-full flex-grow min-h-fit'>
            <Transition show={!onLoading} appear={true} enter='transition duration-700' enterFrom='opacity-0 translate-y-16' enterTo='opacity-100 translate-y-0'>
              {slotTop}
              {children}
            </Transition>
            <AdSlot type='native' />
          </div>
          {!fullWidth && (
            <div id='right-sidebar' className='hidden xl:block flex-none sticky top-8 w-96 border-l border-gray-100 pl-12'>
              <SideBar {...props} />
            </div>
          )}
        </div>
        <div className='fixed right-4 bottom-4 z-20'>
          <JumpToTopButton />
        </div>
        <AlgoliaSearchModal cRef={searchModal} {...props} />
        <Footer {...props} />
      </div>
    </ThemeGlobalSimple.Provider>
  )
}

const LayoutIndex = props => <LayoutLearningHome {...props} />

const LayoutPostList = props => (
  <>
    <BlogPostBar {...props} />
    {siteConfig('POST_LIST_STYLE') === 'page'
      ? <BlogListPage {...props} />
      : <BlogListScroll {...props} />}
  </>
)

const LayoutSearch = props => {
  const { keyword } = props
  useEffect(() => {
    if (isBrowser) {
      replaceSearchResult({
        doms: document.getElementById('posts-wrapper'),
        search: keyword,
        target: { element: 'span', className: 'text-red-500' }
      })
    }
  }, [keyword])
  return <LayoutPostList {...props} slotTop={siteConfig('ALGOLIA_APP_ID') ? null : <SearchInput {...props} />} />
}

const LayoutArchive = props => (
  <div className='mb-10 pb-20 md:py-12 p-3 min-h-screen w-full'>
    {Object.keys(props.archivePosts).map(archiveTitle => (
      <BlogArchiveItem key={archiveTitle} archiveTitle={archiveTitle} archivePosts={props.archivePosts} />
    ))}
  </div>
)

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
          <div id='article-wrapper'>{!lock && <NotionPage post={post} />}</div>
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

const Layout404 = props => <>404 Not found.</>

const LayoutCategoryIndex = props => (
  <div id='category-list' className='duration-200 flex flex-wrap'>
    {props.categoryOptions?.map(c => (
      <SmartLink key={c.name} href={`/category/${c.name}`} passHref legacyBehavior>
        <div className='hover:bg-gray-100 px-5 cursor-pointer py-2'>
          <i className='mr-4 fas fa-folder' />
          {c.name}({c.count})
        </div>
      </SmartLink>
    ))}
  </div>
)

const LayoutTagIndex = props => (
  <div id='tags-list' className='duration-200 flex flex-wrap'>
    {props.tagOptions.map(t => (
      <div key={t.name} className='p-2'>
        <SmartLink
          href={`/tag/${encodeURIComponent(t.name)}`}
          className={`cursor-pointer inline-block rounded hover:bg-gray-500 hover:text-white duration-200 mr-2 py-1 px-2 text-xs notion-${t.color}_background`}
        >
          <div className='font-light'>
            <i className='mr-1 fas fa-tag' /> {t.name + (t.count ? `(${t.count})` : '')}
          </div>
        </SmartLink>
      </div>
    ))}
  </div>
)

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
