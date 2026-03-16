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
const ShareBar = dynamic(() => import('@/components/ShareBar'), { ssr: false });
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

// ----------------- 数据配置 -----------------
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

// ----------------- LayoutLearningHome -----------------
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
    return () => {
      document.body.style.overflow = prev;
    };
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

      {/* 左侧菜单和内容省略… */}
      {/* …原 LayoutLearningHome 内容保持不变，只修改底部导航 */}

      {/* 底部导航优化 */}
      <nav className='fixed bottom-0 left-0 right-0 z-[50] bg-white/95 backdrop-blur-xl border-t border-slate-100 px-2 pt-2 pb-[calc(env(safe-area-inset-bottom)+6px)] shadow-[0_-4px_10px_rgba(0,0,0,0.05)]'>
        <div className='flex justify-around items-center'>
          <FooterItem icon={MessageCircle} label='消息' />
          <FooterItem icon={Globe2} label='社区' />
          <FooterItem icon={Users} label='语伴' />
          <FooterItem icon={Compass} label='动态' />
          <Link href='/' className='flex flex-col items-center gap-1 text-indigo-600 active:scale-90 transition-transform'>
            <div className='bg-indigo-50 p-1.5 rounded-xl border border-indigo-100'>
              <BookOpen size={22} />
            </div>
            <span className='text-[9px] font-bold'>学习</span>
          </Link>
        </div>
      </nav>

    </main>
  );
};

// ----------------- FooterItem -----------------
function FooterItem({ icon: Icon, label }) {
  return (
    <div className='flex flex-col items-center gap-0.5 text-slate-500 active:scale-90 transition-all'>
      <Icon size={20} />
      <span className='text-[9px] font-bold'>{label}</span>
    </div>
  );
}

export default LayoutLearningHome;
