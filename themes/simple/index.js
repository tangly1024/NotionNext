import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mic2, Music4, Layers, BookText, Lightbulb,
  Globe, Library, Star, Volume2, ChevronRight,
  Menu, X, MessageCircle, Globe2, Users, Compass, BookOpen
} from 'lucide-react'
import dynamic from 'next/dynamic'

// 动态组件
const BookLibrary = dynamic(() => import('@/components/BookLibrary'), { ssr: false })

// --- 配置数据 (浅色调) ---
const PINYIN_NAV = [
  { zh: '声母', mm: 'ဗျည်း', icon: Mic2, href: '/pinyin/initials', color: 'text-blue-600', bg: 'bg-blue-100/80' },
  { zh: '韵母', mm: 'သရ', icon: Music4, href: '/pinyin/finals', color: 'text-emerald-600', bg: 'bg-emerald-100/80' },
  { zh: '整体', mm: 'အသံတွဲ', icon: Layers, href: '/pinyin/syllables', color: 'text-purple-600', bg: 'bg-purple-100/80' },
  { zh: '声调', mm: 'အသံ', icon: BookText, color: 'text-amber-600', bg: 'bg-amber-100/80', href: '/pinyin/tones' }
]

const CORE_TOOLS = [
  { zh: 'AI 翻译', mm: 'AI ဘာသာပြန်', icon: Globe, href: '/ai-translate', bg: 'bg-indigo-50', iconColor: 'text-indigo-600' },
  { zh: '免费书籍', mm: 'စာကြည့်တိုက်', icon: Library, action: 'open-library', bg: 'bg-cyan-50', iconColor: 'text-cyan-600' },
  { zh: '单词收藏', mm: 'မှတ်ထားသော စာလုံး', icon: Star, href: '/words', bg: 'bg-slate-50', iconColor: 'text-slate-600' },
  { zh: '口语收藏', mm: 'မှတ်ထားသော စကားပြော', icon: Volume2, href: '/oral', bg: 'bg-slate-50', iconColor: 'text-slate-600' }
]

