import React, { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mic2,
  Music4,
  Layers,
  BookText,
  Lightbulb,
  Globe,
  Library,
  Star,
  Volume2,
  ChevronRight,
  Menu,
  X,
  MessageCircle,
  Globe2,
  Users,
  Compass,
  BookOpen,
  Sparkles
} from 'lucide-react'
import dynamic from 'next/dynamic'

// 动态组件
const BookLibrary = dynamic(() => import('@/components/BookLibrary'), {
  ssr: false
})

// ==============================
// 配置数据
// ==============================
const PINYIN_NAV = [
  {
    zh: '声母',
    mm: 'ဗျည်း',
    icon: Mic2,
    href: '/pinyin/initials',
    color: 'text-blue-600',
    bg: 'bg-blue-100/80'
  },
  {
    zh: '韵母',
    mm: 'သရ',
    icon: Music4,
    href: '/pinyin/finals',
    color: 'text-emerald-600',
    bg: 'bg-emerald-100/80'
  },
  {
    zh: '整体',
    mm: 'အသံတွဲ',
    icon: Layers,
    href: '/pinyin/syllables',
    color: 'text-purple-600',
    bg: 'bg-purple-100/80'
  },
  {
    zh: '声调',
    mm: 'အသံ',
    icon: BookText,
    href: '/pinyin/tones',
    color: 'text-amber-600',
    bg: 'bg-amber-100/80'
  }
]

const CORE_TOOLS = [
  {
    zh: 'AI 翻译',
    mm: 'AI ဘာသာပြန်',
    icon: Globe,
    href: '/ai-translate',
    bg: 'bg-indigo-50',
    iconColor: 'text-indigo-600'
  },
  {
    zh: '免费书籍',
    mm: 'စာကြည့်တိုက်',
    icon: Library,
    action: 'open-library',
    bg: 'bg-cyan-50',
    iconColor: 'text-cyan-600'
  },
  {
    zh: '单词收藏',
    mm: 'မှတ်ထားသော စာလုံး',
    icon: Star,
    href: '/words',
    bg: 'bg-slate-50',
    iconColor: 'text-slate-600'
  },
  {
    zh: '口语收藏',
    mm: 'မှတ်ထားသော စကားပြော',
    icon: Volume2,
    href: '/oral?filter=favorites',
    bg: 'bg-slate-50',
    iconColor: 'text-slate-600'
  }
]

const LEARNING_COURSES = [
  {
    title: 'AI 练口语',
    sub: '智能跟读 / 即时反馈',
    img: '/images/cards/ai-speaking.jpg',
    href: '/oral/ai',
    color: 'from-fuchsia-600/85'
  },
  {
    title: '日常词汇',
    sub: '高频生活场景词汇',
    img: '/images/cards/daily-vocab.jpg',
    href: '/vocabulary',
    color: 'from-sky-600/85'
  },
  {
    title: '口语短句',
    sub: '场景表达 / 一键朗读',
    img: '/images/cards/oral-cover.jpg',
    href: '/oral',
    color: 'from-emerald-600/85'
  },
  {
    title: 'HSK 系统课程',
    sub: '等级学习 / 真题练习',
    img: '/images/cards/hsk-course.jpg',
    href: '/course/hsk1',
    color: 'from-amber-600/85'
  }
]

