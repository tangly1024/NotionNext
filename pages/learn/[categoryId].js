// /pages/learn/[categoryId].js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import fs from 'fs';
import path from 'path';
import { ChevronLeft, Flame, Diamond, Star, Lock, Check, BookOpen } from 'lucide-react';
import { getProgress, spendGemsToUnlock } from '../../lib/progress';

// --- 工具：安全的震动反馈 (兼容 iOS/Android) ---
const vibrate = (pattern = 15) => {
  if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
    try {
      window.navigator.vibrate(pattern);
    } catch (e) {
      // 忽略不支持震动的设备
    }
  }
};

export default function CategoryRoadmap({ roadmap }) {
  const [progress, setProgress] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setProgress(getProgress());
  }, [roadmap?.id]); // 加上可选链，防止 roadmap 为空时报错

  // 如果找不到路线数据，显示 404 或友好提示
  if (!roadmap) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f3f4f6]">
        <h1 className="text-xl font-bold text-gray-500 mb-4">内容还在建设中...</h1>
        <button onClick={() => router.push('/learn')} className="px-6 py-2 bg-blue-500 text-white rounded-full font-bold">返回主页</button>
      </div>
    );
  }

  if (!progress) return <div className="min-h-screen bg-[#f3f4f6] animate-pulse" />;

  return (
    <div className="min-h-screen bg-[#f3f4f6] pb-32 font-sans overflow-x-hidden selection:bg-transparent">
      
      {/* --- 1. 顶部状态栏 (合并了大标题、连击、钻石) --- */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b-2 border-[#e5e5e5] h-14 z-50 flex items-center justify-between px-3 shadow-sm">
        
        {/* 左侧：返回按钮 */}
        <button 
          onClick={() => { vibrate(10); router.push('/learn'); }} 
          className="p-2 text-gray-400 hover:text-gray-600 active:scale-90 transition-transform"
        >
          <ChevronLeft size={28} strokeWidth={3} />
        </button>
        
        {/* 中间：大标题挪到这里！ */}
        <h1 className="flex-1 text-center text-[16px] font-black text-[#4b4b4b] tracking-wider truncate px-2">
          {roadmap.title}
        </h1>

        {/* 右侧：火苗和钻石数据 */}
        <div className="flex gap-2">
          <div className="flex items-center gap-1 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100">
            <Flame className="text-orange-500 fill-orange-500" size={16} />
            <span className="font-black text-orange-500 text-[13px]">{progress.streak}</span>
          </div>
          <div className="flex items-center gap-1 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
            <Diamond className="text-blue-500 fill-blue-500" size={16} />
            <span className="font-black text-blue-500 text-[13px]">{progress.gems}</span>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto relative pt-8">
        {roadmap.units.map((unit, unitIdx) => {
          // 计算进度
          const totalLessons = unit.lessons.length;
          const completedLessons = unit.lessons.filter(l => progress.completedLessons.includes(l.id)).length;
          const progressPercent = Math.round((completedLessons / totalLessons) * 100);
          
          // 判断整个单元是否锁定
          const isUnitLocked = !progress.unlockedLessons.includes(unit.lessons[0].id);

          return (
            <section key={unit.id} className="mb-14">
              
              {/* --- 2. 单元横幅 (加了 px-6 让横幅变窄，更像悬浮卡片) --- */}
              <div className="sticky top-[70px] z-40 mb-10 px-6">
                <div className="relative bg-[#58cc02] rounded-3xl p-4 text-white shadow-[0_6px_0_0_#46a302] transition-transform">
                  <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/10 rounded-t-3xl pointer-events-none" />
                  
                  <div className="relative z-10 flex justify-between items-center mb-3">
                    <div>
                      <h3 className="text-[11px] font-black uppercase opacity-90 tracking-widest text-green-100 mb-0.5">
                        单元 {unitIdx + 1}
                      </h3>
                      <h2 className="text-[18px] font-black leading-tight drop-shadow-sm">
                        {unit.title}
                      </h2>
                    </div>
                    <div className="w-10 h-10 bg-black/10 rounded-2xl flex items-center justify-center">
                      <BookOpen size={20} className="text-white opacity-90" />
                    </div>
                  </div>

                  {/* 进度条指示器 */}
                  <div className="relative z-10">
                    <div className="flex justify-between text-[11px] font-bold text-green-100 mb-1.5">
                      <span className="truncate pr-4">{unit.description}</span>
                      <span className="flex-shrink-0">{completedLessons} / {totalLessons}</span>
                    </div>
                    <div className="h-2 bg-black/15 rounded-full overflow-hidden">
                      <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* --- 3. 蛇形关卡地图 --- */}
              <div className="relative flex flex-col items-center py-2 gap-8">
                
                {/* 粗壮的背景轨道线 */}
                <div className="absolute top-0 bottom-0 left-1/2 w-[16px] -ml-[8px] bg-[#e5e5e5] -z-10 rounded-full shadow-inner" />

                {/* 钻石解锁遮罩层 */}
                {isUnitLocked && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#f3f4f6]/40 backdrop-blur-[1px] pt-10">
                     <button 
                       onClick={() => {
                         vibrate([15, 30, 15]);
                         if(spendGemsToUnlock(unit.lessons[0].id, 100)) {
                           setProgress(getProgress());
                         } else {
                           alert("钻石不足，快去前面的关卡赚取吧！");
                         }
                       }}
                       className="bg-white border-2 border-[#e5e5e5] shadow-sm text-blue-500 font-black px-6 py-3 rounded-2xl flex items-center gap-2 active:scale-95 transition-transform"
                     >
                        <Lock size={18} /> 花费 100 💎 提前解锁
                     </button>
                  </div>
                )}

                {unit.lessons.map((lesson, idx) => {
                  const isUnlocked = progress.unlockedLessons.includes(lesson.id);
                  const isCompleted = progress.completedLessons.includes(lesson.id);
                  const isCurrent = isUnlocked && !isCompleted;
                  const isLocked = !isUnlocked;
                  
                  const xOffsets = [0, -38, -65, -38, 0, 38, 65, 38];
                  const xPos = xOffsets[idx % 8];

                  return (
                    <div key={lesson.id} className="relative z-10 my-1" style={{ transform: `translateX(${xPos}px)` }}>
                      
                      {isLocked ? (
                        <div className="flex flex-col items-center opacity-80 scale-95 cursor-not-allowed">
                          <div className="relative w-[70px] h-[70px] rounded-full flex items-center justify-center bg-[#e5e5e5] border-b-[6px] border-[#cfcfcf]">
                            <Lock size={26} className="text-[#afafaf]" strokeWidth={2.5} />
                          </div>
                        </div>
                      ) : (
                        <Link href={`/learn/quiz/${lesson.id}`} onClick={() => vibrate(15)}>
                          <div className="flex flex-col items-center cursor-pointer relative group">
                            
                            {isCurrent && (
                              <div className="absolute inset-0 bg-[#58cc02] rounded-full scale-[1.3] opacity-20 animate-pulse pointer-events-none" />
                            )}

                            <div className={`
                              relative w-[76px] h-[76px] rounded-full flex items-center justify-center 
                              transition-transform duration-100 ease-in-out active:scale-90
                              ${isCompleted ? 'bg-[#ffc800] border-b-[8px] border-[#e5a500]' : 'bg-[#58cc02] border-b-[8px] border-[#46a302]'}
                            `}>
                              <div className="absolute top-1 left-[15%] right-[15%] h-[20%] bg-white/20 rounded-full pointer-events-none" />
                              
                              {isCompleted ? (
                                <Check size={36} className="text-white drop-shadow-sm" strokeWidth={3} />
                              ) : (
                                <Star size={32} className="text-white fill-white drop-shadow-sm" />
                              )}
                              
                              {isCurrent && (
                                <div className="absolute -top-12 bg-white text-[#58cc02] font-black text-[13px] px-4 py-1.5 border-[2.5px] border-[#e5e5e5] rounded-xl shadow-sm whitespace-nowrap z-20">
                                  START
                                  <div className="absolute -bottom-1.5 left-1/2 -ml-2 w-3.5 h-3.5 bg-white border-b-[2.5px] border-r-[2.5px] border-[#e5e5e5] rotate-45" />
                                </div>
                              )}
                            </div>
                            
                            {lesson.title && (
                              <span className="mt-3 font-bold text-[13px] text-[#4b4b4b] bg-white px-2.5 py-0.5 rounded-xl shadow-sm border-2 border-[#e5e5e5]">
                                {lesson.title}
                              </span>
                            )}
                          </div>
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}

// 静态路由生成
export async function getStaticPaths() {
  try {
    const file = path.join(process.cwd(), 'data/categories.json');
    const cats = JSON.parse(fs.readFileSync(file, 'utf8'));
    return { paths: cats.map(c => ({ params: { categoryId: c.id } })), fallback: false };
  } catch (error) {
    return { paths: [], fallback: false };
  }
}

// 防弹版 getStaticProps：找不到文件不报错，直接返回 notFound
export async function getStaticProps({ params }) {
  try {
    const file = path.join(process.cwd(), `data/roadmaps/${params.categoryId}.json`);
    const roadmap = JSON.parse(fs.readFileSync(file, 'utf8'));
    return { props: { roadmap } };
  } catch (error) {
    // 关键修复：如果某个分类的 json 还没写，不会导致构建崩溃！
    return { notFound: true };
  }
}
