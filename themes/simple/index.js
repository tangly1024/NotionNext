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
import Image from 'next/image' // 引入 Next.js 优化图片组件
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, ChevronRight, Compass, FileText, Globe, Globe2, Layers3,
  Library, Lightbulb, Menu, MessageCircle, Mic, Music2, Star, Users,
  Volume2, X, Sparkles, Map, UserCircle, Briefcase, Activity
} from 'lucide-react'
import BlogPostBar from './components/BlogPostBar'
import CONFIG from './config'
import { Style } from './style'

// ... (动态导入保持不变)
const AlgoliaSearchModal = dynamic(() => import('@/components/AlgoliaSearchModal'), { ssr: false })
// ... 其他动态导入省略保持一致

const ThemeGlobalSimple = createContext()
export const useSimpleGlobal = () => useContext(ThemeGlobalSimple)

// 1. 生成图片骨架屏的占位 Base64 (灰色毛玻璃效果)
const blurDataURL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN88B8AAsUB4ZtvwVQAAAAASUVORK5CYII="

// 2. 模拟 NodeBB 用户状态同步 Hook
function useNodeBBAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 这里替换为实际检测 nodebb-plugin-session-sharing 的逻辑 (例如检测 cookie 或调用 API)
    const checkAuth = async () => {
      try {
        // 模拟 API 请求延迟
        await new Promise(resolve => setTimeout(resolve, 800));
        // 假设读取到了共享的 JWT 或 Cookie
        const isLogged = localStorage.getItem('mock_nodebb_logged_in'); 
        if (isLogged) {
          setUser({ username: 'learner_01', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop' });
        } else {
          setUser(null);
        }
      } catch (e) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  },[]);

  return { user, loading };
}

const pinyinNav = [ /* 保持不变 */ ]
const coreTools = [ /* 保持不变 */ ]
const systemCourses = [ /* 保持不变 */ ]

