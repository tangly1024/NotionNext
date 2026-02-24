'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, PlayCircle, Clock, Search, Library } from 'lucide-react';
import dynamic from 'next/dynamic';

// 懒加载阅读器
const PremiumReader = dynamic(() => import('./PremiumReader'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-[300] bg-slate-900/80 backdrop-blur-md flex items-center justify-center text-white">
      <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
    </div>
  )
});

const HISTORY_KEY = 'hsk-reader-meta';

const BOOKS_DATA = [
  { id: 'b1', title: '汉语语法基础', subTitle: 'တရုတ်သဒ္ဒါအခြေခံ', cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80', pdfUrl: 'https://pdf.886.best/pdf/chinese-vocab-audio/ffice.pdf' },
  { id: 'b2', title: '实用口语 300 句', subTitle: 'လက်တွေ့သုံး စကားပြော', cover: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&q=80', pdfUrl: 'https://reader.zlib.fi/read/aed200cc9e27adfe2b703fc2e36f68304c4ded6662ecb42159503f1b4eede2f1/3635834/3fc1a9/hsk-2-standard-course.html?client_key=1fFLi67gBrNRP1j1iPy1&extension=pdf&signature=1c516e2bb836fd87086b18384c0ff1b1a2bd12aec42363620bc0334226c38455' },
  { id: 'b3', title: 'HSK 1级 标准教程', subTitle: 'HSK 1 စံသင်ရိုး', cover: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&q=80', pdfUrl: 'https://audio.886.best/chinese-vocab-audio/hsk1.pdf' },
  { id: 'b4', title: '中国文化常识', subTitle: 'တရုတ်ယဉ်ကျေးမှု', cover: 'https://images.unsplash.com/photo-1519682577862-22b62b233c1c?w=400&q=80', pdfUrl: '' },
  { id: 'b5', title: '测试书籍', subTitle: 'မြန်မာစာ', cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&q=80', pdfUrl: '' }
];

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const toProgress = (page = 0, total = 100) => clamp(Math.round((page / Math.max(total, 1)) * 100), 0, 100);

// ==========================================
// 组件 1: 3D 书籍渲染 (无事件纯 UI)
// ==========================================
const ThreeDBook = ({ cover, disabled }) => {
  return (
    <div className={`relative w-full aspect-[3/4.25] ${disabled ? 'opacity-60 grayscale-[30%]' : ''}`} style={{ perspective: '1200px' }}>
      {/* 底部真实阴影 */}
      <div className="absolute -bottom-3 left-2 right-4 h-3 rounded-full blur-xl bg-slate-900/40" />
      
      <div className="absolute inset-0 transition-transform duration-500 hover:rotate-y-[-5deg]" style={{ transformStyle: 'preserve-3d', transform: 'rotateY(-18deg) rotateX(4deg)' }}>
        {/* 书面 */}
        <div className="absolute inset-0 rounded-r-md rounded-l-[2px] overflow-hidden"
          style={{ transform: 'translateZ(10px)', boxShadow: '0 20px 26px rgba(15,23,42,.2), 0 8px 14px rgba(15,23,42,.15), inset 0 0 0 1px rgba(255,255,255,.2)' }}>
          <img src={cover} alt="cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-white/10" />
          <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/40 to-transparent" />
        </div>

        {/* 书页侧边 (厚度) */}
        <div className="absolute top-[3px] bottom-[3px] right-[-12px] w-[14px] rounded-r-sm border-l border-slate-300 flex flex-col justify-evenly py-0.5"
          style={{ transform: 'translateZ(2px)', background: 'linear-gradient(90deg, #f8fafc 0%, #e2e8f0 100%)', boxShadow: 'inset -1px 0 2px rgba(0,0,0,.1)' }}>
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="h-[1px] bg-slate-300/60 mx-[1px]" />
          ))}
        </div>

        {/* 书脊 */}
        <div className="absolute top-[2px] bottom-[2px] left-[-4px] w-[6px] rounded-l-sm"
          style={{ transform: 'rotateY(-90deg)', background: 'linear-gradient(90deg, #94a3b8 0%, #cbd5e1 50%, #94a3b8 100%)' }} />

        {/* 封底 */}
        <div className="absolute top-[2px] bottom-[2px] left-[2px] right-[-10px] rounded-sm bg-slate-200"
          style={{ transform: 'translateZ(-4px)', boxShadow: '0 4px 10px rgba(0,0,0,.1)' }} />

        {disabled && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 rounded-r-md z-20" style={{ transform: 'translateZ(11px)' }}>
             <span className="text-[10px] text-white font-bold bg-black/60 px-2 py-1 rounded backdrop-blur-sm shadow-lg border border-white/20">
               Coming Soon
             </span>
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 组件 2: 单个书籍项 (包含点击、文字、动画)
// ==========================================
const BookItem = ({ book, onClick }) => {
  const disabled = !book.pdfUrl;
  
  // 动画变体
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div variants={itemVariants} className="flex flex-col items-center group">
      <button 
        onClick={disabled ? undefined : onClick}
        className={`w-full focus:outline-none ${disabled ? 'cursor-not-allowed' : 'cursor-pointer active:scale-95 transition-transform'}`}
      >
        <ThreeDBook cover={book.cover} disabled={disabled} />
      </button>
      <div className="text-center mt-5 w-full px-1">
        <h3 className="text-[13px] font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {book.subTitle}
        </h3>
        <p className="text-[10px] text-slate-500 font-medium mt-1 truncate">
          {book.title}
        </p>
      </div>
    </motion.div>
  );
};

// ==========================================
// 主组件: Library 面板
// ==========================================
export default function BookLibrary({ isOpen, onClose }) {
  const [selectedBook, setSelectedBook] = useState(null);
  const [history, setHistory] = useState([]);

  // 加载阅读历史
  useEffect(() => {
    if (!isOpen) return;
    const allHistory = BOOKS_DATA.reduce((acc, book) => {
      try {
        const raw = localStorage.getItem(`${HISTORY_KEY}_${book.id}`);
        if (raw) acc.push({ ...book, ...JSON.parse(raw) });
      } catch (_) {}
      return acc;
    }, []);
    allHistory.sort((a, b) => new Date(b.lastRead || 0).getTime() - new Date(a.lastRead || 0).getTime());
    setHistory(allHistory);
  }, [isOpen, selectedBook]);

  const continueBook = useMemo(() => history.find((x) => !!x.pdfUrl), [history]);

  // Framer Motion 拖拽手势结束回调
  const handleDragEnd = (event, info) => {
    // 如果向右滑动超过 100px，或者快速向右滑动，则关闭面板
    if (info.offset.x > 100 || info.velocity.x > 500) {
      onClose();
    }
  };

  // 交错动画容器变体
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex justify-end overflow-hidden">
        {/* 背景遮罩 */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
          onClick={onClose} 
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
        />

        {/* 侧边滑动面板 (支持拖拽返回) */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          // --- 拖拽返回配置 ---
          drag="x"
          dragConstraints={{ left: 0, right: 0 }} // 只允许向右拖拽松开回弹
          dragElastic={{ left: 0, right: 0.5 }} // 向右有阻尼感
          onDragEnd={handleDragEnd}
          className="relative w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 shadow-2xl flex flex-col sm:max-w-md ml-auto"
        >
          {/* Header 区域 */}
          <div className="relative h-44 shrink-0 rounded-b-[2rem] overflow-hidden shadow-sm z-10">
            <div className="absolute inset-0 bg-slate-900">
              <img src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80" className="w-full h-full object-cover opacity-40 mix-blend-overlay scale-105" alt="Bg" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
            </div>

            <div className="absolute inset-0 px-6 pt-12 pb-5 flex flex-col justify-between">
              <div className="flex items-center justify-between -mt-4">
                <button onClick={onClose} className="p-2 -ml-2 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 transition-colors">
                  <ChevronLeft size={22} />
                </button>
                <button className="p-2 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 transition-colors">
                  <Search size={18} />
                </button>
              </div>
              <div>
                <h2 className="text-3xl font-black text-white flex items-center gap-2 drop-shadow-md tracking-tight">
                  Library <span className="text-yellow-400 text-2xl animate-pulse">✨</span>
                </h2>
                <p className="text-sm text-slate-300 font-medium pl-0.5 mt-1">Discover your next journey</p>
              </div>
            </div>
          </div>

          {/* 内容滚动区域 */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-5 pt-6 pb-24 space-y-8">
            
            {/* 最近阅读卡片 (Glassmorphism 风格) */}
            {continueBook && (
              <section>
                <div className="flex items-center gap-2 mb-3 pl-1">
                  <Clock size={15} className="text-blue-600" />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Continue Reading</span>
                </div>

                <button
                  onClick={() => continueBook.pdfUrl && setSelectedBook(continueBook)}
                  className="relative w-full p-4 overflow-hidden rounded-3xl shadow-lg shadow-blue-500/5 bg-white/60 backdrop-blur-xl border border-white text-left transition-transform active:scale-[0.98] group"
                >
                  <div className="flex items-center gap-5">
                    {/* 小封面 */}
                    <div className="w-16 h-24 shrink-0 shadow-md rounded-[2px] overflow-hidden border border-slate-200 group-hover:shadow-blue-200 transition-shadow">
                      <img src={continueBook.cover} className="w-full h-full object-cover" alt="" />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col h-24 py-1">
                      <span className="self-start bg-blue-100 text-blue-600 text-[10px] font-black px-2 py-0.5 rounded-full mb-1">
                        RESUME
                      </span>
                      <h3 className="font-bold text-base text-slate-800 truncate">{continueBook.subTitle}</h3>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">{continueBook.title}</p>

                      <div className="mt-auto">
                        <div className="flex justify-between text-[10px] text-slate-500 mb-1.5 font-bold">
                          <span>Progress</span>
                          <span className="text-blue-600">{toProgress(continueBook.page, continueBook.numPages)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${toProgress(continueBook.page, continueBook.numPages)}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 播放按钮 */}
                    <div className="w-10 h-10 shrink-0 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white text-blue-600 transition-colors shadow-sm">
                      <PlayCircle size={20} className="ml-0.5" />
                    </div>
                  </div>
                </button>
              </section>
            )}

            {/* 图书列表 (直接放置在大背景上) */}
            <section>
              <div className="flex items-center gap-2 mb-6 pl-1">
                <Library size={15} className="text-slate-800" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">All Collections</span>
              </div>

              {/* 使用 Framer Motion 处理列表交错动画 */}
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-10 px-1"
              >
                {BOOKS_DATA.map((book) => (
                  <BookItem key={book.id} book={book} onClick={() => setSelectedBook(book)} />
                ))}
              </motion.div>
            </section>

          </div>
        </motion.div>

        {/* PDF 阅读器模态框 */}
        <AnimatePresence>
          {selectedBook?.pdfUrl && (
            <PremiumReader
              url={selectedBook.pdfUrl}
              title={selectedBook.title}
              bookId={selectedBook.id}
              onClose={() => setSelectedBook(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
        }
