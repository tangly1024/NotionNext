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
  Briefcase,
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
  User,
  Volume2,
  X,
  Sparkles,
  Map,
  KeyRound,
  QrCode,
  Lock,
  ChevronLeft
} from 'lucide-react'
import BlogPostBar from './components/BlogPostBar'
import CONFIG from './config'
import { Style } from './style'

// --- 动态导入组件，优化首屏加载 ---
const AlgoliaSearchModal = dynamic(() => import('@/components/AlgoliaSearchModal'), { ssr: false })
const BookLibrary = dynamic(() => import('@/components/BookLibrary'), { ssr: false })
const AIChatDrawer = dynamic(() => import('@/components/AIChatDrawer'), { ssr: false })
const VoiceChat = dynamic(() => import('@/components/VoiceChat'), { ssr: false })
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

// --- 静态常量数据 ---
const pinyinNav = [
  { zh: '声母', mm: 'ဗျည်း', icon: Mic, href: '/pinyin/initials', bg: 'bg-blue-100/90', color: 'text-blue-700' },
  { zh: '韵母', mm: 'သရ', icon: Music2, href: '/pinyin/finals', bg: 'bg-emerald-100/90', color: 'text-emerald-700' },
  { zh: '整体', mm: 'အသံတွဲ', icon: Layers3, href: '/pinyin/whole', bg: 'bg-purple-100/90', color: 'text-purple-700' },
  { zh: '声调', mm: 'အသံ', icon: FileText, href: '/pinyin/tones', bg: 'bg-orange-100/90', color: 'text-orange-700' }
]

const coreTools = [
  { zh: 'AI 翻译', mm: 'AI ဘာသာပြန်', icon: Globe, action: 'translator', bg: 'bg-indigo-50', iconColor: 'text-indigo-600' },
  { zh: '书籍库', mm: 'စာကြည့်တိုက်', icon: Library, action: 'library', bg: 'bg-cyan-50', iconColor: 'text-cyan-600' },
  { zh: '单词收藏', mm: 'မှတ်ထားသော စာလုံး', icon: Star, href: '/words', bg: 'bg-slate-50', iconColor: 'text-slate-700' },
  { zh: '口语收藏', mm: 'စကားပြော', icon: Volume2, href: '/oral', bg: 'bg-slate-50', iconColor: 'text-slate-700' }
]

