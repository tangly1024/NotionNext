
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
import { createContext, useContext, useEffect, useRef, useState, useCallback, TouchEvent } from 'react'
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
  User,
  Volume2,
  X,
  Sparkles,
  Map 
} from 'lucide-react'
import BlogPostBar from './components/BlogPostBar'
import CONFIG from './config'
import { Style } from './style'

// --- 动态导入组件 (保持不变) ---
const AlgoliaSearchModal = dynamic(() => import('@/components/AlgoliaSearchModal'), { ssr: false })
const BookLibrary = dynamic(() => import('@/components/BookLibrary'), { ssr: false })
const AIChatDrawer = dynamic(() => import('@/components/AIChatDrawer'), { ssr: false })
const VoiceChat = dynamic(() => import('@/components/VoiceChat'), { ssr: false })
// ... 其他 import 保持原样 ...

const ThemeGlobalSimple = createContext()
export const useSimpleGlobal = () => useContext(ThemeGlobalSimple)

// --- 独立的手势抽屉组件 ---
const drawerWidth = 280;
function TouchDrawer({ isOpen, onClose, children }) {
  const [drawerX, setDrawerX] = useState(-drawerWidth);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartXRef = useRef(null);
  const drawerStartXRef = useRef(-drawerWidth);

  useEffect(() => {
    if (isOpen) setDrawerX(0);
    else setDrawerX(-drawerWidth);
  }, [isOpen]);

  const handleTouchStart = (e) => {
    const startX = e.touches[0]?.clientX ?? 0;
    if (!isOpen && startX > 24) return; 
    touchStartXRef.current = startX;
    drawerStartXRef.current = drawerX;
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || touchStartXRef.current === null) return;
    const currentX = e.touches[0]?.clientX ?? 0;
    const deltaX = currentX - touchStartXRef.current;
    const nextX = Math.max(-drawerWidth, Math.min(0, drawerStartXRef.current + deltaX));
    setDrawerX(nextX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    touchStartXRef.current = null;
    if (drawerX > -drawerWidth * 0.5) {
      setDrawerX(0); // 没滑过半，弹回打开
    } else {
      onClose(); // 滑过半，关闭
    }
  };

  const overlayOpacity = Math.max(0, Math.min(0.5, ((drawerX + drawerWidth) / drawerWidth) * 0.5));
  const showDrawerLayer = isOpen || isDragging || drawerX > -drawerWidth;

  if (!showDrawerLayer && !isOpen) return null;

  return (
    <div className={`fixed inset-0 z-[160] ${showDrawerLayer ? "" : "pointer-events-none"}`}
         onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
      <div className="absolute inset-0 bg-black transition-opacity duration-200"
           style={{ opacity: overlayOpacity }} onClick={onClose} />
      <aside className={`absolute inset-y-0 left-0 w-[280px] bg-white/95 backdrop-blur-xl shadow-2xl flex flex-col border-r border-slate-100 ${isDragging ? "" : "transition-transform duration-300 ease-out"}`}
             style={{ transform: `translateX(${drawerX}px)` }}>
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900">菜单</h2>
            <p className="text-xs text-slate-500">中缅学习中心</p>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full active:scale-90 transition-colors">
            <X size={20} className="text-slate-800" />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </aside>
    </div>
  );
}

// --- 底部纯图标导航组件 ---
function FooterLink({ href, icon: Icon, isCenter = false }) {
  if (isCenter) {
    return (
      <a href={href} className='flex flex-col items-center justify-center text-indigo-600 active:scale-90 transition-transform p-1'>
        <div className='bg-indigo-50 p-2.5 rounded-xl border border-indigo-100 shadow-sm'>
          <Icon size={26} strokeWidth={2.5} />
        </div>
      </a>
    )
  }
  return (
    <a href={href} className='flex flex-col items-center justify-center p-2 text-slate-500 hover:text-slate-800 active:scale-90 transition-all'>
      <Icon size={25} strokeWidth={2} />
    </a>
  )
}

// ----------------- 主页面布局 -----------------
const LayoutLearningHome = () => {
  const router = useRouter()
  const [activeOverlay, setActiveOverlay] = useState(null)
  // ... (保留 openOverlay / closeOverlay / useEffect 防止滚动穿透等逻辑) ...

  const glassCard = 'bg-white/95 backdrop-blur-xl border border-white/60 shadow-lg shadow-slate-200/50 rounded-2xl transition-all active:scale-95 cursor-pointer hover:shadow-xl hover:shadow-slate-300/60'

  return (
    <main className='relative min-h-[100dvh] overflow-x-hidden text-slate-900'>
      {/* 背景层 保持不变 */}
      
      {/* 侧滑抽屉 */}
      <TouchDrawer isOpen={activeOverlay === 'menu'} onClose={closeOverlay}>
        <nav className='space-y-2'>
          {['首页', 'HSK 课程', 'AI 翻译', '书籍库', '设置'].map(item => (
            <button key={item} type='button' className='w-full text-left p-4 text-slate-800 font-bold hover:bg-slate-50 rounded-xl transition-colors'>
              {item}
            </button>
          ))}
        </nav>
      </TouchDrawer>

      <div className='relative z-10 mx-auto w-full max-w-md px-4 pb-24 pt-6'>
        {/* 顶部：去掉了三条杠的背景和边框 */}
        <header className='mb-8 flex items-center gap-3'>
          <button
            type='button'
            onClick={() => openOverlay('menu')}
            className='p-1 active:scale-90 transition-transform' // 去掉了背景色和边框
          >
            <Menu className='h-8 w-8 text-slate-800' />
          </button>
          <div>
            <h1 className='text-xl font-black text-slate-900 leading-none'>中缅文学习中心</h1>
            <div className='mt-1.5 flex items-center gap-1 text-[10px] font-bold text-slate-600 uppercase tracking-widest'>
              <Sparkles size={12} className='text-blue-500' />
              <span>Premium Hub</span>
            </div>
          </div>
        </header>

        {/* ... 中间业务卡片代码保持不变 (拼音、发音、AI对练、课程等) ... */}

      </div>

      {/* 底部导航 (完全纯图标 + 外部链接绑定) */}
      <nav className='fixed bottom-0 left-0 right-0 z-[50] bg-white/95 backdrop-blur-xl border-t border-slate-100 pt-1 pb-[calc(env(safe-area-inset-bottom)+7px)] shadow-[0_-10px_20px_rgba(0,0,0,0.08)]'>
        <div className='flex items-center justify-between w-full max-w-md mx-auto px-6'>
          {/* 消息 */}
          <FooterLink href="https://bbs.886.best/user/mei/chats" icon={MessageCircle} />
          {/* 语伴社区 */}
          <FooterLink href="https://bbs.886.best/" icon={Users} />
          {/* 学习 (主按钮) */}
          <FooterLink href="https://886.best" icon={BookOpen} isCenter={true} />
          {/* 动态 */}
          <FooterLink href="https://bbs.886.best/recent" icon={Compass} />
          {/* 我的 (使用 User 图标作为占位) */}
          <FooterLink href="https://886.best/me" icon={User} />
        </div>
      </nav>

      {/* 全屏弹窗区 保持不变 */}
    </main>
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
