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
  ChevronDown,
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

const pinyinNav =[
  { zh: '声母', mm: 'ဗျည်း', icon: Mic, href: '/pinyin/initials', bg: 'bg-blue-100/80', color: 'text-blue-600' },
  { zh: '韵母', mm: 'သရ', icon: Music2, href: '/pinyin/finals', bg: 'bg-emerald-100/80', color: 'text-emerald-600' },
  { zh: '整体', mm: 'အသံတွဲ', icon: Layers3, href: '/pinyin/whole', bg: 'bg-purple-100/80', color: 'text-purple-600' },
  { zh: '声调', mm: 'အသံ', icon: FileText, href: '/pinyin/tones', bg: 'bg-orange-100/80', color: 'text-orange-600' }
]

const coreTools =[
  { zh: 'AI 翻译', mm: 'AI ဘာသာပြန်', icon: Globe, action: 'translator', bg: 'bg-indigo-50', iconColor: 'text-indigo-600' },
  { zh: '免费书籍', mm: 'စာကြည့်တိုက်', icon: Library, action: 'library', bg: 'bg-cyan-50', iconColor: 'text-cyan-600' },
  { zh: '单词收藏', mm: 'မှတ်ထားသော စာလုံး', icon: Star, href: '/words', bg: 'bg-slate-50', iconColor: 'text-slate-600' },
  { zh: '口语收藏', mm: 'မှတ်ထားသော စကားပြော', icon: Volume2, href: '/oral', bg: 'bg-slate-50', iconColor: 'text-slate-600' }
]

