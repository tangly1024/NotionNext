import React, { useState, useRef, useEffect, createContext, useContext } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mic2, Music4, Layers, BookText, Lightbulb,
  Globe, Library, Star, Volume2, ChevronRight,
  Menu, X, MessageCircle, Globe2, Users, Compass, BookOpen, Sparkles
} from 'lucide-react'
import dynamic from 'next/dynamic'

// 动态导入组件
const BookLibrary = dynamic(() => import('@/components/BookLibrary'), { ssr: false })

// --- 配置数据 ---
const PINYIN_NAV = [
  { zh: '声母', mm: 'ဗျည်း', icon: Mic2, href: '/pinyin/initials', color: 'text-blue-500', bg: 'bg-blue-500/20' },
  { zh: '韵母', mm: 'သရ', icon: Music4, href: '/pinyin/finals', color: 'text-emerald-500', bg: 'bg-emerald-500/20' },
  { zh: '整体', mm: 'အသံတွဲ', icon: Layers, href: '/pinyin/syllables', color: 'text-purple-500', bg: 'bg-purple-500/20' },
  { zh: '声调', mm: 'အသံ', icon: BookText, color: 'text-amber-500', bg: 'bg-amber-500/20', href: '/pinyin/tones' }
]

const CORE_TOOLS = [
  { zh: 'AI 翻译', mm: 'AI ဘာသာပြန်', icon: Globe, href: '/ai-translate', bg: 'bg-indigo-500/20', iconColor: 'text-indigo-400' },
  { zh: '免费书籍', mm: 'စာကြည့်တိုက်', icon: Library, action: 'open-library', bg: 'bg-cyan-500/20', iconColor: 'text-cyan-400' },
  { zh: '单词收藏', mm: 'မှတ်ထားသော စာလုံး', icon: Star, href: '/words', bg: 'bg-white/10', iconColor: 'text-yellow-400' },
  { zh: '口语收藏', mm: 'မှတ်ထားသော စကားပြော', icon: Volume2, href: '/spoken?filter=favorites', bg: 'bg-white/10', iconColor: 'text-rose-400' }
]

// --- 样式常量 ---
const GLASS_STYLE = "backdrop-blur-xl bg-white/10 border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]"
const GLASS_HOVER = "hover:bg-white/20 transition-all duration-300"

