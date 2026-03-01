import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronUp, ArrowRight, Lock } from 'lucide-react';

// 引入刚才的数据
import { getAllCategoryIds, getCategoryData } from '@/data/vocabData';

// 1. Next.js 静态生成配置 (适配 Cloudflare Pages)
export async function getStaticPaths() {
  const paths = getAllCategoryIds().map((id) => ({
    params: { categoryId: id },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const categoryData = getCategoryData(params.categoryId);
  return { props: { categoryData } };
}

// 2. 折叠区块组件 (Level Section)
const LevelAccordion = ({ level }) => {
  const router = useRouter();
  // 默认展开状态
  const [isOpen, setIsOpen] = useState(true);

  // 点击单词列表，跳转到“抖音模式”学习页 (下一个要做的页面)
  const handleItemClick = (item) => {
    if (item.locked) {
      alert("此课程已锁定，请先完成前置课程！");
      return;
    }
    // 路由跳转预留，例如：/vocabulary/player?listId=treatment
    router.push(`/vocabulary/player?listId=${item.id}`);
  };

  return (
    <div className="mb-6">
      {/* 标题控制区 */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-2 text-left select-none"
      >
        <div>
          <h2 className="text-white text-lg font-bold tracking-wide">{level.title}</h2>
          <p className="text-slate-400 text-xs mt-1">{level.desc}</p>
        </div>
        <motion.div animate={{ rotate: isOpen ? 0 : 180 }} transition={{ duration: 0.3 }}>
          <ChevronUp className="text-slate-300" size={20} />
        </motion.div>
      </button>

      {/* 展开的列表区 */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-3 pt-4">
              {level.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`flex items-center gap-4 p-3.5 rounded-2xl transition-all duration-200 text-left
                    ${item.locked 
                      ? 'bg-[#1a1d2d] opacity-70 cursor-not-allowed' 
                      : 'bg-[#22263b] active:scale-[0.98] hover:bg-[#2a2f45]'
                    }
                  `}
                >
                  {/* 左侧封面图 */}
                  <div className="relative w-[52px] h-[52px] rounded-full overflow-hidden flex-shrink-0 bg-slate-700">
                    <img 
                      src={item.cover} 
                      alt={item.title} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {item.locked && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Lock size={16} className="text-white/70" />
                      </div>
                    )}
                  </div>

                  {/* 中间文字 */}
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-base font-bold truncate ${item.locked ? 'text-slate-400' : 'text-slate-100'}`}>
                      {item.title}
                    </h3>
                    <p className="text-slate-500 text-xs truncate mt-1">
                      {item.subtitle}
                    </p>
                  </div>

                  {/* 右侧动作图标 */}
                  <div className="flex-shrink-0 pl-2">
                    {item.locked ? (
                      <Lock size={18} className="text-slate-600" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                        <ArrowRight size={16} />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// 3. 主页面组件
export default function CategoryDetailPage({ categoryData }) {
  const router = useRouter();

  if (!categoryData) return <div className="min-h-screen bg-[#10121b] text-white p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#10121b] font-sans selection:bg-indigo-500/30">
      <Head>
        <title>{categoryData.title} - 词汇学习</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Head>

      {/* 顶部彩色 Header 区域 */}
      <div className={`relative pt-12 pb-8 px-6 bg-gradient-to-br ${categoryData.headerBg} overflow-hidden rounded-b-[2.5rem] shadow-xl shadow-black/20`}>
        {/* 背景暗纹装饰 (可选) */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        
        {/* 返回按钮 */}
        <button 
          onClick={() => router.back()} 
          className="absolute top-12 left-4 text-white p-2"
        >
          <ChevronLeft size={28} />
        </button>

        {/* 标题与大图标 */}
        <div className="flex items-center justify-between mt-12 mb-4 relative z-10">
          <h1 className="text-3xl font-black text-white drop-shadow-md tracking-wider">
            {categoryData.title}
          </h1>
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner border border-white/30">
            {categoryData.icon}
          </div>
        </div>
      </div>

      {/* 下方折叠列表区 */}
      <div className="p-6 pb-24">
        {categoryData.levels.map((level) => (
          <LevelAccordion key={level.id} level={level} />
        ))}
      </div>
    </div>
  );
              }
