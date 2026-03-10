'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { BOOKS_DATA } from '@/data/books';

// 懒加载 PDF 阅读器
const PremiumReader = dynamic(() => import('./PremiumReader'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-[300] bg-slate-900/80 backdrop-blur-md flex items-center justify-center text-white">
      <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
    </div>
  ),
});

// ==========================================
// 组件 1: 纯粹的 3D 图书 UI（去掉右侧白条；封面更干净）
// ==========================================
const ThreeDBook = ({ cover, disabled }) => {
  return (
    <div
      className={`relative w-full aspect-[3/4.25] opacity-90 backdrop-blur-[2px] ${
        disabled ? 'grayscale-[40%] opacity-50' : ''
      }`}
      style={{ perspective: '1000px' }}
    >
      {/* 底部投影 */}
      <div className="absolute -bottom-2 left-1 right-2 h-2 rounded-full blur-md bg-black/50" />

      <div
        className="absolute inset-0 transition-transform duration-300"
        style={{
          transformStyle: 'preserve-3d',
          transform: 'rotateY(-15deg) rotateX(2deg)',
        }}
      >
        {/* 封面 */}
        <div
          className="absolute inset-0 rounded-r-md rounded-l-[2px] overflow-hidden border border-white/10"
          style={{
            transform: 'translateZ(6px)',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.15)',
          }}
        >
          <img src={cover} alt="cover" className="w-full h-full object-cover opacity-95" />
          {/* 光泽与阴影 */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-white/10" />
          <div className="absolute inset-y-0 left-0 w-2 bg-gradient-to-r from-black/50 to-transparent" />
        </div>

        {/* 书脊（保留一点立体感） */}
        <div
          className="absolute top-[1px] bottom-[1px] left-[-3px] w-[4px] rounded-l-sm bg-black/40"
          style={{ transform: 'rotateY(-90deg)' }}
        />

        {disabled && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-r-md z-20"
            style={{ transform: 'translateZ(7px)' }}
          >
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
// 组件 2: 独立图书项（文字浮在封面上）
// ==========================================
const BookItem = ({ book, onClick }) => {
  const disabled = !book.pdfUrl;

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 15 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 260, damping: 20 },
    },
  };

  return (
    <motion.div variants={itemVariants} className="flex flex-col items-center">
      <button
        onClick={disabled ? undefined : onClick}
        className={`w-full focus:outline-none ${
          disabled ? 'cursor-not-allowed' : 'active:scale-90 transition-transform duration-200'
        }`}
        aria-disabled={disabled}
      >
        <div className="relative w-full">
          <ThreeDBook cover={book.cover} disabled={disabled} />

          {/* 封面底部磨砂信息条（浮在封面上） */}
          <div
            className="absolute left-1 right-1 bottom-1 z-30 rounded-md px-2 py-1.5
                       bg-black/35 backdrop-blur-md border border-white/10"
          >
            <h3 className="text-[11px] font-bold text-white leading-tight line-clamp-1 drop-shadow-sm">
              {book.subTitle}
            </h3>
            <p className="text-[9px] text-white/75 leading-tight line-clamp-1 drop-shadow-sm">
              {book.title}
            </p>
          </div>
        </div>
      </button>
    </motion.div>
  );
};

// ==========================================
// 主组件: 沉浸式图书架
// ==========================================
export default function ImmersiveBookLibrary({ isOpen, onClose }) {
  const [selectedBook, setSelectedBook] = useState(null);

  // 拖拽结束回调（向下/向右关闭）
  const handleDragEnd = (event, info) => {
    if (info.offset.y > 80 || info.offset.x > 80 || info.velocity.y > 400) {
      onClose?.();
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };

  if (!isOpen) return null;

  const bgImage =
    BOOKS_DATA?.[0]?.cover ||
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: '20%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          drag
          dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
          dragElastic={{ top: 0, left: 0, right: 0.5, bottom: 0.8 }}
          onDragEnd={handleDragEnd}
          className="relative w-full h-full sm:max-w-md bg-slate-900
"
        >
          {/* 背景层：彩色磨砂玻璃 */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <img src={bgImage} className="w-full h-full object-cover scale-110 opacity-70" alt="bg" />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/55 via-slate-900/60 to-slate-900/70 backdrop-blur-[18px] saturate-150" />
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1.5 rounded-full bg-white/30" />
          </div>

          {/* 书籍网格 */}
          <div className="relative z-10 w-full h-full overflow-y-auto custom-scrollbar px-5 pt-16 pb-24">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
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