// ==============================
// 页面
// ==============================
export default function LayoutLearningHome() {
  const router = useRouter()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isLibraryOpen, setIsLibraryOpen] = useState(false)

  // 手势控制
  const touchStartPos = useRef({ x: 0, y: 0 })
  const isEdgeSwipe = useRef(false)

  const onTouchStart = (e) => {
    const x = e.touches[0].clientX
    const y = e.touches[0].clientY
    touchStartPos.current = { x, y }
    isEdgeSwipe.current = x < 25
  }

  const onTouchEnd = (e) => {
    if (!isEdgeSwipe.current) return

    const deltaX = e.changedTouches[0].clientX - touchStartPos.current.x
    const deltaY = Math.abs(e.changedTouches[0].clientY - touchStartPos.current.y)

    if (deltaX > 85 && deltaY < 50) {
      if (isLibraryOpen) {
        setIsLibraryOpen(false)
      } else if (isDrawerOpen) {
        setIsDrawerOpen(false)
      } else {
        router.back()
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
      {/* 固定背景图，不跟页面滚动 */}
      <div className="fixed inset-0 -z-30">
        <img
          src="/images/home-bg.jpg"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
      </div>

      {/* 固定磨砂层 */}
      <div className="fixed inset-0 -z-20 bg-white/30 backdrop-blur-md" />

      {/* 固定柔光渐变层 */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-white/10 via-white/5 to-white/60" />

      {/* 侧边栏 */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm"
            />

            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 240 }}
              className="fixed inset-y-0 left-0 z-[70] flex w-72 flex-col bg-white/95 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-100 p-6">
                <div>
                  <h2 className="text-xl font-black text-slate-900">学习中心</h2>
                  <p className="text-xs text-slate-500">Learning Center</p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="rounded-full bg-slate-100 p-2"
                >
                  <X size={20} className="text-slate-600" />
                </button>
              </div>

              <nav className="space-y-2 p-4">
                <button className="w-full rounded-xl p-4 text-left font-bold text-slate-800 transition-colors hover:bg-slate-100">
                  首页
                </button>
                <button className="w-full rounded-xl p-4 text-left font-bold text-slate-800 transition-colors hover:bg-slate-100">
                  HSK 课程
                </button>
                <button className="w-full rounded-xl p-4 text-left font-bold text-slate-800 transition-colors hover:bg-slate-100">
                  AI 翻译
                </button>
                <button className="w-full rounded-xl p-4 text-left font-bold text-slate-800 transition-colors hover:bg-slate-100">
                  系统设置
                </button>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* 主内容 */}
      <div className="relative z-10 mx-auto max-w-md px-4 pb-36 pt-6">
        {/* Header */}
        <header className="mb-8 flex items-center gap-4">
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="rounded-2xl border border-white bg-white/80 p-2.5 shadow-sm"
          >
            <Menu size={24} className="text-slate-800" />
          </button>

          <div>
            <h1 className="text-xl font-black text-slate-900">中缅文学习</h1>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Chinese - Myanmar Hub
            </p>
          </div>
        </header>

        {/* 拼音网格 */}
        <section className="mb-6 grid grid-cols-4 gap-3">
          {PINYIN_NAV.map((item, idx) => (
            <Link href={item.href} key={idx}>
              <motion.div
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center rounded-2xl border border-white bg-white/70 p-3 shadow-sm backdrop-blur-sm"
              >
                <div className={`${item.bg} mb-2 rounded-full p-2`}>
                  <item.icon size={18} className={item.color} />
                </div>
                <span className="text-xs font-black text-slate-800">{item.zh}</span>
                <span className="mt-0.5 text-[9px] font-medium text-slate-400">
                  {item.mm}
                </span>
              </motion.div>
            </Link>
          ))}
        </section>

        {/* 发音技巧 */}
        <Link href="/pinyin/tips">
          <motion.div
            whileTap={{ scale: 0.98 }}
            className="mb-6 flex items-center justify-between rounded-2xl border border-white bg-white/70 p-4 shadow-sm backdrop-blur-sm"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-orange-100 p-2 text-orange-600">
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

        {/* 核心工具 */}
        <section className="mb-8 grid grid-cols-2 gap-3">
          {CORE_TOOLS.map((tool, idx) => {
            const content = (
              <div className="flex items-center gap-3">
                <div className={`rounded-xl p-2 ${tool.bg} ${tool.iconColor}`}>
                  <tool.icon size={20} />
                </div>
                <div className="overflow-hidden text-left">
                  <p className="truncate text-[13px] font-black text-slate-800">
                    {tool.zh}
                  </p>
                  <p className="truncate text-[9px] text-slate-400">{tool.mm}</p>
                </div>
              </div>
            )

            const cardStyle =
              'w-full rounded-2xl border border-white bg-white/70 p-3.5 shadow-sm backdrop-blur-sm'

            if (tool.action === 'open-library') {
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setIsLibraryOpen(true)}
                  className={cardStyle}
                >
                  {content}
                </button>
              )
            }

            return (
              <Link href={tool.href} key={idx} className={cardStyle}>
                {content}
              </Link>
            )
          })}
        </section>

        {/* 课程列表 */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <BookOpen size={14} className="text-slate-400" />
            <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-400">
              Learning Courses
            </h2>
          </div>

          {LEARNING_COURSES.map((course, idx) => (
            <Link href={course.href} key={idx}>
              <motion.div
                whileTap={{ scale: 0.97 }}
                className="relative h-36 w-full overflow-hidden rounded-3xl shadow-md"
              >
                <img
                  src={course.img}
                  alt={course.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />

                <div className={`absolute inset-0 bg-gradient-to-r ${course.color} to-transparent`} />

                <div className="absolute inset-y-0 left-0 flex flex-col justify-center px-6">
                  <h3 className="text-xl font-black text-white">{course.title}</h3>
                  <p className="text-xs font-medium text-white/85">{course.sub}</p>

                  <div className="mt-3 flex w-fit items-center gap-1 rounded-md bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                    立即学习 <ChevronRight size={10} />
                  </div>
                </div>

                {/* AI 练口语加小标识 */}
                {course.title === 'AI 练口语' && (
                  <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-black text-white backdrop-blur-sm">
                    <Sparkles size={10} />
                    NEW
                  </div>
                )}
              </motion.div>
            </Link>
          ))}
        </section>
      </div>

      {/* 底部导航 */}
      <nav className="fixed bottom-0 left-0 right-0 z-[50] flex items-center justify-around border-t border-slate-100 bg-white px-4 pb-[calc(env(safe-area-inset-bottom)+10px)] pt-3 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        <FooterItem icon={MessageCircle} label="消息" />
        <FooterItem icon={Globe2} label="社区" />
        <FooterItem icon={Users} label="语伴" />
        <FooterItem icon={Compass} label="动态" />
        <FooterItem icon={BookOpen} label="学习" active />
      </nav>

      {/* 书库弹窗 */}
      <BookLibrary
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
      />
    </main>
  )
}

function FooterItem({ icon: Icon, label, active = false }) {
  return (
    <div
      className={`flex flex-col items-center gap-1 ${
        active ? 'text-indigo-600' : 'text-slate-400'
      }`}
    >
      <div className={active ? 'rounded-xl bg-indigo-50 p-1.5' : ''}>
        <Icon size={22} strokeWidth={active ? 2.5 : 2} />
      </div>
      <span className="text-[10px] font-bold">{label}</span>
    </div>
  )
              }