export default function LayoutLearningHome() {
  const router = useRouter()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isLibraryOpen, setIsLibraryOpen] = useState(false)
  
  // 手势处理
  const touchStartRef = useRef({ x: 0, y: 0 })
  const [isEdgeSwiping, setIsEdgeSwiping] = useState(false)

  // --- 手势返回逻辑 ---
  const handleTouchStart = (e) => {
    const touch = e.touches[0]
    touchStartRef.current = { x: touch.clientX, y: touch.clientY }
    // 如果从屏幕最左侧(15px内)开始滑动，激活侧滑返回预判
    if (touch.clientX < 16) {
      setIsEdgeSwiping(true)
    }
  }

  const handleTouchEnd = (e) => {
    if (!isEdgeSwiping) return
    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - touchStartRef.current.x
    const deltaY = Math.abs(touch.clientY - touchStartRef.current.y)

    // 如果水平滑动距离超过 80px 且垂直偏移不大，执行返回
    if (deltaX > 80 && deltaY < 60) {
      if (isLibraryOpen) setIsLibraryOpen(false)
      else if (isDrawerOpen) setIsDrawerOpen(false)
      else router.back()
    }
    setIsEdgeSwiping(false)
  }

  return (
    <main 
      className="relative min-h-screen w-full text-white overflow-x-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 1. 全局背景图：固定不动 */}
      <div 
        className="fixed inset-0 -z-30 bg-cover bg-center bg-no-repeat scale-105"
        style={{ backgroundImage: "url('/images/home-bg.jpg')" }} // 请确保路径正确
      />
      {/* 2. 深色叠加层：确保文字清晰 */}
      <div className="fixed inset-0 -z-20 bg-slate-950/40 backdrop-blur-[2px]" />
      
      {/* 侧边抽屉菜单 */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            />
            <motion.aside 
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed inset-y-0 left-0 z-[70] w-72 ${GLASS_STYLE} border-r border-white/30`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-black">菜单 (Menu)</h2>
                  <X onClick={() => setIsDrawerOpen(false)} className="cursor-pointer" />
                </div>
                <nav className="space-y-4">
                  {['首页', 'HSK 课程', '设置'].map((item) => (
                    <div key={item} className="p-3 rounded-xl hover:bg-white/10 cursor-pointer font-medium">
                      {item}
                    </div>
                  ))}
                </nav>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* 主内容区 */}
      <div className="relative z-10 mx-auto max-w-md px-4 pt-6 pb-32">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDrawerOpen(true)}
              className={`p-2 rounded-full ${GLASS_STYLE} active:scale-90 transition-transform`}
            >
              <Menu size={24} />
            </button>
            <div>
              <h1 className="text-xl font-black tracking-tight leading-none">中缅文学习中心</h1>
              <div className="flex items-center gap-1.5 mt-1 text-white/70">
                <Sparkles size={12} className="text-yellow-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Premium Learning</span>
              </div>
            </div>
          </div>
          <a href="https://m.me/your-id" className={`p-2 rounded-full ${GLASS_STYLE}`}>
            <MessageCircle size={22} className="text-blue-400 fill-blue-400/20" />
          </a>
        </header>

        {/* 拼音导航 - 玻璃网格 */}
        <section className="grid grid-cols-4 gap-3 mb-6">
          {PINYIN_NAV.map((item, idx) => (
            <Link href={item.href} key={idx}>
              <motion.div 
                whileTap={{ scale: 0.95 }}
                className={`${GLASS_STYLE} ${GLASS_HOVER} flex flex-col items-center py-4 rounded-2xl`}
              >
                <div className={`p-2 rounded-full ${item.bg} mb-2`}>
                  <item.icon size={18} className={item.color} />
                </div>
                <span className="text-xs font-bold">{item.zh}</span>
                <span className="text-[9px] opacity-60 mt-0.5">{item.mm}</span>
              </motion.div>
            </Link>
          ))}
        </section>

        {/* 发音技巧提示条 */}
        <Link href="/pinyin/tips">
          <motion.div 
            whileTap={{ scale: 0.98 }}
            className={`${GLASS_STYLE} ${GLASS_HOVER} flex items-center justify-between p-4 rounded-2xl mb-6`}
          >
            <div className="flex items-center gap-4">
              <div className="bg-orange-500/20 p-2 rounded-xl">
                <Lightbulb size={20} className="text-orange-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">发音技巧 (Pronunciation Tips)</p>
                <p className="text-[10px] text-white/50">အသံထွက်နည်းလမ်းများ</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-white/30" />
          </motion.div>
        </Link>

        {/* 核心工具 - AI 翻译 & 免费书籍 */}
        <section className="grid grid-cols-2 gap-3 mb-8">
          {CORE_TOOLS.map((tool, idx) => {
            const content = (
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${tool.bg}`}>
                  <tool.icon size={20} className={tool.iconColor} />
                </div>
                <div className="text-left">
                  <p className="text-[13px] font-black">{tool.zh}</p>
                  <p className="text-[9px] text-white/50">{tool.mm}</p>
                </div>
              </div>
            )

            const className = `${GLASS_STYLE} ${GLASS_HOVER} p-3.5 rounded-2xl w-full`

            if (tool.action === 'open-library') {
              return (
                <button key={idx} onClick={() => setIsLibraryOpen(true)} className={className}>
                  {content}
                </button>
              )
            }
            return (
              <Link href={tool.href} key={idx}>
                <a className={className}>{content}</a>
              </Link>
            )
          })}
        </section>

        {/* 系统课程 - 大图卡片 */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <BookOpen size={16} className="text-white/60" />
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white/60">System Courses</h2>
          </div>

          {[
            { 
              title: 'HSK 1 入门课程', 
              mm: 'အခြေခံ တရုတ်စာ', 
              img: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
              tag: 'Beginner',
              href: '/course/hsk1'
            },
            { 
              title: '地道口语特训', 
              mm: 'စကားပြော လေ့ကျင့်ခန်း', 
              img: 'https://images.unsplash.com/photo-1528712306091-ed0763094c98?w=800',
              tag: 'Speaking',
              href: '/course/oral'
            }
          ].map((course, idx) => (
            <Link href={course.href} key={idx}>
              <motion.div 
                whileTap={{ scale: 0.97 }}
                className="relative h-44 w-full rounded-[2rem] overflow-hidden border border-white/20 shadow-xl group"
              >
                <img src={course.img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute bottom-5 left-6">
                  <span className="px-2 py-0.5 bg-white/20 backdrop-blur-md rounded-md text-[9px] font-black mb-2 inline-block">
                    {course.tag}
                  </span>
                  <h3 className="text-xl font-black text-white">{course.title}</h3>
                  <p className="text-xs text-white/70 font-medium">{course.mm}</p>
                </div>
                <div className="absolute top-1/2 right-6 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                  <ChevronRight />
                </div>
              </motion.div>
            </Link>
          ))}
        </section>
      </div>

      {/* 底部导航栏 - 固定 */}
      <nav className={`fixed bottom-0 left-0 right-0 z-50 ${GLASS_STYLE} border-t border-white/10 px-6 py-3 rounded-t-[2.5rem] flex items-center justify-between pb-[calc(1.5rem+env(safe-area-inset-bottom))]`}>
        <FooterItem icon={MessageCircle} label="消息" />
        <FooterItem icon={Globe2} label="社区" />
        <FooterItem icon={Users} label="语伴" />
        <FooterItem icon={Compass} label="动态" />
        <FooterItem icon={BookOpen} label="学习" active />
      </nav>

      {/* 弹窗组件 */}
      <BookLibrary isOpen={isLibraryOpen} onClose={() => setIsLibraryOpen(false)} />
    </main>
  )
}

function FooterItem({ icon: Icon, label, active = false }) {
  return (
    <div className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-blue-400 scale-110' : 'text-white/50'}`}>
      <div className={active ? 'bg-blue-400/20 p-2 rounded-xl' : ''}>
        <Icon size={20} fill={active ? "currentColor" : "none"} />
      </div>
      <span className="text-[10px] font-bold">{label}</span>
    </div>
  )
}
