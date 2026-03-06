'use client';

import { useRouter } from 'next/router';
import Link from 'next/link';
import { ChevronLeft, Lock, PlayCircle } from 'lucide-react';
// import { oralCategories } from '@/data/oralData';

export default function OralCategoryPage() {
  const router = useRouter();
  const { categoryId } = router.query;

  if (!router.isReady) return null;

  const category = oralCategories.find((c) => c.id === categoryId);

  if (!category) {
    return <div className="p-8 text-center text-slate-500">分类不存在</div>;
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-20">
      <div className="max-w-md mx-auto px-4 pt-6">
        
        {/* 头部 */}
        <div className="flex items-center gap-3 mb-6">
          <button 
            onClick={() => router.push('/oral')}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-600 active:scale-95 transition-transform"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{category.icon}</span>
            <h1 className="text-xl font-black text-slate-800">{category.title}</h1>
          </div>
        </div>

        {/* 一排三个的网格 */}
        <div className="grid grid-cols-3 gap-3">
          {category.items.map((sub, index) => {
            const isLocked = sub.locked;
            // 跳转到你的播放器页面 (你需要自己建一个 pages/oral/player.js 接收这些参数)
            const targetUrl = `/oral/player?category=${category.id}&listId=${sub.id}`;

            return (
              <Link 
                key={sub.id} 
                href={isLocked ? '#' : targetUrl}
                onClick={(e) => isLocked && e.preventDefault()}
              >
                <div className={`bg-white rounded-2xl p-3 flex flex-col items-center justify-center shadow-sm border border-slate-100 h-[120px] active:scale-95 transition-all relative overflow-hidden ${isLocked ? 'opacity-70 bg-slate-50' : ''}`}>
                  
                  {/* 背景装饰数字 */}
                  <div className="absolute -top-2 -right-2 text-4xl font-black text-slate-50 opacity-50 pointer-events-none">
                    {index + 1}
                  </div>

                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${isLocked ? 'bg-slate-200 text-slate-400' : 'bg-blue-50 text-blue-500'}`}>
                    {isLocked ? <Lock size={18} /> : <PlayCircle size={20} />}
                  </div>

                  <h3 className="text-[14px] font-bold text-slate-800 text-center leading-tight w-full z-10">
                    {sub.title}
                  </h3>
                  
                  {sub.subtitle && (
                    <p className="text-[10px] text-slate-400 text-center mt-1 truncate w-full z-10">
                      {sub.subtitle}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </main>
  );
}
