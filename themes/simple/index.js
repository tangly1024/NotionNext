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
  Sparkles
} from 'lucide-react'
import BlogPostBar from './components/BlogPostBar'
import CONFIG from './config'
import { Style } from './style'

// --- 动态导入组件 ---
const AlgoliaSearchModal = dynamic(() => import('@/components/AlgoliaSearchModal'), { ssr: false })
const BookLibrary = dynamic(() => import('@/components/BookLibrary'), { ssr: false })
const AIChatDrawer = dynamic(() => import('@/components/AIChatDrawer'), { ssr: false }) // 新增 AI翻译组件导入
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

// 主题全局状态
const ThemeGlobalSimple = createContext()
export const useSimpleGlobal = () => useContext(ThemeGlobalSimple)

// ===================== 1. 学习首页配置数据 =====================
const pinyinNav = [
  { zh: '声母', mm: 'ဗျည်း', icon: Mic, href: '/pinyin/initials', bg: 'bg-blue-100/80', color: 'text-blue-600' },
  { zh: '韵母', mm: 'သရ', icon: Music2, href: '/pinyin/finals', bg: 'bg-emerald-100/80', color: 'text-emerald-600' },
  { zh: '整体', mm: 'အသံတွဲ', icon: Layers3, href: '/pinyin/syllables', bg: 'bg-purple-100/80', color: 'text-purple-600' },
  { zh: '声调', mm: 'အသံ', icon: FileText, href: '/pinyin/tones', bg: 'bg-orange-100/80', color: 'text-orange-600' }
]

const coreTools = [
  // 注意：移除了 href，加入了 action 用于触发弹窗
  { zh: 'AI 翻译', mm: 'AI ဘာသာပြန်', icon: Globe, action: 'translator', bg: 'bg-indigo-50', iconColor: 'text-indigo-600' },
  { zh: '免费书籍', mm: 'စာကြည့်တိုက်', icon: Library, action: 'library', bg: 'bg-cyan-50', iconColor: 'text-cyan-600' },
  { zh: '单词收藏', mm: 'မှတ်ထားသော စာလုံး', icon: Star, href: '/words', bg: 'bg-slate-50', iconColor: 'text-slate-600' },
  { zh: '口语收藏', mm: 'မှတ်ထားသော စကားပြော', icon: Volume2, href: '/oral', bg: 'bg-slate-50', iconColor: 'text-slate-600' }
]

