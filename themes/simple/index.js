'use client';

import { AdSlot } from '@/components/GoogleAdsense';
import replaceSearchResult from '@/components/Mark';
import NotionPage from '@/components/NotionPage';
import { siteConfig } from '@/lib/config';
import { useGlobal } from '@/lib/global';
import { isBrowser } from '@/lib/utils';
import { Transition } from '@headlessui/react';
import dynamic from 'next/dynamic';
import SmartLink from '@/components/SmartLink';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
} from 'lucide-react';
import BlogPostBar from './components/BlogPostBar';
import CONFIG from './config';
import { Style } from './style';

// --- 动态导入组件 ---
const AlgoliaSearchModal = dynamic(() => import('@/components/AlgoliaSearchModal'), { ssr: false, loading: () => <div className="p-4 text-center text-slate-500">加载中...</div> });
const BookLibrary = dynamic(() => import('@/components/BookLibrary'), { ssr: false, loading: () => <div className="p-4 text-center text-slate-500">加载中...</div> });
const AIChatDrawer = dynamic(() => import('@/components/AIChatDrawer'), { ssr: false, loading: () => <div className="p-4 text-center text-slate-500">加载中...</div> });
const VoiceChat = dynamic(() => import('@/components/VoiceChat'), { ssr: false, loading: () => <div className="p-4 text-center text-slate-500">加载中...</div> });

const BlogListScroll = dynamic(() => import('./components/BlogListScroll'), { ssr: false });
const BlogArchiveItem = dynamic(() => import('./components/BlogArchiveItem'), { ssr: false });
const ArticleLock = dynamic(() => import('./components/ArticleLock'), { ssr: false });
const ArticleInfo = dynamic(() => import('./components/ArticleInfo'), { ssr: false });
const Comment = dynamic(() => import('@/components/Comment'), { ssr: false });
const ArticleAround = dynamic(() => import('./components/ArticleAround'), { ssr: false });
const ShareBar = dynamic(() => import('./components/ShareBar'), { ssr: false });
const TopBar = dynamic(() => import('./components/TopBar'), { ssr: false });
const Header = dynamic(() => import('./components/Header'), { ssr: false });
const NavBar = dynamic(() => import('./components/NavBar'), { ssr: false });
const SideBar = dynamic(() => import('./components/SideBar'), { ssr: false });
const JumpToTopButton = dynamic(() => import('./components/JumpToTopButton'), { ssr: false });
const Footer = dynamic(() => import('./components/Footer'), { ssr: false });
const SearchInput = dynamic(() => import('./components/SearchInput'), { ssr: false });
const WWAds = dynamic(() => import('@/components/WWAds'), { ssr: false });
const BlogListPage = dynamic(() => import('./components/BlogListPage'), { ssr: false });
const RecommendPosts = dynamic(() => import('./components/RecommendPosts'), { ssr: false });

const ThemeGlobalSimple = createContext();
export const useSimpleGlobal = () => useContext(ThemeGlobalSimple);

const pinyinNav = [
  { zh: '声母', mm: 'ဗျည်း', icon: Mic, href: '/pinyin/initials', bg: 'bg-blue-100/90', color: 'text-blue-700' },
  { zh: '韵母', mm: 'သရ', icon: Music2, href: '/pinyin/finals', bg: 'bg-emerald-100/90', color: 'text-emerald-700' },
  { zh: '整体', mm: 'အသံတွဲ', icon: Layers3, href: '/pinyin/whole', bg: 'bg-purple-100/90', color: 'text-purple-700' },
  { zh: '声调', mm: 'အသံ', icon: FileText, href: '/pinyin/tones', bg: 'bg-orange-100/90', color: 'text-orange-700' }
];

const coreTools = [
  { zh: 'AI 翻译', mm: 'AI ဘာသာပြန်', icon: Globe, action: 'translator', bg: 'bg-indigo-50', iconColor: 'text-indigo-600' },
  { zh: '免费书籍', mm: 'စာကြည့်တိုက်', icon: Library, action: 'library', bg: 'bg-cyan-50', iconColor: 'text-cyan-600' },
  { zh: '单词收藏', mm: 'မှတ်ထားသော စာလုံး', icon: Star, href: '/words', bg: 'bg-slate-50', iconColor: 'text-slate-700' },
  { zh: '口语收藏', mm: 'မှတ်ထားသော စကားပြော', icon: Volume2, href: '/oral', bg: 'bg-slate-50', iconColor: 'text-slate-700' }
];

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
];

