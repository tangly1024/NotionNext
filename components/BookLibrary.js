'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, PlayCircle, Clock, BookOpen, Search } from 'lucide-react';
import dynamic from 'next/dynamic';

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
  {
    id: 'b1',
    title: '汉语语法基础',
    subTitle: 'တရုတ်သဒ္ဒါအခြေခံ',
    cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80',
    pdfUrl: 'https://pdf.886.best/pdf/chinese-vocab-audio/ffice.pdf'
  },
  {
    id: 'b2',
    title: '实用口语 300 句',
    subTitle: 'လက်တွေ့သုံး စကားပြော',
    cover: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&q=80',
    pdfUrl:
      'https://reader.zlib.fi/read/aed200cc9e27adfe2b703fc2e36f68304c4ded6662ecb42159503f1b4eede2f1/3635834/3fc1a9/hsk-2-standard-course.html?client_key=1fFLi67gBrNRP1j1iPy1&extension=pdf&signature=1c516e2bb836fd87086b18384c0ff1b1a2bd12aec42363620bc0334226c38455'
  },
  {
    id: 'b3',
    title: 'HSK 1级 标准教程',
    subTitle: 'HSK 1 စံသင်ရိုး',
    cover: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&q=80',
    pdfUrl: 'https://audio.886.best/chinese-vocab-audio/hsk1.pdf'
  },
  {
    id: 'b4',
    title: '中国文化常识',
    subTitle: 'တရုတ်ယဉ်ကျေးမှု',
    cover: 'https://images.unsplash.com/photo-1519682577862-22b62b233c1c?w=400&q=80',
    pdfUrl: ''
  },
  {
    id: 'b5',
    title: '测试书籍',
    subTitle: 'မြန်မာစာ',
    cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&q=80',
    pdfUrl: ''
  }
];

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const toProgress = (page = 0, total = 100) => clamp(Math.round((page / Math.max(total, 1)) * 100), 0, 100);