const LayoutLearningHome = () => {
  const router = useRouter()
  const [activeOverlay, setActiveOverlay] = useState(null)
  const { user, loading: authLoading } = useNodeBBAuth() // 获取用户信息

  const openOverlay = useCallback((overlayType) => {
    setActiveOverlay((prev) => {
      if (prev === overlayType) return prev
      if (typeof window !== 'undefined') window.history.pushState({ overlay: overlayType }, '', window.location.href)
      return overlayType
    })
  },[])

  const closeOverlay = useCallback(() => {
    if (activeOverlay && typeof window !== 'undefined') {
      window.history.back()
      return
    }
    setActiveOverlay(null)
  }, [activeOverlay])

  // 处理弹窗返回键
  useEffect(() => {
    if (typeof window === 'undefined') return
    const onPopState = () => setActiveOverlay(null)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  },[])

  // 3. 电报式手势：屏幕左侧边缘右滑呼出侧边栏
  useEffect(() => {
    let startX = 0;
    const handleTouchStart = (e) => { startX = e.touches[0].clientX; }
    const handleTouchEnd = (e) => {
      const endX = e.changedTouches[0].clientX;
      // 如果起始点在左侧 30px 以内，且向右滑动超过 50px
      if (startX < 30 && endX - startX > 50) {
        openOverlay('menu');
      }
    }
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    }
  }, [openOverlay]);

  // 锁定背景滚动
  useEffect(() => {
    if (typeof document === 'undefined') return
    document.body.style.overflow = activeOverlay ? 'hidden' : '';
  }, [activeOverlay])

  const glassCard = 'bg-white/95 backdrop-blur-xl border border-white/60 shadow-lg shadow-slate-200/50 rounded-2xl transition-all active:scale-95 cursor-pointer hover:shadow-xl hover:shadow-slate-300/60'

  return (
    <main className='relative min-h-[100dvh] overflow-x-hidden text-slate-900'>
      {/* 背景层使用 Next/Image 优化 */}
      <div className='fixed inset-0 -z-30'>
        <Image src='/images/home-bg.jpg' alt='bg' fill className='object-cover' quality={60} priority />
        <div className='absolute inset-0 bg-white/50 backdrop-blur-2xl' />
      </div>

      {/* 侧边栏 (支持拖拽关闭) */}
      <AnimatePresence>
        {activeOverlay === 'menu' && (
          <div className='fixed inset-0 z-[160] flex'>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeOverlay}
              className='absolute inset-0 bg-slate-900/40 backdrop-blur-sm'
            />
            <motion.aside
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              drag='x' dragConstraints={{ left: -200, right: 0 }} dragElastic={0.1}
              onDragEnd={(e, info) => { if (info.offset.x < -80 || info.velocity.x < -400) closeOverlay() }}
              className='relative w-72 h-full bg-white/95 backdrop-blur-xl shadow-2xl flex flex-col border-r border-slate-100'
            >
              {/* 侧边栏内容 */}
              <div className='p-6 border-b border-slate-100 flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  {/* 用户头像区域 (侧边栏) */}
                  {user ? (
                    <img src={user.avatar} alt="avatar" className="w-10 h-10 rounded-full border border-slate-200" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400"><UserCircle /></div>
                  )}
                  <div>
                    <h2 className='text-lg font-black text-slate-900'>{user ? user.username : '未登录'}</h2>
                    <p className='text-xs text-slate-500'>中缅学习中心</p>
                  </div>
                </div>
              </div>
              <nav className='p-4 space-y-2 overflow-y-auto'>
                <Link href='/' className='flex items-center gap-3 p-4 text-slate-800 font-bold hover:bg-slate-50 rounded-xl transition-colors'><BookOpen size={20}/>首页</Link>
                <Link href='https://bbs.886.best/category/9/%E6%8B%9B%E8%81%98' className='flex items-center gap-3 p-4 text-slate-800 font-bold hover:bg-slate-50 rounded-xl transition-colors'><Briefcase size={20}/>招聘</Link>
                {/* 其他侧边栏菜单 */}
              </nav>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      <div className='relative z-10 mx-auto w-full max-w-md px-4 pb-24 pt-6'>
        {/* 顶部 (去除了背景框) */}
        <header className='mb-8 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <button
              type='button'
              onClick={() => openOverlay('menu')}
              className='p-1 active:scale-90 transition-transform'
            >
              <Menu className='h-8 w-8 text-slate-800' />
            </button>
            <div>
              <h1 className='text-xl font-black text-slate-900 leading-none'>中缅文学习中心</h1>
            </div>
          </div>

          {/* 右上角登录/同步状态骨架屏 */}
          <div className="flex items-center">
            {authLoading ? (
              <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse" />
            ) : user ? (
              <Link href={`https://bbs.886.best/user/${user.username}`}>
                <img src={user.avatar} className="w-8 h-8 rounded-full border-2 border-indigo-500 shadow-sm" alt="User" />
              </Link>
            ) : (
              <Link href="https://bbs.886.best/login" className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">
                登录
              </Link>
            )}
          </div>
        </header>

        {/* ... 中间的课程、导航代码保持原样 (pinyinNav, coreTools 等) ... */}

        {/* AI 真人私教对练 (使用 Next/Image 懒加载和骨架屏) */}
        <section className='mt-8 mb-2'>
          <button
            type='button'
            onClick={() => openOverlay('ai-tutor')}
            className='group relative w-full h-[140px] overflow-hidden rounded-[2.5rem] shadow-xl text-left transition-all active:scale-95 border border-white/60 bg-slate-200'
          >
            <Image
              src='https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&q=80&w=1200'
              alt='AI 真人私教对练'
              fill
              className='object-cover transition-transform duration-700 group-hover:scale-105'
              placeholder="blur"
              blurDataURL={blurDataURL}
              sizes="(max-width: 768px) 100vw, 400px"
            />
            <div className='absolute inset-0 bg-gradient-to-r from-slate-900/85 to-slate-900/25' />
            <div className='relative z-10 flex h-full flex-col justify-center px-6'>
              {/* ...文案... */}
            </div>
          </button>
        </section>

        {/* 系统课程 (使用 Next/Image) */}
        <section className='mt-8'>
          <div className='flex flex-col gap-4'>
            {systemCourses.map(course => (
              <Link key={course.title} href={course.href} className='group relative h-40 overflow-hidden rounded-[2.5rem] shadow-lg border border-white/60 active:scale-[0.98] transition-all bg-slate-200'>
                <Image
                  src={course.bgImg}
                  alt={course.title}
                  fill
                  className='object-cover'
                  placeholder="blur"
                  blurDataURL={blurDataURL}
                  sizes="(max-width: 768px) 100vw, 400px"
                  loading="lazy"
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${course.color} to-transparent`} />
                <div className='relative flex h-full flex-col justify-center px-8'>
                  {/* ...文案... */}
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* 底部导航 - 配置实际外链 */}
      <nav className='fixed bottom-0 left-0 right-0 z-[50] bg-white/95 backdrop-blur-xl border-t border-slate-100 pt-1 pb-[calc(env(safe-area-inset-bottom)+7px)] shadow-[0_-10px_20px_rgba(0,0,0,0.08)]'>
        <div className='flex items-center justify-between w-full max-w-md mx-auto px-6'>
          {/* 1. 静态学习链接 */}
          <FooterItem icon={BookOpen} href="https://886.best" label="学习" />
          
          {/* 2. 社区 */}
          <FooterItem icon={Globe2} href="https://bbs.886.best/" label="社区" />
          
          {/* 3. 语伴 (主按钮) */}
          <Link href='https://bbs.886.best/partners' className='flex flex-col items-center justify-center text-indigo-600 active:scale-90 transition-transform p-1 -mt-5'>
            <div className='bg-indigo-50 p-3 rounded-full border border-indigo-100 shadow-md shadow-indigo-200/50 flex items-center justify-center'>
              <Users size={28} strokeWidth={2.5} />
            </div>
            <span className="text-[10px] mt-1 font-bold text-slate-700">语伴</span>
          </Link>

          {/* 4. 动态 */}
          <FooterItem icon={Activity} href="https://bbs.886.best/category/6/%E9%97%B2%E8%81%8A" label="动态" />
          
          {/* 5. 消息 (处理未登录跳转) */}
          <FooterItem 
            icon={MessageCircle} 
            href={user ? `https://bbs.886.best/user/${user.username}/chats` : "https://bbs.886.best/login"} 
            label="消息" 
          />
        </div>
      </nav>

      {/* 弹窗占位 ... */}
    </main>
  )
}

// 底部带图标和极小文字的导航组件
function FooterItem({ icon: Icon, href, label }) {
  return (
    <Link href={href} className='flex flex-col items-center justify-center p-1 text-slate-500 hover:text-indigo-600 active:scale-90 transition-all'>
      <Icon size={24} strokeWidth={2} />
      <span className="text-[9px] mt-1 font-medium">{label}</span>
    </Link>
  )
}

// ... LayoutBase 等代码保持不变 ...
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