// ================== LayoutLearningHome ==================
const LayoutLearningHome = () => {
  const router = useRouter();
  const [activeOverlay, setActiveOverlay] = useState(null);

  const openOverlay = useCallback((overlayType) => {
    setActiveOverlay((prev) => {
      if (prev === overlayType) return prev;
      if (typeof window !== 'undefined') {
        window.history.pushState({ overlay: overlayType }, '', window.location.href);
      }
      return overlayType;
    });
  }, []);

  const closeOverlay = useCallback(() => {
    if (activeOverlay && typeof window !== 'undefined') {
      window.history.back();
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

  const isTranslatorOpen = activeOverlay === 'translator';
  const isAiTutorOpen = activeOverlay === 'ai-tutor';

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const prev = document.body.style.overflow;
    if (isTranslatorOpen || isAiTutorOpen) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [isTranslatorOpen, isAiTutorOpen]);

  if (isTranslatorOpen) return <AIChatDrawer isOpen={true} onClose={closeOverlay} />;
  if (isAiTutorOpen) return <VoiceChat isOpen={true} onClose={closeOverlay} />;

  const glassCard = 'bg-white/95 backdrop-blur-xl border border-white/60 shadow-lg shadow-slate-200/50 rounded-2xl transition-all active:scale-95 cursor-pointer hover:shadow-xl hover:shadow-slate-300/60';

  return (
    <main className='relative min-h-[100dvh] overflow-x-hidden text-slate-900'>
      {/* 背景层 */}
      <div className='fixed inset-0 -z-30'>
        <img src='/images/home-bg.jpg' alt='' aria-hidden='true' className='h-full w-full object-cover' />
        <div className='absolute inset-0 bg-white/50 backdrop-blur-2xl' />
        <div className='absolute inset-0 bg-gradient-to-b from-white/20 via-white/10 to-white/30' />
      </div>

      {/* 主体内容略，保留你的拼音导航、核心工具、系统课程等 */}
      {/* ... 保留原 LayoutLearningHome 内容 ... */}

      {/* 底部导航 */}
      <nav className='fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-100 px-4 py-2 shadow-[0_-10px_20px_rgba(0,0,0,0.08)]'>
        <div className='flex items-center justify-around'>
          <FooterItem icon={MessageCircle} label='消息' />
          <FooterItem icon={Globe2} label='社区' />
          <FooterItem icon={Users} label='语伴' />
          <FooterItem icon={Compass} label='动态' />
          <FooterItem icon={BookOpen} label='学习' />
        </div>
      </nav>
    </main>
  );
};

// ================== FooterItem ==================
function FooterItem({ icon: Icon, label }) {
  return (
    <div className='flex flex-col items-center gap-0.5 text-slate-500 active:scale-90 transition-all text-[10px]'>
      <Icon size={20} />
      <span className='font-bold'>{label}</span>
    </div>
  );
}

// ================== LayoutBase ==================
const LayoutBase = props => {
  const { children, slotTop } = props;
  const { onLoading, fullWidth } = useGlobal();
  const searchModal = useRef(null);
  const router = useRouter();
  const pathname = router?.pathname || '';

  const isLearningRoute =
    pathname === '/' ||
    pathname.startsWith('/vocabulary') ||
    pathname.startsWith('/pinyin') ||
    pathname.startsWith('/course') ||
    pathname.startsWith('/oral') ||
    pathname.startsWith('/learn');

  if (isLearningRoute) {
    return (
      <ThemeGlobalSimple.Provider value={{ searchModal }}>
        <div id='theme-simple' className={`${siteConfig('FONT_STYLE')} min-h-screen`}>
          <Style />
          {children}
        </div>
      </ThemeGlobalSimple.Provider>
    );
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
  );
};

// ================== 其他 Layout ==================
const LayoutIndex = props => <LayoutLearningHome {...props} />;

const LayoutPostList = props => (
  <>
    <BlogPostBar {...props} />
    {siteConfig('POST_LIST_STYLE') === 'page'
      ? <BlogListPage {...props} />
      : <BlogListScroll {...props} />}
  </>
);

const LayoutSearch = props => {
  const { keyword } = props;
  useEffect(() => {
    if (isBrowser) {
      replaceSearchResult({
        doms: document.getElementById('posts-wrapper'),
        search: keyword,
        target: { element: 'span', className: 'text-red-500' }
      });
    }
  }, [keyword]);
  return <LayoutPostList {...props} slotTop={siteConfig('ALGOLIA_APP_ID') ? null : <SearchInput {...props} />} />;
};

const LayoutArchive = props => (
  <div className='mb-10 pb-20 md:py-12 p-3 min-h-screen w-full'>
    {Object.keys(props.archivePosts).map(archiveTitle => (
      <BlogArchiveItem key={archiveTitle} archiveTitle={archiveTitle} archivePosts={props.archivePosts} />
    ))}
  </div>
);

const LayoutSlug = props => {
  const { post, lock, validPassword, prev, next, recommendPosts } = props;
  const { fullWidth } = useGlobal();
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
  );
};

const Layout404 = props => <>404 Not found.</>;

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
);

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
);

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
};