/* 手机优先：静态真实 3D 书，不做 hover/click 放大 */
const ThreeDBook = ({ cover, title, onClick, disabled }) => {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      type="button"
      className={`relative w-full aspect-[3/4.25] text-left ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
      style={{ perspective: '1200px' }}
      aria-label={title}
    >
      <div
        className="absolute -bottom-4 left-2 right-4 h-4 rounded-full blur-xl"
        style={{ background: 'rgba(15,23,42,0.42)' }}
      />
      <div
        className="absolute inset-0"
        style={{ transformStyle: 'preserve-3d', transform: 'rotateY(-14deg) rotateX(2deg)' }}
      >
        <div
          className="absolute inset-0 rounded-r-md rounded-l-[2px] overflow-hidden"
          style={{
            transform: 'translateZ(8px)',
            boxShadow:
              '0 20px 26px rgba(15,23,42,.25), 0 8px 14px rgba(15,23,42,.16), inset 0 0 0 1px rgba(255,255,255,.18)'
          }}
        >
          <img src={cover} alt={title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/18 via-transparent to-white/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/22 via-transparent to-white/12" />
          <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-black/30 to-transparent" />
          <div className="absolute top-0 left-0 h-full w-1 bg-black/25" />
        </div>

        <div
          className="absolute top-[3px] bottom-[3px] right-[-10px] w-[12px] rounded-r-sm border-l border-slate-300"
          style={{
            transform: 'translateZ(1px)',
            background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 35%, #eef2f7 100%)',
            boxShadow: 'inset -1px 0 0 rgba(0,0,0,.05), inset 0 0 10px rgba(148,163,184,.25)'
          }}
        >
          {Array.from({ length: 13 }).map((_, i) => (
            <div key={i} className="h-px bg-slate-300/55 mx-[1px]" style={{ marginTop: i === 0 ? 2 : 3 }} />
          ))}
        </div>

        <div
          className="absolute top-[2px] bottom-[2px] left-[-3px] w-[4px] rounded-l-sm"
          style={{
            transform: 'rotateY(-90deg)',
            background: 'linear-gradient(180deg, #cbd5e1 0%, #f8fafc 48%, #cbd5e1 100%)'
          }}
        />

        <div
          className="absolute top-[2px] bottom-[2px] left-[2px] right-[-8px] rounded-sm"
          style={{ transform: 'translateZ(-3px)', background: '#fff', boxShadow: '0 4px 8px rgba(15,23,42,.08)' }}
        />

        {disabled && (
          <div className="absolute inset-0 bg-slate-900/35 rounded-r-md rounded-l-[2px] flex items-end justify-center pb-2">
            <span className="text-[10px] text-white font-bold bg-black/40 px-2 py-0.5 rounded">即将上线</span>
          </div>
        )}
      </div>
    </button>
  );
};

export default function BookLibrary({ isOpen, onClose }) {
  const [selectedBook, setSelectedBook] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!isOpen) return;

    const allHistory = [];
    BOOKS_DATA.forEach((book) => {
      const raw = localStorage.getItem(`${HISTORY_KEY}_${book.id}`);
      if (!raw) return;
      try {
        const parsed = JSON.parse(raw);
        allHistory.push({ ...book, ...parsed });
      } catch (_) {}
    });

    allHistory.sort((a, b) => new Date(b.lastRead || 0).getTime() - new Date(a.lastRead || 0).getTime());
    setHistory(allHistory);
  }, [isOpen, selectedBook]);

  const continueBook = useMemo(() => history.find((x) => !!x.pdfUrl), [history]);

  if (!isOpen) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] flex justify-end">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/40 backdrop-blur-[3px]" />

      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 220 }}
        className="relative w-full h-full bg-slate-50 shadow-2xl flex flex-col overflow-hidden sm:max-w-md ml-auto"
      >
        <div className="relative h-36 shrink-0 overflow-hidden">
          <div className="absolute inset-0 bg-slate-900">
            <img
              src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80"
              className="w-full h-full object-cover opacity-50 mix-blend-overlay scale-110"
              alt="Background"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/20 to-transparent" />
          </div>

          <div className="absolute inset-0 px-5 pt-5 pb-2 flex flex-col justify-between z-10">
            <div className="flex items-center justify-between">
              <button onClick={onClose} className="p-2 -ml-2 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/10">
                <ChevronLeft size={24} />
              </button>
              <button className="p-2 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/10">
                <Search size={18} />
              </button>
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-800 flex items-center gap-2 drop-shadow-sm tracking-tight">
                Library <span className="text-yellow-500 text-2xl">✨</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium pl-0.5 opacity-80">Discover your next journey</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 pb-24 space-y-8">
          {continueBook && (
            <section>
              <div className="flex items-center gap-2 mb-3 px-1">
                <Clock size={14} className="text-blue-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Continue Reading</span>
              </div>

              <button
                onClick={() => continueBook.pdfUrl && setSelectedBook(continueBook)}
                type="button"
                className="relative w-full aspect-[2.6/1] overflow-hidden rounded-2xl shadow-xl shadow-blue-500/10 bg-white text-left"
              >
                <div className="absolute inset-0 bg-cover bg-center opacity-20 blur-md scale-125" style={{ backgroundImage: `url(${continueBook.cover})` }} />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-800/90 to-slate-900/40" />

                <div className="absolute inset-0 p-4 flex items-center gap-4">
                  <div className="relative h-full aspect-[3/4.2] shadow-lg rounded-sm overflow-hidden border border-white/10">
                    <img src={continueBook.cover} className="w-full h-full object-cover" alt="" />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-center text-white h-full py-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-yellow-500/20 text-yellow-300 text-[9px] font-bold px-1.5 py-0.5 rounded border border-yellow-500/30">
                        READING
                      </span>
                    </div>
                    <h3 className="font-bold text-base leading-tight truncate text-slate-100">{continueBook.subTitle}</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate">{continueBook.title}</p>

                    <div className="mt-auto">
                      <div className="flex justify-between text-[9px] text-slate-400 mb-1 font-mono">
                        <span>Progress</span>
                        <span>{toProgress(continueBook.page, continueBook.numPages)}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${toProgress(continueBook.page, continueBook.numPages)}%` }}
                          className="h-full bg-gradient-to-r from-blue-400 to-blue-300 rounded-full shadow-[0_0_8px_rgba(96,165,250,0.6)]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                    <PlayCircle size={20} className="text-white ml-0.5" />
                  </div>
                </div>
              </button>
            </section>
          )}

          <section>
            <div className="flex items-center gap-2 mb-5 px-1">
              <BookOpen size={14} className="text-blue-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Collections</span>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100/50">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-8">
                {BOOKS_DATA.map((book) => (
                  <div key={book.id} className="flex flex-col items-center">
                    <ThreeDBook cover={book.cover} title={book.title} disabled={!book.pdfUrl} onClick={() => setSelectedBook(book)} />
                    <div className="text-center mt-3 w-full px-0.5">
                      <h3 className="text-xs font-bold text-slate-700 line-clamp-2 leading-relaxed pb-0.5 h-[2.8em] flex items-start justify-center overflow-hidden">
                        {book.subTitle}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </motion.div>

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
    </motion.div>
  );
          }