const systemCourses =[
  {
    badge: 'Words',
    sub: '词汇 (VOCABULARY)',
    title: '日常高频词汇',
    mmDesc: 'အခြေခံ စကားလုံးများကို လေ့လာပါ。',
    // 【修复图片】替换成了稳定的图片链接，后期建议换成本地如 /images/vocab.jpg
    bgImg: 'https://picsum.photos/seed/vocab/600/400',
    href: '/vocabulary',
    color: 'from-blue-600/90'
  },
  {
    badge: 'HSK 1',
    sub: '入门 (INTRO)',
    title: 'HSK Level 1',
    mmDesc: 'အသုံးအများဆုံး စကားလုံးများနှင့် သဒ္ဒါ',
    // 【修复图片】替换成了稳定的图片链接
    bgImg: 'https://picsum.photos/seed/hsk/600/400',
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

  useEffect(() => {
    if (typeof window === 'undefined') return
    const onPopState = () => setActiveOverlay(null)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  },[])

  const isTranslatorOpen = activeOverlay === 'translator'
  const isAiTutorOpen = activeOverlay === 'ai-tutor'

  useEffect(() => {
    if (typeof document === 'undefined') return
    const prev = document.body.style.overflow
    if (isTranslatorOpen || isAiTutorOpen) document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  },[isTranslatorOpen, isAiTutorOpen])

  if (isTranslatorOpen) return <AIChatDrawer isOpen={true} onClose={closeOverlay} />
  if (isAiTutorOpen) return <VoiceChat isOpen={true} onClose={closeOverlay} />

  const glassCard = 'bg-white/70 backdrop-blur-md border border-white shadow-sm rounded-2xl transition-all active:scale-95 cursor-pointer'

  return (
    <main className='relative min-h-[100dvh] overflow-x-hidden text-slate-900'>
      <div className='fixed inset-0 -z-30 bg-cover bg-center' style={{ backgroundImage: "url('/images/home-bg.jpg')" }} />
      <div className='fixed inset-0 -z-20 bg-white/40 backdrop-blur-[2px]' />

      <AnimatePresence>
        {activeOverlay === 'menu' && (
          <div className='fixed inset-0 z-[160] flex'>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeOverlay} className='absolute inset-0 bg-slate-900/40 backdrop-blur-sm' />
            <motion.aside
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              drag='x' dragConstraints={{ left: 0, right: 0 }} dragElastic={{ left: 0.5, right: 0 }}
              onDragEnd={(e, info) => { if (info.offset.x < -80 || info.velocity.x < -400) closeOverlay() }}
              className='relative w-72 h-full bg-white shadow-2xl flex flex-col'
            >
              <div className='p-6 border-b border-slate-100 flex items-center justify-between'>
                <div><h2 className='text-xl font-black text-slate-900'>菜单</h2><p className='text-xs text-slate-500'>中缅学习中心</p></div>
                <button onClick={closeOverlay} className='p-2 bg-slate-100 rounded-full active:scale-90 transition-transform'><X size={20} className='text-slate-800' /></button>
              </div>
              <nav className='p-4 space-y-2'>
                {['首页', 'HSK 课程', 'AI 翻译', '书籍库', '设置'].map(item => <button key={item} className='w-full text-left p-4 text-slate-800 font-bold hover:bg-slate-50 rounded-xl transition-colors'>{item}</button>)}
              </nav>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      <div className='relative z-10 mx-auto w-full max-w-md px-4 pb-36 pt-6'>
        <header className='mb-8 flex items-center gap-4'>
          <button onClick={() => openOverlay('menu')} className='p-1.5 active:scale-90 transition-transform'>
            <Menu className='h-7 w-7 text-slate-800' />
          </button>
          <div>
            <h1 className='text-xl font-black text-slate-900 leading-none'>中缅文学习中心</h1>
            <div className='mt-1.5 flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest'>
              <Sparkles size={12} className='text-blue-500' /><span>Premium Hub</span>
            </div>
          </div>
        </header>

        <section className='grid grid-cols-4 gap-3'>
          {pinyinNav.map(item => (
            <Link key={item.zh} href={item.href} className={`${glassCard} flex flex-col items-center py-4`}>
              <div className={`flex h-9 w-9 items-center justify-center rounded-full ${item.bg} mb-2`}><item.icon className={`h-4 w-4 ${item.color}`} /></div>
              <p className='text-[13px] font-black text-slate-800'>{item.zh}</p>
              <p className='text-[9px] font-medium text-slate-400 mt-0.5'>{item.mm}</p>
            </Link>
          ))}
        </section>

        <section className='mt-4 grid grid-cols-2 gap-3'>
          {coreTools.map(tool => {
            const content = (
              <div className='flex items-center gap-3'>
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tool.bg} ${tool.iconColor}`}><tool.icon size={20} /></div>
                <div className='min-w-0'><p className='truncate text-[13px] font-black text-slate-800'>{tool.zh}</p><p className='truncate text-[9px] text-slate-400'>{tool.mm}</p></div>
              </div>
            )
            return tool.action ? <button key={tool.zh} onClick={() => openOverlay(tool.action)} className={`${glassCard} p-3.5 text-left`}>{content}</button> : <Link key={tool.zh} href={tool.href} className={`${glassCard} p-3.5`}>{content}</Link>
          })}
        </section>

        <section className='mt-4'>
          <Link href='/tips' className={`${glassCard} flex items-center justify-between p-4`}>
            <div className='flex items-center gap-4'>
              <div className='rounded-xl bg-orange-100 p-2 text-orange-600'><Lightbulb size={20} /></div>
              <div><p className='text-[14px] font-black text-slate-800'>发音技巧 (Tips)</p><p className='text-[10px] text-slate-400'>အသံထွက်နည်းလမ်းများ</p></div>
            </div>
            <ChevronRight className='h-5 w-5 text-slate-300' />
          </Link>
        </section>

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
                  <span className='w-fit rounded-lg bg-white/20 backdrop-blur-md px-2 py-0.5 text-[9px] font-black text-white mb-2 uppercase'>{course.badge}</span>
                  <h3 className='text-2xl font-black text-white'>{course.title}</h3>
                  <p className='text-xs font-medium text-white/80 mt-1'>{course.mmDesc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className='mt-4 mb-2'>
          <button 
            onClick={() => openOverlay('ai-tutor')} 
            className='group relative w-full h-[140px] overflow-hidden rounded-[2.5rem] shadow-xl text-left transition-all active:scale-95 border border-white/50'
          >
            {/* 【修复图片】替换成了稳定的图片链接 */}
            <img src="https://picsum.photos/seed/ai/600/300" className='absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105' />
            <div className='absolute inset-0 bg-gradient-to-r from-slate-900/80 to-slate-900/20' />
            
            <div className='relative z-10 flex h-full flex-col justify-center px-6'>
              <div className='mb-2 flex items-center gap-1.5'>
                <span className='rounded-full bg-pink-500 px-2.5 py-0.5 text-[10px] font-black tracking-wider text-white shadow-sm'>
                  AI TUTOR
                </span>
                <Sparkles size={14} className='text-pink-300 animate-pulse' />
              </div>
              <h3 className='text-xl font-black text-white drop-shadow-md'>AI 真人私教对练</h3>
              <p className='mt-1 text-xs font-medium text-white/80 drop-shadow-sm'>沉浸式真实口语对话</p>
            </div>
          </button>
        </section>
      </div>

      <nav className='fixed bottom-0 left-0 right-0 z-[50] bg-white border-t border-slate-100 px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+10px)] shadow-[0_-10px_20px_rgba(0,0,0,0.05)]'>
        <div className='flex items-center justify-between'>
          <FooterItem icon={MessageCircle} label='消息' />
          <FooterItem icon={Globe2} label='社区' />
          <FooterItem icon={Users} label='语伴' />
          <FooterItem icon={Compass} label='动态' />
          <Link href='/' className='flex flex-col items-center gap-1 text-indigo-600'>
            <div className='bg-indigo-50 p-1.5 rounded-xl'><BookOpen size={22} /></div>
            <span className='text-[10px] font-bold'>学习</span>
          </Link>
        </div>
      </nav>

      <AnimatePresence>
        {activeOverlay === 'library' && (
          <div className='fixed inset-0 z-[150]'><BookLibrary isOpen={true} onClose={closeOverlay} /></div>
        )}
      </AnimatePresence>
    </main>
  )
}

function FooterItem({ icon: Icon, label }) {
  return (
    <div className='flex flex-col items-center gap-1 text-slate-400'>
      <Icon size={22} /><span className='text-[10px] font-bold'>{label}</span>
    </div>
  )
}

const LayoutBase = props => {
  const { children, slotTop } = props
  const { onLoading, fullWidth } = useGlobal()
  const searchModal = useRef(null)
  const router = useRouter()
  const pathname = router?.pathname || ''
  
  const isLearningRoute = pathname === '/' || pathname.startsWith('/vocabulary') || pathname.startsWith('/pinyin') || pathname.startsWith('/course')

  if (isLearningRoute) {
    return (
      <ThemeGlobalSimple.Provider value={{ searchModal }}>
        <div id='theme-simple' className={`${siteConfig('FONT_STYLE')} min-h-screen`}><Style />{children}</div>
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
            <div id='right-sidebar' className='hidden xl:block flex-none sticky top-8 w-96 border-l border-gray-100 pl-12'><SideBar {...props} /></div>
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
  <><BlogPostBar {...props} />{siteConfig('POST_LIST_STYLE') === 'page' ? <BlogListPage {...props} /> : <BlogListScroll {...props} />}</>
)
const LayoutSearch = props => {
  const { keyword } = props
  useEffect(() => {
    if (isBrowser) replaceSearchResult({ doms: document.getElementById('posts-wrapper'), search: keyword, target: { element: 'span', className: 'text-red-500' } })
  },[keyword])
  return <LayoutPostList {...props} slotTop={siteConfig('ALGOLIA_APP_ID') ? null : <SearchInput {...props} />} />
}

const LayoutArchive = props => (
  <div className='mb-10 pb-20 md:py-12 p-3 min-h-screen w-full'>
    {Object.keys(props.archivePosts).map(archiveTitle => <BlogArchiveItem key={archiveTitle} archiveTitle={archiveTitle} archivePosts={props.archivePosts} />)}
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
          {post?.type === 'Post' && (<><ArticleAround prev={prev} next={next} /><RecommendPosts recommendPosts={recommendPosts} /></>)}
          <Comment frontMatter={post} />
        </div>
      )}
    </>
  )
}

const Layout404 = props => <>404 Not found.</>

// ==========================================
// 【大改造】分类页面 (LayoutCategoryIndex)
// ==========================================

// 用于控制单个大分类折叠状态的内部组件
const AccordionCategoryItem = ({ group }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className='mb-6 overflow-hidden rounded-[2rem] bg-white shadow-xl border border-slate-100'>
      {/* 1. 大分类头部：带背景图 */}
      <div 
        onClick={() => setIsOpen(!isOpen)} 
        className='relative h-36 w-full cursor-pointer overflow-hidden group'
      >
        <img 
          src={group.bgImg} 
          alt={group.mainCategory} 
          className='absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105' 
        />
        <div className='absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent' />
        
        <div className='absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between'>
          <div>
            <h2 className='text-2xl font-black text-white drop-shadow-md'>{group.mainCategory}</h2>
            <p className='text-sm text-slate-200 mt-1 font-medium'>{group.subs.length} 个子分类</p>
          </div>
          <div className='bg-white/20 backdrop-blur-md p-2 rounded-full text-white transition-transform duration-300' style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            <ChevronDown size={20} />
          </div>
        </div>
      </div>

      {/* 2. 二级分类列表：折叠动画 + 左图右文 */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className='bg-slate-50'
          >
            <div className='flex flex-col gap-3 p-4'>
              {group.subs.map(sub => (
                <SmartLink 
                  key={sub.name} 
                  href={`/category/${encodeURIComponent(sub.name)}`}
                  className='flex items-center gap-4 rounded-2xl bg-white p-3 shadow-sm border border-slate-100 hover:shadow-md transition-all active:scale-[0.98]'
                >
                  {/* 左边图片 */}
                  <div className='h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-200'>
                    <img src={sub.img} alt={sub.name} className='h-full w-full object-cover' />
                  </div>
                  {/* 右边文字 */}
                  <div className='flex flex-col justify-center flex-1 min-w-0'>
                    <h3 className='text-base font-bold text-slate-800 truncate'>{sub.name}</h3>
                    <p className='text-xs text-slate-400 mt-1 flex items-center gap-1'>
                      <FileText size={12} /> 包含 {sub.count} 篇文章
                    </p>
                  </div>
                  {/* 最右侧箭头 */}
                  <ChevronRight size={18} className='text-slate-300 shrink-0 mr-1' />
                </SmartLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// 分类页面主入口
const LayoutCategoryIndex = props => {
  const { categoryOptions } = props

  // 【重要说明】：NotionNext 默认获取到的 categoryOptions 是一个扁平数组： [{name: '分类A', count: 10}, ...]
  // 为了实现你的 "大分类 -> 二级分类" 结构，我们需要在前端模拟对这些分类进行分组。
  // 在这里，我提供了一套自动分组的示例逻辑。你需要根据你自己在 Notion 里设置的分类名称来调整。
  
  // 假设你的子分类名字包含连字符，比如 "日常交流-打招呼"，"日常交流-购物"
  // 如果没有层级，下面的代码会把所有分类塞进一个叫 "默认聚合" 的大分类里。
  
  const groupedData = []
  
  if (categoryOptions && categoryOptions.length > 0) {
    // 简单的数据结构转换示例：
    const mockGroups = {
      '核心课程': {
        bgImg: 'https://picsum.photos/seed/cat1/600/300',
        subs: []
      },
      '阅读与扩展': {
        bgImg: 'https://picsum.photos/seed/cat2/600/300',
        subs: []
      }
    }

    categoryOptions.forEach((cat, index) => {
      // 随机给二级分类分配一个好看的左侧正方形图片
      const subItem = {
        name: cat.name,
        count: cat.count,
        img: `https://picsum.photos/seed/${cat.name}/150/150` // 左侧方形图片
      }

      // 简单地把前一半扔进分类1，后一半扔进分类2（真实场景请根据 cat.name 来判断属于哪个大分类）
      if (index % 2 === 0) {
        mockGroups['核心课程'].subs.push(subItem)
      } else {
        mockGroups['阅读与扩展'].subs.push(subItem)
      }
    })

    // 转换为数组渲染
    Object.keys(mockGroups).forEach(key => {
      if (mockGroups[key].subs.length > 0) {
        groupedData.push({
          mainCategory: key,
          bgImg: mockGroups[key].bgImg,
          subs: mockGroups[key].subs
        })
      }
    })
  }

  return (
    <div id='category-list' className='mx-auto w-full max-w-2xl px-4 py-8 min-h-screen'>
      <div className='mb-8'>
        <h1 className='text-3xl font-black text-slate-800'>文章分类</h1>
        <p className='text-sm text-slate-500 mt-2'>选择一个大类展开查看详细内容</p>
      </div>

      {groupedData.length > 0 ? (
        groupedData.map(group => (
          <AccordionCategoryItem key={group.mainCategory} group={group} />
        ))
      ) : (
        <div className='text-center text-slate-400 py-20'>暂无分类数据</div>
      )}
    </div>
  )
}

const LayoutTagIndex = props => (
  <div id='tags-list' className='duration-200 flex flex-wrap'>
    {props.tagOptions.map(t => (
      <div key={t.name} className='p-2'><SmartLink href={`/tag/${encodeURIComponent(t.name)}`} className={`cursor-pointer inline-block rounded hover:bg-gray-500 hover:text-white duration-200 mr-2 py-1 px-2 text-xs notion-${t.color}_background`}><div className='font-light'><i className='mr-1 fas fa-tag' /> {t.name + (t.count ? `(${t.count})` : '')} </div></SmartLink></div>
    ))}
  </div>
)

export { Layout404, LayoutArchive, LayoutBase, LayoutCategoryIndex, LayoutIndex, LayoutPostList, LayoutSearch, LayoutSlug, LayoutTagIndex, CONFIG as THEME_CONFIG }
