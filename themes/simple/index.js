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

// --- 动态组件 ---
const AlgoliaSearchModal = dynamic(() => import('@/components/AlgoliaSearchModal'), { ssr: false });
const BookLibrary = dynamic(() => import('@/components/BookLibrary'), { ssr: false });
const AIChatDrawer = dynamic(() => import('@/components/AIChatDrawer'), { ssr: false });
const VoiceChat = dynamic(() => import('@/components/VoiceChat'), { ssr: false });
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

// ================== 数据 ==================
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
  { badge: 'Words', sub: '词汇 (VOCABULARY)', title: '日常高频词汇', mmDesc: 'အခြေခံ စကားလုံးများကို လေ့လာပါ။', bgImg: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=1200', href: '/vocabulary', color: 'from-blue-600/90' },
  { badge: 'Oral', sub: '短句 (ORAL)', title: '场景口语短句', mmDesc: 'အခြေအနေလိုက် စကားပြော လေ့ကျင့်မှု', bgImg: 'https://images.unsplash.com/photo-1528712306091-ed0763094c98?auto=format&fit=crop&q=80&w=1200', href: '/oral', color: 'from-emerald-600/90' },
  { badge: 'HSK 1', sub: '入门 (INTRO)', title: 'HSK Level 1', mmDesc: 'အသုံးအများဆုံး စကားလုံးများနှင့် သဒ္ဒါ', bgImg: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=1200', href: '/course/hsk1', color: 'from-indigo-600/90' }
];

// ================== FooterItem ==================
function FooterItem({ icon: Icon }) {
  return (
    <div className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 active:scale-90 transition-all">
      <Icon size={22} />
    </div>
  );
}

// ================== LayoutLearningHome ==================
const LayoutLearningHome = () => {
  const router = useRouter();
  const [activeOverlay, setActiveOverlay] = useState(null);

  const openOverlay = useCallback((overlayType) => {
    setActiveOverlay(prev => {
      if (prev === overlayType) return prev;
      if (typeof window !== 'undefined') window.history.pushState({ overlay: overlayType }, '', window.location.href);
      return overlayType;
    });
  }, []);

  const closeOverlay = useCallback(() => {
    if (activeOverlay && typeof window !== 'undefined') window.history.back();
    else setActiveOverlay(null);
  }, [activeOverlay]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onPopState = () => setActiveOverlay(null);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const prev = document.body.style.overflow;
    if (activeOverlay) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [activeOverlay]);

  const glassCard = 'bg-white/95 backdrop-blur-xl border border-white/60 shadow-lg shadow-slate-200/50 rounded-2xl transition-all active:scale-95 cursor-pointer hover:shadow-xl hover:shadow-slate-300/60';

  return (
    <main className="relative min-h-[100dvh] overflow-x-hidden text-slate-900">
      {/* 背景 */}
      <div className="fixed inset-0 -z-30">
        <img src="/images/home-bg.jpg" alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-white/50 backdrop-blur-2xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/10 to-white/30" />
      </div>

      {/* 左侧菜单 */}
      <AnimatePresence>
        {activeOverlay === 'menu' && (
          <div className="fixed inset-0 z-[160] flex">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeOverlay} className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
            <motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={{ left: 0.5, right: 0 }} onDragEnd={(e, info) => { if (info.offset.x < -80 || info.velocity.x < -400) closeOverlay() }} className="relative w-72 h-full bg-white/95 backdrop-blur-xl shadow-2xl flex flex-col border-r border-slate-100">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900">菜单</h2>
                  <p className="text-xs text-slate-500">中缅学习中心</p>
                </div>
                <button type="button" onClick={closeOverlay} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full active:scale-90 transition-colors">
                  <X size={20} className="text-slate-800" />
                </button>
              </div>
              <nav className="p-4 space-y-2">
                {['首页','HSK 课程','AI 翻译','书籍库','设置'].map(item => <button key={item} type="button" className="w-full text-left p-4 text-slate-800 font-bold hover:bg-slate-50 rounded-xl transition-colors">{item}</button>)}
              </nav>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* 主内容区域 */}
      <div className="relative z-10 mx-auto w-full max-w-md px-4 pb-28 pt-6">
        {/* 拼音导航 */}
        <section className="grid grid-cols-4 gap-3 mb-4">
          {pinyinNav.map(item => (
            <Link key={item.zh} href={item.href} className={`${glassCard} flex flex-col items-center py-4`}>
              <div className={`flex h-9 w-9 items-center justify-center rounded-full ${item.bg} mb-2`}>
                <item.icon className={`h-4 w-4 ${item.color}`} />
              </div>
              <p className="text-[13px] font-black text-slate-800">{item.zh}</p>
              <p className="text-[9px] font-medium text-slate-700 mt-0.5">{item.mm}</p>
            </Link>
          ))}
        </section>

        {/* 核心工具 */}
        <section className="grid grid-cols-2 gap-3 mb-4">
          {coreTools.map(tool => {
            const content = (
              <div className="flex items-center gap-3">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tool.bg} ${tool.iconColor}`}>
                  <tool.icon size={20} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-black text-slate-800">{tool.zh}</p>
                  <p className="truncate text-[9px] text-slate-700">{tool.mm}</p>
                </div>
              </div>
            );
            return tool.action ? (
              <button key={tool.zh} onClick={() => openOverlay(tool.action)} className={`${glassCard} p-3.5 text-left`}>{content}</button>
            ) : (
              <Link key={tool.zh} href={tool.href} className={`${glassCard} p-3.5`}>{content}</Link>
            );
          })}
        </section>

        {/* 发音技巧 */}
        <section className="mb-4">
          <Link href="/pinyin/tips" className={`${glassCard} flex items-center justify-between p-4`}>
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-orange-100 p-2 text-orange-700">
                <Lightbulb size={20} />
              </div>
              <div>
                <p className="text-[14px] font-black text-slate-800">发音技巧 (Tips)</p>
                <p className="text-[10px] text-slate-700">အသံထွက်နည်းလမ်းများ</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-400" />
          </Link>
        </section>

        {/* AI 真人私教对练 */}
        <section className="mb-4">
          <button onClick={() => openOverlay('ai-tutor')} className="group relative w-full h-[140px] overflow-hidden rounded-[2.5rem] shadow-xl text-left transition-all active:scale-95 border border-white/60">
            <img src="https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&q=80&w=1200" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 to-slate-900/25" />
            <div className="relative z-10 flex h-full flex-col justify-center px-6">
              <div className="mb-2 flex items-center gap-1.5">
                <span className="rounded-full bg-pink-500 px-2.5 py-0.5 text-[10px] font-black tracking-wider text-white shadow-sm border border-pink-400/30">AI TUTOR</span>
                <Sparkles size={14} className="text-pink-300 animate-pulse" />
              </div>
              <h3 className="text-xl font-black text-white drop-shadow-md">AI 真人私教对练</h3>
              <p className="mt-1 text-xs font-medium text-white/95 drop-shadow-sm">沉浸式真实口语对话</p>
            </div>
          </button>
        </section>

        {/* 主线闯关地图 */}
        <section className="mb-4">
          <Link href="/learn" className={`${glassCard} relative flex items-center gap-4 p-5 overflow-hidden border-l-[6px] border-l-green-500`}>
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-green-500/10 blur-2xl" />
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 text-white shadow-lg shadow-green-200 transition-transform active:scale-110">
              <Map size={26} />
            </div>
            <div className="relative flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-900 uppercase leading-tight">主线闯关地图</h3>
                <span className="rounded bg-green-500 px-1.5 py-0.5 text-[9px] font-black text-white animate-pulse">NEW</span>
              </div>
              <p className="text-[13px] font-bold text-slate-600 mt-0.5">စနစ်တကျ လေ့လာရန် လမ်းပြမြေပုံ</p>
              <div className="mt-3 flex items-center gap-2">
                <div className="h-1.5 w-full max-w-[110px] rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full w-2/5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                </div>
                <span className="text-[9px] font-black text-green-600 tracking-tighter opacity-70">CONTINUE</span>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-300 shrink-0" />
          </Link>
        </section>

        {/* 系统课程 */}
<section className="mb-4">
  {systemCourses.map(course => (
    <Link
      key={course.title}
      href={course.href}
      className={`${glassCard} relative h-40 overflow-hidden rounded-[2.5rem] shadow-lg border border-white/60 active:scale-[0.98] transition-all mb-4`}
    >
      {/* 背景图 */}
      <img
        src={course.bgImg}
        alt={course.title}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* 渐变叠加 */}
      <div className={`absolute inset-0 bg-gradient-to-r ${course.color} to-transparent`} />
      {/* 内容 */}
      <div className="relative flex h-full flex-col justify-center px-8">
        <span className="w-fit rounded-lg bg-white/25 backdrop-blur-md px-2 py-0.5 text-[9px] font-black text-white mb-2 uppercase border border-white/30">
          {course.badge}
        </span>
        <h3 className="text-2xl font-black text-white drop-shadow-md">{course.title}</h3>
        <p className="text-xs font-medium text-white/95 drop-shadow-sm mt-1">
          {course.mmDesc}
        </p>
      </div>
    </Link>
  ))}
</section>
