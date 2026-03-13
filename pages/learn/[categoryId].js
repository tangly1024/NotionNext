// /pages/learn/[categoryId].js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import fs from 'fs';
import path from 'path';
import { ChevronLeft, Flame, Diamond, Star, Lock, Check, BookOpen } from 'lucide-react';
import { getProgress, spendGemsToUnlock } from '../../lib/progress';

const vibrate = (pattern = 15) => {
  if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
    try { window.navigator.vibrate(pattern); } catch (e) {}
  }
};

export default function CategoryRoadmap({ roadmap }) {
  const [progress, setProgress] = useState(null);
  const router = useRouter();

  // 🌟 终极修复 1：每次页面显示时，强制重新读取进度，打破缓存！
  const refreshProgress = () => setProgress(getProgress());

  useEffect(() => {
    refreshProgress();
    // 监听返回页面和窗口激活事件，确保状态最新
    window.addEventListener('focus', refreshProgress);
    router.events.on('routeChangeComplete', refreshProgress);
    return () => {
      window.removeEventListener('focus', refreshProgress);
      router.events.off('routeChangeComplete', refreshProgress);
    };
  }, [roadmap?.id, router.events]);

  if (!roadmap) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f3f4f6]">
        <h1 className="text-xl font-bold text-gray-500 mb-4">内容还在建设中...</h1>
        <button onClick={() => router.push('/learn')} className="px-6 py-2 bg-blue-500 text-white rounded-full font-bold">返回主页</button>
      </div>
    );
  }

  if (!progress) return <div className="min-h-screen bg-[#f3f4f6] animate-pulse" />;

  // 🌟 终极修复 2：将地图里所有关卡的 ID 抽成一个平铺的数组
  const allLessonIds = roadmap.units.flatMap(u => u.lessons.map(l => l.id));

  return (
    <div className="min-h-screen bg-[#f3f4f6] pb-32 font-sans overflow-x-hidden selection:bg-transparent">
      
      <header className="sticky top-0 bg-[#f3f4f6]/95 backdrop-blur-md h-14 z-50 flex items-center justify-between px-4">
        <button onClick={() => { vibrate(10); router.push('/learn'); }} className="p-2 -ml-2 text-gray-400 hover:text-gray-600 active:scale-90 transition-transform">
          <ChevronLeft size={30} strokeWidth={3} />
        </button>
        <h1 className="flex-1 text-center text-[17px] font-black text-[#4b4b4b] tracking-wide">
          {roadmap.title}
        </h1>
        <div className="w-10"></div>
      </header>

      <main className="max-w-md mx-auto relative pt-4 px-4">
        {roadmap.units.map((unit, unitIdx) => (
          <section key={unit.id} className="mb-8">
            
            <div className="flex items-center justify-center w-full mb-8 mt-2 z-20">
              <div className="h-[2px] flex-1 bg-[#e5e5e5]"></div>
              <span className="px-4 text-[15px] font-black text-gray-400 text-center tracking-wide">
                {unit.description || unit.title}
              </span>
              <div className="h-[2px] flex-1 bg-[#e5e5e5]"></div>
            </div>

            <div className="relative flex flex-col items-center py-2 gap-7">
              <div className="absolute top-0 bottom-0 left-1/2 w-[14px] -ml-[7px] bg-[#e5e5e5] -z-10 rounded-full shadow-inner" />

              {unit.lessons.map((lesson, idx) => {
                
                // 🌟 终极修复 3：自愈级解锁算法
                // 如果上一关已经完成了，这一关就自动解锁！不需要依赖本地缓存。
                const globalIdx = allLessonIds.indexOf(lesson.id);
                const isPreviousCompleted = globalIdx <= 0 ? true : progress.completedLessons.includes(allLessonIds[globalIdx - 1]);
                
                const isUnlocked = progress.unlockedLessons.includes(lesson.id) || isPreviousCompleted;
                const isCompleted = progress.completedLessons.includes(lesson.id);
                const isCurrent = isUnlocked && !isCompleted;
                const isLocked = !isUnlocked; 
                
                const xOffsets = [0, -38, -65, -38, 0, 38, 65, 38];
                const xPos = xOffsets[idx % 8];

                let nodeClasses = "";
                let icon = "";
                
                if (isLocked) { 
                  nodeClasses = "bg-[#e5e5e5] border-b-[8px] border-[#cfcfcf]";
                  icon = "🔒";
                } else if (isCompleted) { 
                  nodeClasses = "bg-[#ffc800] border-b-[8px] border-[#e5a500]";
                  icon = "⭐";
                } else { 
                  nodeClasses = "bg-[#58cc02] border-b-[8px] border-[#46a302]";
                  icon = "🌟";
                }

                return (
                  <div key={lesson.id} className="relative z-10 my-1" style={{ transform: `translateX(${xPos}px)` }}>
                    <Link href={isUnlocked ? `/learn/quiz/${lesson.id}` : '#'}>
                      <div className="flex flex-col items-center cursor-pointer group relative">
                        {isCurrent && (
                          <div className="absolute inset-0 bg-[#58cc02] rounded-full scale-110 opacity-30 animate-ping pointer-events-none" />
                        )}
                        <div className={`relative w-[76px] h-[76px] rounded-full flex items-center justify-center transition-transform duration-100 ease-in-out ${isUnlocked ? 'active:scale-90' : ''} ${nodeClasses}`}>
                          <div className="absolute top-1 left-[15%] right-[15%] h-[20%] bg-white/20 rounded-full pointer-events-none" />
                          <span className={`text-[32px] ${!isUnlocked && 'opacity-40 grayscale'}`}>{icon}</span>
                          {isCurrent && (
                            <div className="absolute -top-12 bg-white text-[#58cc02] font-black text-[13px] px-4 py-2 border-[2.5px] border-[#e5e5e5] rounded-xl shadow-sm animate-bounce whitespace-nowrap z-20">
                              START
                              <div className="absolute -bottom-2 left-1/2 -ml-2 w-3.5 h-3.5 bg-white border-b-[2.5px] border-r-[2.5px] border-[#e5e5e5] rotate-45" />
                            </div>
                          )}
                        </div>
                        {lesson.title && (
                          <span className={`mt-3 font-black text-[14px] px-2.5 py-1 rounded-lg tracking-wide ${isUnlocked ? 'text-[#4b4b4b] bg-white shadow-sm border-2 border-[#e5e5e5]' : 'text-gray-400 opacity-60'}`}>
                            {lesson.title}
                          </span>
                        )}
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}

export async function getStaticPaths() {
  try {
    const file = path.join(process.cwd(), 'data/categories.json');
    const cats = JSON.parse(fs.readFileSync(file, 'utf8'));
    return { paths: cats.map(c => ({ params: { categoryId: c.id } })), fallback: false };
  } catch (e) {
    return { paths: [], fallback: false };
  }
}

export async function getStaticProps({ params }) {
  try {
    const file = path.join(process.cwd(), `data/roadmaps/${params.categoryId}.json`);
    const roadmap = JSON.parse(fs.readFileSync(file, 'utf8'));
    return { props: { roadmap } };
  } catch (e) {
    return { notFound: true };
  }
    }