export default function LayoutLearningHome() {
  const router = useRouter()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isLibraryOpen, setIsLibraryOpen] = useState(false)
  
  // --- 手势控制系统 ---
  const touchStartPos = useRef({ x: 0, y: 0 })
  const isEdgeSwipe = useRef(false)

  const onTouchStart = (e) => {
    const x = e.touches[0].clientX
    const y = e.touches[0].clientY
    touchStartPos.current = { x, y }
    // 判定是否从屏幕左侧边缘开始滑动 (25px 阈值)
    isEdgeSwipe.current = x < 25 
  }

  const onTouchEnd = (e) => {
    if (!isEdgeSwipe.current) return
    const deltaX = e.changedTouches[0].clientX - touchStartPos.current.x
    const deltaY = Math.abs(e.changedTouches[0].clientY - touchStartPos.current.y)

    // 如果滑动距离超过 85px 且非剧烈上下滑动
    if (deltaX > 85 && deltaY < 50) {
      if (isLibraryOpen) {
        setIsLibraryOpen(false) // 1. 优先关闭弹窗
      } else if (isDrawerOpen) {
        setIsDrawerOpen(false)  // 2. 其次关闭侧栏
      } else {
        router.back()           // 3. 最后返回上一页
      }
    }
    isEdgeSwipe.current = false
  }

  return (
    <main 
      className="relative min-h-screen w-full overflow-x-hidden text-slate-900"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* 1. 全局背景：透明磨砂感 */}
      <div 
        className="fixed inset-0 -z-30 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/home-bg.jpg')" }}
      />
      <div className="fixed inset-0 -z-20 bg-white/40 backdrop-blur-md" />

      {/* 2. 侧边栏 (Drawer) - 深色文字以便看清 */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm"
            />
            <motion.aside 
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 240 }}
              className="fixed inset-y-0 left-0 z-[70] w-72 bg-white/95 shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900">学习中心</h2>
                  <p className="text-xs text-slate-500">Learning Center</p>
                </div>
                <button onClick={() => setIsDrawerOpen(false)} className="p-2 bg-slate-100 rounded-full">
                  <X size={20} className="text-slate-600" />
                </button>
              </div>
              <nav className="p-4 space-y-2">
                {['首页', 'HSK 课程', 'AI 翻译', '系统设置'].map((item) => (
                  <button key={item} className="w-full text-left p-4 rounded-xl hover:bg-slate-100 text-slate-800 font-bold transition-colors">
                    {item}
                  </button>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* 3. 主页面内容 */}
      <div className="relative z-10 mx-auto max-w-md px-4 pt-6 pb-36">
        
        {/* Header - 保持简约 */}
        <header className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="p-2.5 bg-white/80 rounded-2xl shadow-sm border border-white"
          >
            <Menu size={24} className="text-slate-800" />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-900">中缅文学习</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Chinese - Myanmar Hub</p>
          </div>
        </header>

        {/* 拼音网格 - 浅色系 */}
        <section className="grid grid-cols-4 gap-3 mb-6">
          {PINYIN_NAV.map((item, idx) => (
            <Link href={item.href} key={idx}>
              <motion.div 
                whileTap={{ scale: 0.95 }}
                className="bg-white/70 backdrop-blur-sm border border-white p-3 rounded-2xl flex flex-col items-center shadow-sm"
              >
                <div className={`${item.bg} p-2 rounded-full mb-2`}>
                  <item.icon size={18} className={item.color} />
                </div>
                <span className="text-xs font-black text-slate-800">{item.zh}</span>
                <span className="text-[9px] text-slate-400 font-medium mt-0.5">{item.mm}</span>
              </motion.div>
            </Link>
          ))}
        </section>

        {/* 发音技巧 - 长卡片 */}
        <Link href="/pinyin/tips">
          <motion.div 
            whileTap={{ scale: 0.98 }}
            className="bg-white/70 backdrop-blur-sm border border-white p-4 rounded-2xl mb-6 flex items-center justify-between shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 p-2 rounded-xl text-orange-600">
                <Lightbulb size={20} />
              </div>
              <div>
                <p className="text-sm font-black text-slate-800">发音技巧 (Tips)</p>
                <p className="text-[10px] text-slate-400">အသံထွက်နည်းလမ်းများ</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-300" />
          </motion.div>
        </Link>

        {/* 核心工具 - AI 翻译 & 免费书籍 */}
        <section className="grid grid-cols-2 gap-3 mb-8">
          {CORE_TOOLS.map((tool, idx) => {
            const content = (
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${tool.bg} ${tool.iconColor}`}>
                  <tool.icon size={20} />
                </div>
                <div className="text-left overflow-hidden">
                  <p className="text-[13px] font-black text-slate-800 truncate">{tool.zh}</p>
                  <p className="text-[9px] text-slate-400 truncate">{tool.mm}</p>
                </div>
              </div>
            )

            const cardStyle = "bg-white/70 backdrop-blur-sm border border-white p-3.5 rounded-2xl w-full shadow-sm"

            if (tool.action === 'open-library') {
              return (
                <button key={idx} onClick={() => setIsLibraryOpen(true)} className={cardStyle}>
                  {content}
                </button>
              )
            }
            return (
              <Link href={tool.href} key={idx}>
                <a className={cardStyle}>{content}</a>
              </Link>
            )
          })}
        </section>

        {/* 课程列表 */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <BookOpen size={14} className="text-slate-400" />
            <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-400">System Courses</h2>
          </div>

          {[
            { 
              title: 'HSK 1 入门', 
              sub: 'အခြေခံ တရုတ်စာ', 
              img: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
              href: '/course/hsk1',
              color: 'from-blue-600/90'
            },
            { 
              title: '日常口语练习', 
              sub: 'စကားပြော လေ့ကျင့်ခန်း', 
              img: 'https://images.unsplash.com/photo-1528712306091-ed0763094c98?w=800',
              href: '/course/oral',
              color: 'from-emerald-600/90'
            }
          ].map((course, idx) => (
            <Link href={course.href} key={idx}>
              <motion.div 
                whileTap={{ scale: 0.97 }}
                className="relative h-36 w-full rounded-3xl overflow-hidden shadow-md group"
              >
                <img src={course.img} className="absolute inset-0 w-full h-full object-cover" />
                <div className={`absolute inset-0 bg-gradient-to-r ${course.color} to-transparent`} />
                <div className="absolute inset-y-0 left-0 flex flex-col justify-center px-6">
                  <h3 className="text-xl font-black text-white">{course.title}</h3>
                  <p className="text-white/80 text-xs font-medium">{course.sub}</p>
                  <div className="mt-3 flex items-center gap-1 text-[10px] font-bold text-white bg-white/20 w-fit px-2 py-0.5 rounded-md backdrop-blur-sm">
                    立即学习 <ChevronRight size={10} />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </section>
      </div>

      {/* 4. 底部导航栏 (实色白，增强文字显示) */}
      <nav className="fixed bottom-0 left-0 right-0 z-[50] bg-white border-t border-slate-100 flex items-center justify-around px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+10px)] shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        <FooterItem icon={MessageCircle} label="消息" />
        <FooterItem icon={Globe2} label="社区" />
        <FooterItem icon={Users} label="语伴" />
        <FooterItem icon={Compass} label="动态" />
        <FooterItem icon={BookOpen} label="学习" active />
      </nav>

      {/* 弹窗 */}
      <BookLibrary isOpen={isLibraryOpen} onClose={() => setIsLibraryOpen(false)} />
    </main>
  )
}

function FooterItem({ icon: Icon, label, active = false }) {
  return (
    <div className={`flex flex-col items-center gap-1 ${active ? 'text-indigo-600' : 'text-slate-400'}`}>
      <div className={active ? 'bg-indigo-50 p-1.5 rounded-xl' : ''}>
        <Icon size={22} strokeWidth={active ? 2.5 : 2} />
      </div>
      <span className="text-[10px] font-bold">{label}</span>
    </div>
  )
}