const systemCourses = [
  { badge: 'WORDS', title: '日常高频词汇', mmDesc: 'အခြေခံ စကားလုံးများကို လေ့လာပါ။', bgImg: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=1200', href: '/vocabulary', color: 'from-blue-600/90' },
  { badge: 'ORAL', title: '场景口语短句', mmDesc: 'အခြေအနေလိုက် စကားပြော လေ့ကျင့်မှု', bgImg: 'https://images.unsplash.com/photo-1528712306091-ed0763094c98?auto=format&fit=crop&q=80&w=1200', href: '/oral', color: 'from-emerald-600/90' },
  { badge: 'PATTERNS', title: '实用句型结构', mmDesc: 'ဝါကျတည်ဆောက်ပုံများ', bgImg: 'https://images.unsplash.com/photo-1455390582262-044cdead27d8?auto=format&fit=crop&q=80&w=1200', action: 'vip', color: 'from-purple-600/90', isLock: true },
  { badge: 'GRAMMAR', title: '核心语法解析', mmDesc: 'အခြေခံသဒ္ဒါရှင်းလင်းချက်', bgImg: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1200', action: 'vip', color: 'from-orange-600/90', isLock: true }
]

// --- 底部秒切组件 (JS Bridge) ---
function FooterLink({ href, icon: Icon, tabName, className = '' }) {
  const handleClick = (e) => {
    // 检测是否在 APP 的 WebView 环境中
    if (typeof window !== 'undefined' && window.AndroidInterface && window.AndroidInterface.switchTab) {
      e.preventDefault();
      window.AndroidInterface.switchTab(tabName || href);
    }
  };
  return (
    <a href={href} onClick={handleClick} className={`flex flex-col items-center justify-center p-2 text-slate-500 hover:text-slate-800 active:scale-90 transition-all ${className}`}>
      <Icon size={26} strokeWidth={2} />
    </a>
  )
}

// --- 主页面核心组件 ---
const LayoutLearningHome = () => {
  const router = useRouter()
  const [activeOverlay, setActiveOverlay] = useState(null)
  const [cdk, setCdk] = useState('')

  const openOverlay = useCallback((overlayType) => {
    setActiveOverlay((prev) => {
      if (prev === overlayType) return prev
      if (typeof window !== 'undefined') window.history.pushState({ overlay: overlayType }, '', window.location.href)
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

  // 处理物理返回键与 Popstate
  useEffect(() => {
    if (typeof window === 'undefined') return
    const onPopState = () => setActiveOverlay(null)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  // --- 电报级侧滑手势算法 ---
  useEffect(() => {
    if (typeof window === 'undefined') return
    let startX = 0
    let startY = 0

    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
    }

    const handleTouchEnd = (e) => {
      const endX = e.changedTouches[0].clientX
      const endY = e.changedTouches[0].clientY
      const deltaX = endX - startX
      const deltaY = Math.abs(endY - startY)

      // 判定：左侧边缘 40px 内起滑，向右滑 > 80px，上下偏移 < 50px
      if (startX < 40 && deltaX > 80 && deltaY < 50) {
        openOverlay('menu')
      }
    }

    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchend', handleTouchEnd)
    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [openOverlay])

  const glassCard = 'bg-white/95 backdrop-blur-xl border border-white/60 shadow-lg shadow-slate-200/50 rounded-2xl transition-all active:scale-95 hover:shadow-xl'

  return (
    <main className='relative min-h-[100dvh] overflow-x-hidden text-slate-900'>
      {/* 动态背景 */}
      <div className='fixed inset-0 -z-30 overflow-hidden'>
        <img src='/images/home-bg.jpg' alt='' className='h-full w-full object-cover scale-105 blur-[2px]' />
        <div className='absolute inset-0 bg-white/40 backdrop-blur-2xl' />
      </div>

      {/* 1. 电报风格侧滑菜单 */}
      <AnimatePresence>
        {activeOverlay === 'menu' && (
          <div className='fixed inset-0 z-[160] flex'>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeOverlay} className='absolute inset-0 bg-slate-900/40 backdrop-blur-sm' />
            <motion.aside
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              drag='x' dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, info) => { if (info.offset.x < -50) closeOverlay() }}
              className='relative w-[280px] h-full bg-white/95 backdrop-blur-xl shadow-2xl flex flex-col border-r border-slate-100'
            >
              <div className='p-6 border-b border-slate-100 flex items-center justify-between'>
                <div>
                  <h2 className='text-xl font-black text-slate-900 tracking-tighter'>菜单中心</h2>
                  <p className='text-[10px] text-slate-400 uppercase font-bold'>Navigation</p>
                </div>
                <button onClick={closeOverlay} className='p-2 bg-slate-100 rounded-full active:scale-90 transition-all'><X size={18} /></button>
              </div>
              <nav className='p-4 space-y-2 overflow-y-auto'>
                {['学习首页', 'HSK 课程', 'AI 翻译', '单词本', '个人设置'].map(item => (
                  <button key={item} className='w-full text-left p-4 text-slate-700 font-bold hover:bg-indigo-50 hover:text-indigo-600 rounded-2xl transition-all flex items-center justify-between group'>
                    {item} <ChevronRight size={16} className='opacity-0 group-hover:opacity-100 transition-all' />
                  </button>
                ))}
              </nav>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* 2. VIP 课程激活与导师弹窗 */}
      <AnimatePresence>
        {activeOverlay === 'vip' && (
          <div className='fixed inset-0 z-[160] flex items-center justify-center p-4'>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeOverlay} className='absolute inset-0 bg-slate-900/60 backdrop-blur-md' />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className='relative w-full max-w-sm bg-white/95 backdrop-blur-2xl rounded-[2.5rem] p-7 shadow-2xl border border-white/50 z-10'
            >
              <div className='flex justify-between items-start mb-6'>
                <div className='w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200'>
                  <KeyRound size={28} />
                </div>
                <button onClick={closeOverlay} className='p-2 bg-slate-100 rounded-full'><X size={20} /></button>
              </div>
              <h3 className='text-2xl font-black text-slate-900 mb-2'>解锁高级课程</h3>
              <p className='text-sm text-slate-500 mb-6 leading-relaxed'>此内容为会员专享。请联系分销导师转账获取激活码。</p>
              
              {/* 二级分销导师信息 */}
              <div className="bg-indigo-50/50 p-4 rounded-3xl border border-indigo-100 mb-6 flex items-center gap-4 group cursor-pointer active:scale-95 transition-all">
                <div className="w-12 h-12 rounded-full bg-white border-2 border-indigo-200 flex items-center justify-center text-indigo-500 overflow-hidden shadow-sm">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky" alt="Agent" />
                </div>
                <div className='flex-1'>
                  <p className="text-xs font-black text-indigo-400 uppercase tracking-widest">专属导师</p>
                  <p className="text-sm font-bold text-slate-800">@Admin_Agent (在线)</p>
                </div>
                <div className='p-2 bg-white rounded-xl text-indigo-600 shadow-sm'><QrCode size={20} /></div>
              </div>

              {/* CDK 输入框 */}
              <div className='relative flex flex-col gap-3'>
                <input
                  type="text" value={cdk} onChange={(e) => setCdk(e.target.value.toUpperCase())}
                  placeholder="输入 16 位激活码"
                  className="w-full bg-white border-2 border-slate-100 px-5 py-4 rounded-2xl text-sm font-bold outline-none focus:border-indigo-500 transition-all uppercase tracking-widest placeholder:text-slate-300 placeholder:tracking-normal"
                />
                <button className='w-full py-4 bg-slate-900 hover:bg-black text-white font-black rounded-2xl active:scale-95 transition-all shadow-xl shadow-slate-200'>
                  立即解锁内容
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 主内容区 */}
      <div className='relative z-10 mx-auto w-full max-w-md px-5 pb-32 pt-8'>
        {/* 导航头 */}
        <header className='mb-10 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <button onClick={() => openOverlay('menu')} className='p-1 active:scale-75 transition-all'><Menu className='h-8 w-8 text-slate-800' /></button>
            <div className='flex flex-col'>
              <h1 className='text-xl font-black text-slate-900 tracking-tighter leading-none'>中缅文学习中心</h1>
              <div className='mt-1 flex items-center gap-1.5 text-[9px] font-black text-blue-500 uppercase tracking-widest'>
                <Sparkles size={10} fill="currentColor" /> <span>Premium Access</span>
              </div>
            </div>
          </div>
          {/* 头像登录按钮：跳转论坛登录 */}
          <button onClick={() => window.location.href='https://bbs.886.best/login'} className="w-11 h-11 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm active:scale-90 transition-all">
            <User size={22} strokeWidth={2.5} />
          </button>
        </header>

        {/* 拼音网格 */}
        <section className='grid grid-cols-4 gap-3 mb-6'>
          {pinyinNav.map(item => (
            <Link key={item.zh} href={item.href} className={`${glassCard} flex flex-col items-center py-4`}>
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${item.bg} mb-2 shadow-inner`}><item.icon size={18} className={item.color} /></div>
              <p className='text-[13px] font-black text-slate-800'>{item.zh}</p>
              <p className='text-[8px] font-bold text-slate-400 mt-0.5'>{item.mm}</p>
            </Link>
          ))}
        </section>

        {/* 工具按钮 */}
        <section className='grid grid-cols-2 gap-3 mb-8'>
          {coreTools.map(tool => (
            <button
              key={tool.zh}
              onClick={() => tool.action ? openOverlay(tool.action) : (window.location.href=tool.href)}
              className={`${glassCard} p-4 flex items-center gap-3 text-left`}
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tool.bg} ${tool.iconColor} shadow-sm`}><tool.icon size={20} /></div>
              <div>
                <p className='text-[13px] font-black text-slate-800'>{tool.zh}</p>
                <p className='text-[8px] font-bold text-slate-400'>{tool.mm}</p>
              </div>
            </button>
          ))}
        </section>

        {/* AI 私教大通栏 */}
        <section className='mb-8'>
          <button onClick={() => openOverlay('ai-tutor')} className='group relative w-full h-[150px] overflow-hidden rounded-[2.5rem] shadow-2xl shadow-indigo-100 text-left active:scale-[0.97] transition-all border border-white/60'>
            <img src='https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&q=80&w=1200' alt='' className='absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-700' />
            <div className='absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/40 to-transparent' />
            <div className='relative z-10 h-full flex flex-col justify-center px-8'>
              <div className='mb-2 flex items-center gap-2'>
                <span className='px-2 py-0.5 bg-indigo-500 text-[9px] font-black text-white rounded-full tracking-widest uppercase'>Active Now</span>
                <div className='w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse'></div>
              </div>
              <h3 className='text-2xl font-black text-white drop-shadow-md'>AI 真人私教</h3>
              <p className='text-xs font-medium text-white/80 mt-1'>沉浸式纯正口语实战对练</p>
            </div>
          </button>
        </section>

        {/* 课程列表 */}
        <section className='flex flex-col gap-5'>
          <div className='flex items-center justify-between px-1'>
            <h2 className='text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]'>System Courses</h2>
            <div className='h-px flex-1 bg-slate-100 ml-4'></div>
          </div>
          {systemCourses.map(course => (
            <button
              key={course.title}
              onClick={() => course.action ? openOverlay(course.action) : (window.location.href=course.href)}
              className='group relative h-44 overflow-hidden rounded-[2.8rem] shadow-xl border border-white/60 active:scale-[0.98] transition-all text-left'
            >
              <img src={course.bgImg} className='absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-700' alt='' />
              <div className={`absolute inset-0 bg-gradient-to-r ${course.color} to-transparent opacity-90`} />
              <div className='relative p-9 h-full flex flex-col justify-center'>
                <span className='w-fit px-2 py-0.5 bg-white/20 backdrop-blur-md border border-white/30 text-[8px] font-black text-white rounded-lg mb-3 uppercase tracking-tighter'>{course.badge}</span>
                <h3 className='text-2xl font-black text-white flex items-center gap-2 drop-shadow-sm'>
                  {course.title} 
                  {course.isLock && <Lock size={18} fill="currentColor" className='text-amber-300 ml-1' />}
                </h3>
                <p className='text-white/90 text-xs font-medium mt-1'>{course.mmDesc}</p>
              </div>
              <div className='absolute bottom-6 right-8 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all'>
                <ChevronRight size={20} />
              </div>
            </button>
          ))}
        </section>
      </div>

      {/* 3. 底部秒切导航栏 (JS Bridge) */}
      <nav className='fixed bottom-0 left-0 right-0 z-[50] bg-white/90 backdrop-blur-2xl border-t border-slate-100 pt-2 pb-[calc(env(safe-area-inset-bottom)+8px)] shadow-[0_-15px_30px_rgba(0,0,0,0.05)]'>
        <div className='flex items-center justify-between w-full max-w-md mx-auto px-8'>
          <FooterLink href="/" icon={BookOpen} tabName="study" />
          <FooterLink href="https://bbs.886.best/chats" icon={MessageCircle} tabName="msg" />
          <FooterLink href="https://bbs.886.best/" icon={Users} tabName="forum" />
          <FooterLink href="https://bbs.886.best/recent" icon={Compass} tabName="recent" />
          <FooterLink href="https://bbs.886.best/" icon={Globe2} tabName="community" />
        </div>
      </nav>

      {/* 全屏动态挂载组件 */}
      <AnimatePresence>
        {activeOverlay === 'translator' && <div className='fixed inset-0 z-[170]'><AIChatDrawer isOpen={true} onClose={closeOverlay} /></div>}
        {activeOverlay === 'ai-tutor' && <div className='fixed inset-0 z-[170]'><VoiceChat isOpen={true} onClose={closeOverlay} /></div>}
        {activeOverlay === 'library' && <div className='fixed inset-0 z-[170]'><BookLibrary isOpen={true} onClose={closeOverlay} /></div>}
      </AnimatePresence>
    </main>
  )
}

// --- 基础布局框架 (LayoutBase) ---
const LayoutBase = props => {
  const { children, slotTop } = props
  const { onLoading } = useGlobal()
  const searchModal = useRef(null)
  const router = useRouter()
  const pathname = router?.pathname || ''

  // 判定是否为学习类路由，若是，则采用极简纯净布局
  const isEdu = ['/', '/vocabulary', '/pinyin', '/course', '/oral', '/learn'].some(r => pathname === r || pathname.startsWith(r))

  if (isEdu) {
    return (
      <ThemeGlobalSimple.Provider value={{ searchModal }}>
        <div id='theme-simple' className={`${siteConfig('FONT_STYLE')} min-h-screen bg-white`}>
          <Style />
          {children}
        </div>
      </ThemeGlobalSimple.Provider>
    )
  }

  // 博客类常规布局
  return (
    <ThemeGlobalSimple.Provider value={{ searchModal }}>
      <div id='theme-simple' className={`${siteConfig('FONT_STYLE')} min-h-screen flex flex-col bg-white dark:bg-black scroll-smooth`}>
        <Style />
        {siteConfig('SIMPLE_TOP_BAR', null, CONFIG) && <TopBar {...props} />}
        <Header {...props} />
        <NavBar {...props} />
        <div id='container-wrapper' className='w-full flex-1 flex items-start max-w-9/10 mx-auto pt-12'>
          <div id='container-inner' className='w-full flex-grow min-h-fit'>
            <Transition show={!onLoading} appear={true} enter='transition duration-700' enterFrom='opacity-0 translate-y-16' enterTo='opacity-100 translate-y-0'>
              {slotTop}
              {children}
            </Transition>
          </div>
        </div>
        <Footer {...props} />
        <AlgoliaSearchModal cRef={searchModal} {...props} />
      </div>
    </ThemeGlobalSimple.Provider>
  )
}

// --- 页面路由映射 ---
const LayoutIndex = props => <LayoutLearningHome {...props} />
const LayoutPostList = props => <>{siteConfig('POST_LIST_STYLE') === 'page' ? <BlogListPage {...props} /> : <BlogListScroll {...props} />}</>
const LayoutSearch = props => <LayoutPostList {...props} slotTop={<SearchInput {...props} />} />
const LayoutArchive = props => <div className='mb-10 pb-20 p-5 w-full'>{Object.keys(props.archivePosts).map(a => <BlogArchiveItem key={a} archiveTitle={a} archivePosts={props.archivePosts} />)}</div>
const LayoutSlug = props => {
  const { post, lock, validPassword } = props
  return (
    <div className='w-full max-w-4xl mx-auto'>
      {lock && <ArticleLock validPassword={validPassword} />}
      {!lock && post && <div className='px-4'><ArticleInfo post={post} /><div id='article-wrapper' className='mt-8'><NotionPage post={post} /></div><Comment frontMatter={post} /></div>}
    </div>
  )
}
const Layout404 = props => <div className='flex h-[60vh] items-center justify-center font-black text-slate-300 text-4xl uppercase tracking-tighter'>404 Not Found</div>
const LayoutCategoryIndex = props => <div id='category-list' className='p-8 flex flex-wrap gap-4'>{props.categoryOptions?.map(c => <Link key={c.name} href={`/category/${c.name}`} className='px-6 py-3 bg-slate-50 rounded-2xl font-bold hover:bg-indigo-600 hover:text-white transition-all shadow-sm'>{c.name} ({c.count})</Link>)}</div>
const LayoutTagIndex = props => <div id='tags-list' className='p-8 flex flex-wrap gap-2'>{props.tagOptions.map(t => <Link key={t.name} href={`/tag/${t.name}`} className='px-4 py-2 bg-slate-100 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm'># {t.name}</Link>)}</div>

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
