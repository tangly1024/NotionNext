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

// ====== 先占位，暂时不要接真实组件 ======
// const BookLibrary = dynamic(() => import('@/components/BookLibrary'), { ssr: false })
// const AIChatDrawer = dynamic(() => import('@/components/AIChatDrawer'), { ssr: false })
// const VoiceChat = dynamic(() => import('@/components/VoiceChat'), { ssr: false })

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
  { zh: '声母', mm: 'ဗျည်း', icon: Mic, href: '/pinyin/initials', bg: 'bg-blue-100/80', color: 'text-blue-600' },
  { zh: '韵母', mm: 'သရ', icon: Music2, href: '/pinyin/finals', bg: 'bg-emerald-100/80', color: 'text-emerald-600' },
  { zh: '整体', mm: 'အသံတွဲ', icon: Layers3, href: '/pinyin/whole', bg: 'bg-purple-100/80', color: 'text-purple-600' },
  { zh: '声调', mm: 'အသံ', icon: FileText, href: '/pinyin/tones', bg: 'bg-orange-100/80', color: 'text-orange-600' }
]

const coreTools = [
  { zh: 'AI 翻译', mm: 'AI ဘာသာပြန်', icon: Globe, action: 'translator', bg: 'bg-indigo-50', iconColor: 'text-indigo-600' },
  { zh: '免费书籍', mm: 'စာကြည့်တိုက်', icon: Library, action: 'library', bg: 'bg-cyan-50', iconColor: 'text-cyan-600' },
  { zh: '单词收藏', mm: ': '/words', bg: 'bg-slate-50', iconColor: 'text-slate-600' },
  { zh: '口语收藏', mm: 'မှတ်ထားသော စကားပြော', icon: Volume2, href: '/oral', bg: 'bg-slate-50', iconColor: 'text-slate-600' }
]

const systemCourses = [
  {
    badge: 'AI Tutor',
    sub: '口语对练 (AI SPEAKING)',
    title: 'AI 真人私教对练',
    mmDesc: '沉浸式真实口语对话',
    bgImg: '/images/cards/ai-speaking.jpg',
    action: 'ai-tutor',
    color: 'from-fuchsia-600/90'
  },
  {
    badge: 'Words',
    sub: '词汇 (VOCABULARY)',
    title: '日常高频词汇',
    mmDesc: 'အခြေခံ စကားလုံးများကို လေ့လာပါ。',
    bgImg: '/images/cards/daily-vocab.jpg',
    href: '/vocabulary',
    color: 'from-blue-600/90'
  },
  {
    badge: 'Oral',
    sub: '短句 (ORAL)',
    title: '场景口语短句',
    mmDesc: 'အခြေအနေလိုက် စကားပြော လေ့ကျင့်မှု',
    bgImg: '/images/cards/oral-cover.jpg',
    href: '/oral',
    color: 'from-emerald-600/90'
  },
  {
    badge: 'HSK 1',
    sub: '入门 (INTRO)',
    title: 'HSK Level 1',
    mmDesc: 'အသုံးအများဆုံး စကားလုံးများနှင့် သဒ္ဒါ',
    bgImg: '/images/cards/hsk-course.jpg',
    href: '/course/hsk1',
    color: 'from-amber-600/90'
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

  const isTranslatorOpen = activeOverlay === 'translator'
  const isAiTutorOpen = activeOverlay === 'ai-tutor'

  useEffect(() => {
    if (typeof document === 'undefined') return
    const prev = document.body.style.overflow
    if (activeOverlay) document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [activeOverlay])

  // ====== 保命占位 ======
  if (isTranslatorOpen) {
    return (
      <div className='min-h-screen bg-white flex items-center justify-center text-slate-800 font-bold'>
        AIChatDrawer 占位
      </div>
    )
  }

  if (isAiTutorOpen) {
    return (
      <div className='min-h-screen bg-white flex items-center justify-center text-slate-800 font-bold'>
        VoiceChat 占位
      </div>
    )
  }

  const glassCard =
    'bg-white/70 backdrop-blur-md border border-white shadow-sm rounded-2xl transition-all active:scale-95 cursor-pointer'

  return (
    <main className='relative min-h-[100dvh] overflow-x-hidden text-slate-900'>
      <div className='fixed inset-0 -z-30'>
        <img
          src='/images/home-bg.jpg'
          alt=''
          aria-hidden='true'
          className='h-full w-full object-cover'
        />
      </div>
      <div className='fixed inset-0 -z-20 bg-white/40 backdrop-blur-[2px]' />
      <div className='fixed inset-0 -z-10 bg-gradient-to-b from-white/10 via-white/5 to-white/60' />

      <AnimatePresence>
        {activeOverlay === 'menu' && (
          <div className='fixed inset-0 z-[160] flex'>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeOverlay}
              className='absolute inset-0 bg-slate-900/40 backdrop-blur-sm'
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className='relative flex h-full w-72 flex-col bg-white shadow-2xl'
            >
              <div className='flex items-center justify-between border-b border-slate-100 p-6'>
                <div>
                  <h2 className='text-xl font-black text-slate-900'>菜单</h2>
                  <p className='text-xs text-slate-500'>中缅学习中心</p>
                </div>
                <button
                  type='button'
                  onClick={closeOverlay}
                  className='rounded-full bg-slate-100 p-2 active:scale-90'
                >
                  <X size={20} className='text-slate-800' />
                </button>
              </div>
              <nav className='space-y-2 p-4'>
                {['首页', 'HSK 课程', 'AI 翻译', '书籍库', '设置'].map((item) => (
                  <button
                    key={item}
                    type='button'
                    className='w-full rounded-xl p-4 text-left font-bold text-slate-800 transition-colors hover:bg-slate-50'
                  >
                    {item}
                  </button>
                ))}
              </nav>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      <div className='relative z-10 mx-auto w-full max-w-md px-4 pb-36 pt-6'>
        <header className='mb-8 flex items-center gap-4'>
          <button
            type='button'
            onClick={() => openOverlay('menu')}
            className='p-1.5 active:scale-90'
          >
            <Menu className='h-7 w-7 text-slate-800' />
          </button>
          <div>
            <h1 className='text-xl font-black leading-none text-slate-900'>中缅文学习中心</h1>
            <div className='mt-1.5 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-slate-500'>
              <Sparkles size={12} className='text-blue-500' />
              <span>Premium Hub</span>
            </div>
          </div>
        </header>

        <section className='grid grid-cols-4 gap-3'>
          {pinyinNav.map((item) => (
            <Link
              key={item.zh}
              href={item.href}
              className={`${glassCard} flex flex-col items-center py-4`}
            >
              <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-full ${item.bg}`}>
                <item.icon className={`h-4 w-4 ${item.color}`} />
              </div>
              <p className='text-[13px] font-black text-slate-800'>{item.zh}</p>
              <p className='mt-0.5 text-[9px] font-medium text-slate-400'>{item.mm}</p>
            </Link>
          ))}
        </section>

        <section className='mt-4 grid grid-cols-2 gap-3'>
          {coreTools.map((tool) => {
            const content = (
              <div className='flex items-center gap-3'>
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tool.bg} ${tool.iconColor}`}>
                  <tool.icon size={20} />
                </div>
                <div className='min-w-0'>
                  <p className='truncate text-[13px] font-black text-slate-800'>{tool.zh}</p>
                  <p className='truncate text-[9px] text-slate-400'>{tool.mm}</p>
                </div>
              </div>
            )

            if (tool.action === 'translator') {
              return (
                <button
                  key={tool.zh}
                  type='button'
                  onClick={() => openOverlay('translator')}
                  className={`${glassCard} p-3.5 text-left`}
                >
                  {content}
                </button>
              )
            }

            if (tool.action === 'library') {
              return (
                <button
                  key={tool.zh}
                  type='button'
                  onClick={() => openOverlay('library')}
                  className={`${glassCard} p-3.5 text-left`}
                >
                  {content}
                </button>
              )
            }

            return (
              <Link key={tool.zh} href={tool.href} className={`${glassCard} p-3.5`}>
                {content}
              </Link>
            )
          })}
        </section>

        <section className='mt-4'>
          <Link href='/pinyin/tips' className={`${glassCard} flex items-center justify-between p-4`}>
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

        <section className='mt-8'>
          <div className='mb-4 flex items-center gap-2 px-1'>
            <BookOpen className='h-4 w-4 text-slate-400' />
            <h2 className='text-[11px] font-black uppercase tracking-[0.2em] text-slate-400'>
              SYSTEM COURSES
            </h2>
          </div>

          <div className='flex flex-col gap-4'>
            {systemCourses.map((course) => {
              const card = (
                <div className='group relative h-40 overflow-hidden rounded-[2.5rem] border border-white shadow-lg'>
                  <img
                    src={course.bgImg}
                    alt={course.title}
                    className='absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110'
                  />
                  <div className={`absolute inset-0 bg-gradient-to-r ${course.color} to-transparent`} />
                  <div className='relative flex h-full flex-col justify-center px-8'>
                    <span className='mb-2 w-fit rounded-lg bg-white/20 px-2 py-0.5 text-[9px] font-black uppercase text-white backdrop-blur-md'>
                      {course.badge}
                    </span>
                    <h3 className='text-2xl font-black text-white'>{course.title}</h3>
                    <p className='mt-1 text-xs font-medium text-white/80'>{course.mmDesc}</p>
                  </div>
                </div>
              )

              if (course.action === 'ai-tutor') {
                return (
                  <button
                    key={course.title}
                    type='button'
                    onClick={() => openOverlay('ai-tutor')}
                    className='w-full text-left'
                  >
                    {card}
                  </button>
                )
              }

              return (
                <Link key={course.title} href={course.href}>
                  {card}
                </Link>
              )
            })}
          </div>
        </section>
      </div>

      <nav className='fixed bottom-0 left-0 right-0 z-[50] border-t border-slate-100 bg-white px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+10px)] shadow-[0_-10px_20px_rgba(0,0,0,0.05)]'>
        <div className='flex items-center justify-between'>
          <FooterItem icon={MessageCircle} label='消息' />
          <FooterItem icon={Globe2} label='社区' />
          <FooterItem icon={Users} label='语伴' />
          <FooterItem icon={Compass} label='动态' />
          <Link href='/' className='flex flex-col items-center gap-1 text-indigo-600'>
            <div className='rounded-xl bg-indigo-50 p-1.5'>
              <BookOpen size={22} />
            </div>
            <span className='text-[10px] font-bold'>学习</span>
          </Link>
        </div>
      </nav>

      <AnimatePresence>
        {activeOverlay === 'library' && (
          <div className='fixed inset-0 z-[150] bg-white flex items-center justify-center text-slate-800 font-bold'>
            BookLibrary 占位
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

// ===================== 3. 基础布局框架 =====================
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
    pathname.startsWith('/oral')

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
      <div
        id='theme-simple'
        className={`${siteConfig('FONT_STYLE')} min-h-screen flex flex-col bg-white dark:bg-black scroll-smooth`}
      >
        <Style />
        {siteConfig('SIMPLE_TOP_BAR', null, CONFIG) && <TopBar {...props} />}
        <Header {...props} />
        <NavBar {...props} />
        <div
          id='container-wrapper'
          className={
            (JSON.parse(siteConfig('LAYOUT_SIDEBAR_REVERSE')) ? 'flex-row-reverse' : '') +
            ' w-full flex-1 flex items-start max-w-9/10 mx-auto pt-12'
          }
        >
          <div id='container-inner' className='w-full flex-grow min-h-fit'>
            <Transition
              show={!onLoading}
              appear={true}
              enter='transition duration-700'
              enterFrom='opacity-0 translate-y-16'
              enterTo='opacity-100 translate-y-0'
            >
              {slotTop}
              {children}
            </Transition>
            <AdSlot type='native' />
          </div>
          {!fullWidth && (
            <div
              id='right-sidebar'
              className='hidden xl:block flex-none sticky top-8 w-96 border-l border-gray-100 pl-12'
            >
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

  return (
    <LayoutPostList
      {...props}
      slotTop={siteConfig('ALGOLIA_APP_ID') ? null : <SearchInput {...props} />}
    />
  )
}

const LayoutArchive = props => (
  <div className='mb-10 pb-20 md:py-12 p-3 min-h-screen w-full'>
    {Object.keys(props.archivePosts).map(archiveTitle => (
      <BlogArchiveItem
        key={archiveTitle}
        archiveTitle={archiveTitle}
        archivePosts={props.archivePosts}
      />
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
    {props.tagOptions.map keytag/${encode.name)}`}
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
