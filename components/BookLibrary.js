'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
// 引入刚刚抽离的数据
import { BOOKS_DATA } from '@/data/books'; 

// 懒加载 PDF 阅读器
const PremiumReader = dynamic(() => import('./PremiumReader'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-[300] bg-slate-900/80 backdrop-blur-md flex items-center justify-center text-white">
      <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
    </div>
  )
});

// ==========================================
// 组件 1: 纯粹的 3D 图书 UI (带微透明与磨砂质感)
// ==========================================
const ThreeDBook = ({ cover, disabled }) => {
  return (
    // 外层容器：整体 90% 透明度，带一点点模糊，融入背景
    <div className={`relative w-full aspect-[3/4.25] opacity-90 backdrop-blur-[2px] ${disabled ? 'grayscale-[40%] opacity-50' : ''}`} style={{ perspective: '1000px' }}>
      {/* 底部投影，让书悬浮 */}
      <div className="absolute -bottom-2 left-1 right-2 h-2 rounded-full blur-md bg-black/50" />
      
      <div className="absolute inset-0 transition-transform duration-300" style={{ transformStyle: 'preserve-3d', transform: 'rotateY(-15deg) rotateX(2deg)' }}>
        
        {/* 书籍封面 */}
        <div className="absolute inset-0 rounded-r-md rounded-l-[2px] overflow-hidden border border-white/10"
          style={{ transform: 'translateZ(6px)', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.15)' }}>
          <img src={cover} alt="cover" className="w-full h-full object-cover mix-blend-overlay opacity-90" />
          {/* 光泽和阴影 */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-white/10" />
          <div className="absolute inset-y-0 left-0 w-2 bg-gradient-to-r from-black/50 to-transparent" />
        </div>

        {/* 书页侧边 (厚度) - 减小厚度适应一排3个的尺寸 */}
        <div className="absolute top-[2px] bottom-[2px] right-[-6px] w-[8px] rounded-r-sm bg-white/80"
          style={{ transform: 'translateZ(2px)', boxShadow: 'inset -1px 0 2px rgba(0,0,0,.2)' }}>
        </div>

        {/* 书脊 */}
        <div className="absolute top-[1px] bottom-[1px] left-[-3px] w-[4px] rounded-l-sm bg-black/40"
          style={{ transform: 'rotateY(-90deg)' }} />

        {disabled && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-r-md z-20" style={{ transform: 'translateZ(7px)' }}>
             <span className="text-[8px] text-white/90 font-bold bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-md">
               敬请期待
             </span>
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 组件 2: 独立图书项 (含文字与动画)
// ==========================================
const BookItem = ({ book, onClick }) => {
  const disabled = !book.pdfUrl;
  
  // 交错出现的动画
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 15 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } }
  };

  return (
    <motion.div variants={itemVariants} className="flex flex-col items-center">
      <button 
        onClick={disabled ? undefined : onClick}
        className={`w-full focus:outline-none ${disabled ? 'cursor-not-allowed' : 'active:scale-90 transition-transform duration-200'}`}
      >
        <ThreeDBook cover={book.cover} disabled={disabled} />
      </button>
      
      {/* 底部文字 (白色/浅色以适配暗色模糊背景) */}
      <div className="text-center mt-3 w-full px-0.5">
        <h3 className="text-[11px] font-bold text-white shadow-black/50 drop-shadow-md line-clamp-1">
          {book.subTitle}
        </h3>
        <p className="text-[9px] text-white/70 font-medium mt-0.5 truncate drop-shadow-sm">
          {book.title}
        </p>
      </div>
    </motion.div>
  );
};

// ==========================================
// 主组件: 沉浸式图书架
// ==========================================
export default function ImmersiveBookLibrary({ isOpen, onClose }) {
  const [selectedBook, setSelectedBook] = useState(null);

  // Framer Motion 拖拽结束回调 (支持向下或向右滑动关闭)
  const handleDragEnd = (event, info) => {
    // 只要向下滑动超过 80px，或者向右滑动超过 80px，就关闭面板
    if (info.offset.y > 80 || info.offset.x > 80 || info.velocity.y > 400) {
      onClose();
    }
  };

  // 容器动画
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
  };

  if (!isOpen) return null;

  // 使用第一本书的封面作为全局全屏背景
  const bgImage = BOOKS_DATA[0]?.cover || 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80';

  return (
    <AnimatePresence>
      {/* 最外层容器固定满屏 */}
      <div className="fixed inset-0 z-[110] flex items-center justify-center overflow-hidden">
        
        {/* 滑动面板本身 */}
        <motion.div
          initial={{ opacity: 0, y: '20%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          
          // --- 原生手势拖拽配置 ---
          drag
          dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }} // 限制回弹
          dragElastic={{ top: 0, left: 0, right: 0.5, bottom: 0.8 }} // 允许向下/向右有橡皮筋手感
          onDragEnd={handleDragEnd}
          
          className="relative w-full h-full sm:max-w-md bg-black"
        >
          {/* ================= 沉浸式背景层 ================= */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            {/* 放大的图书封面 */}
            <img src={bgImage} className="w-full h-full object-cover scale-110 opacity-70" alt="bg" />
            {/* 极强的高斯模糊与暗色遮罩，形成磨砂玻璃效果 */}
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[24px] saturate-150" />
            {/* 顶部做个极简的拖拽指示条 (iOS 风格) */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1.5 rounded-full bg-white/30" />
          </div>

          {/* ================= 书籍网格层 ================= */}
          <div className="relative z-10 w-full h-full overflow-y-auto custom-scrollbar px-5 pt-16 pb-24">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              // 一排 3 个，调整间距适配手机
              className="grid grid-cols-3 gap-x-4 gap-y-8"
            >
              {BOOKS_DATA.map((book) => (
                <BookItem key={book.id} book={book} onClick={() => setSelectedBook(book)} />
              ))}
            </motion.div>
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