const systemCourses = [
  {
    badge: 'Words',
    sub: '词汇 (VOCABULARY)',
    title: '日常高频词汇',
    mmDesc: 'အခြေခံ စကားလုံးများကို လေ့လာပါ。',
    bgImg: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=1200',
    href: '/course/words',
    color: 'from-blue-600/90'
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

// ===================== 2. 学习首页组件 (原生 App 级弹窗控制) =====================
const LayoutLearningHome = () => {
  const router = useRouter()
  
  // 核心：使用单个状态管理所有覆盖层 (弹窗/菜单)，避免状态冲突
  const [activeOverlay, setActiveOverlay] = useState(null)

  // 极佳的路由劫持逻辑：解决安卓返回键和 iOS 侧滑返回问题
  const openOverlay = useCallback((overlayType) => {
    setActiveOverlay((prev) => {
      if (prev === overlayType) return prev;
      if (typeof window !== 'undefined') {
        // 往浏览器历史记录推入一个虚拟状态，这样按返回键只会退回上一层(关闭弹窗)
        window.history.pushState({ overlay: overlayType }, '', window.location.href);
      }
      return overlayType;
    });
  }, []);

  const closeOverlay = useCallback(() => {
    if (activeOverlay && typeof window !== 'undefined') {
      window.history.back(); // 触发后退，由 popstate 监听器负责清理状态
      return;
    }
    setActiveOverlay(null);
  }, [activeOverlay]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onPopState = () => setActiveOverlay(null);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // 样式：浅色系透明玻璃卡片
  const glassCard = 'bg-white/70 backdrop-blur-md border border-white shadow-sm rounded-2xl transition-all active:scale-95 cursor-pointer'

  return (
    // 移除了危险的全局 onTouchStart / onTouchEnd，避免误触关闭网页
    <main className='relative min-h-[100dvh] overflow-x-hidden text-slate-900'>
      
      {/* 全局背景图：固定透明感 */}
      <div className='fixed inset-0 -z-30 bg-cover bg-center' style={{ backgroundImage: "url('/images/home-bg.jpg')" }} />
      <div className='fixed inset-0 -z-20 bg-white/40 backdrop-blur-[2px]' />

      {/* 侧边栏菜单 */}
      <AnimatePresence>
        {activeOverlay === 'menu' && (
          <div className="fixed inset-0 z-[160] flex">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeOverlay} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              // Framer Motion 手势支持：向左滑动关闭菜单
              drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={{ left: 0.5, right: 0 }}
              onDragEnd={(e, info) => { if (info.offset.x < -80 || info.velocity.x < -400) closeOverlay() }}
              className="relative w-72 h-full bg-white shadow-2xl flex flex-col">
              <div className='p-6 border-b border-slate-100 flex items-center justify-between'>
                <div>
                  <h2 className='text-xl font-black text-slate-900'>菜单</h2>
                  <p className='text-xs text-slate-500'>中缅学习中心</p>
                </div>
                <button onClick={closeOverlay} className='p-2 bg-slate-100 rounded-full active:scale-90 transition-transform'>
                    <X size={20} className='text-slate-800' />
                </button>
              </div>
              <nav className='p-4 space-y-2'>
                {['首页', 'HSK 课程', 'AI 翻译', '书籍库', '设置'].map(item => (
                  <button key={item} className='w-full text-left p-4 text-slate-800 font-bold hover:bg-slate-50 rounded-xl transition-colors'>
                    {item}
                  </button>
                ))}
              </nav>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      <div className='relative z-10 mx-auto w-full max-w-md px-4 pb-36 pt-6'>
        {/* Header */}
        <header className='mb-8 flex items-center gap-4'>
          <button onClick={() => openOverlay('menu')} className='p-2.5 bg-white/80 rounded-2xl shadow-sm border border-white active:scale-90 transition-transform'>
            <Menu className='h-6 w-6 text-slate-800' />
          </button>
          <div>
            <h1 className='text-xl font-black text-slate-900 leading-none'>中缅文学习中心</h1>
            <div className='mt-1.5 flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest'>
               <Sparkles size={12} className='text-blue-500' /> 
               <span>Premium Hub</span>
            </div>
          </div>
        </header>

        {/* 拼音导航 */}
        <section className='grid grid-cols-4 gap-3'>
          {pinyinNav.map(item => (
            <Link key={item.zh} href={item.href} className={`${glassCard} flex flex-col items-center py-4`}>
                <div className={`flex h-9 w-9 items-center justify-center rounded-full ${item.bg} mb-2`}>
                  <item.icon className={`h-4 w-4 ${item.color}`} />
                </div>
                <p className='text-[13px] font-black text-slate-800'>{item.zh}</p>
                <p className='text-[9px] font-medium text-slate-400 mt-0.5'>{item.mm}</p>
            </Link>
          ))}
        </section>

        {/* 核心工具区 */}
        <section className='mt-4 grid grid-cols-2 gap-3'>
          {coreTools.map(tool => {
            const content = (
              <div className="flex items-center gap-3">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tool.bg} ${tool.iconColor}`}>
                  <tool.icon size={20} />
                </div>
                <div className='min-w-0'>
                  <p className='truncate text-[13px] font-black text-slate-800'>{tool.zh}</p>
                  <p className='truncate text-[9px] text-slate-400'>{tool.mm}</p>
                </div>
              </div>
            )
            // 如果是触发弹窗的按钮
            if (tool.action) {
              return (
                <button key={tool.zh} onClick={() => openOverlay(tool.action)} className={`${glassCard} p-3.5 text-left`}>
                  {content}
                </button>
              )
            }
            // 普通跳转链接
            return (
              <Link key={tool.zh} href={tool.href} className={`${glassCard} p-3.5`}>
                {content}
              </Link>
            )
          })}
        </section>

        {/* 发音技巧提示条 */}
        <section className='mt-4'>
          <Link href='/tips' className={`${glassCard} flex items-center justify-between p-4`}>
            <div className='flex items-center gap-4'>
              <div className='rounded-xl bg-orange-100 p-2 text-orange-600'>
                <Lightbulb size={20} />
              </div>
              <div>
                <p className='text-[14px] font-black text-slate-800'>发音技巧 (Tips)</p>
                <p className='text-[10px] text-slate-400'>အသံထွက်နည်းလမ်းများ</p>
              </div>
            </div>
            <ChevronRight className='h-5 w-5 text-slate-300' />
          </Link>
        </section>

        {/* 系统课程 */}
        <section className='mt-8'>
          <div className='mb-4 flex items-center gap-2 px-1'>
            <BookOpen className='h-4 w-4 text-slate-400' />
            <h2 className='text-[11px] font-black tracking-[0.2em] text-slate-400 uppercase'>SYSTEM COURSES</h2>
          </div>

          <div className='flex flex-col gap-4'>
            {systemCourses.map(course => (
              <Link key={course.title} href={course.href} className='group relative h-40 overflow-hidden rounded-[2.5rem] shadow-lg border border-white'>
                <img src={course.bgImg} className='absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110' />
                <div className={`absolute inset-0 bg-gradient-to-r ${course.color} to-transparent`} />
                <div className='relative flex h-full flex-col justify-center px-8'>
                  <span className='w-fit rounded-lg bg-white/20 backdrop-blur-md px-2 py-0.5 text-[9px] font-black text-white mb-2 uppercase'>
                    {course.badge}
                  </span>
                  <h3 className='text-2xl font-black text-white'>{course.title}</h3>
                  <p className='text-xs font-medium text-white/80 mt-1'>{course.mmDesc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* 底部导航栏 */}
      <nav className='fixed bottom-0 left-0 right-0 z-[50] bg-white border-t border-slate-100 px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+10px)] shadow-[0_-10px_20px_rgba(0,0,0,0.05)]'>
        <div className='flex items-center justify-between'>
          <FooterItem icon={MessageCircle} label="消息" />
          <FooterItem icon={Globe2} label="社区" />
          <FooterItem icon={Users} label="语伴" />
          <FooterItem icon={Compass} label="动态" />
          <Link href='/' className='flex flex-col items-center gap-1 text-indigo-600'>
             <div className='bg-indigo-50 p-1.5 rounded-xl'><BookOpen size={22} /></div>
             <span className='text-[10px] font-bold'>学习</span>
          </Link>
        </div>
      </nav>

      {/* ================== 核心功能弹窗渲染 ================== */}
      {/* 1. AI 翻译抽屉 */}
      <AnimatePresence>
        {activeOverlay === 'translator' && (
          <AIChatDrawer onClose={closeOverlay} />
        )}
      </AnimatePresence>

      {/* 2. 图书馆沉浸式弹窗 */}
      <AnimatePresence>
        {activeOverlay === 'library' && (
          <div className="fixed inset-0 z-[150]">
            <BookLibrary isOpen={true} onClose={closeOverlay} />
          </div>
        )}
      </AnimatePresence>

    </main>
  )
}

function FooterItem({ icon: Icon, label }) {
    return (
        <div className='flex flex-col items-center gap-1 text-slate-400'>
            <Icon size={22} />
            <span className='text-[10px] font-bold'>{label}</span>
        </div>
    )
}

// ===================== 3. 基础布局框架 (保持原始全功能) =====================
const LayoutBase = props => {
  const { children, slotTop } = props
  const { onLoading, fullWidth } = useGlobal()
  const searchModal = useRef(null)
  const router = useRouter()
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
        <div className='fixed right-4 bottom-4 z-20'><JumpToTopButton /></div>
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
    {siteConfig('POST_LIST_STYLE') === 'page' ? <BlogListPage {...props} /> : <BlogListScroll {...props} />}
  </>
)
const LayoutSearch = props => {
  const { keyword } = props
  useEffect(() => {
    if (isBrowser) replaceSearchResult({ doms: document.getElementById('posts-wrapper'), search: keyword, target: { element: 'span', className: 'text-red-500' } })
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
        <div className='hover:bg-gray-100 px-5 cursor-pointer py-2'><i className='mr-4 fas fa-folder' />{c.name}({c.count})</div>
      </SmartLink>
    ))}
  </div>
)
const LayoutTagIndex = props => (
  <div id='tags-list' className='duration-200 flex flex-wrap'>
    {props.tagOptions.map(t => (
      <div key={t.name} className='p-2'>
        <SmartLink href={`/tag/${encodeURIComponent(t.name)}`} className={`cursor-pointer inline-block rounded hover:bg-gray-500 hover:text-white duration-200 mr-2 py-1 px-2 text-xs notion-${t.color}_background`}>
          <div className='font-light'><i className='mr-1 fas fa-tag' /> {t.name + (t.count ? `(${t.count})` : '')} </div>
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
