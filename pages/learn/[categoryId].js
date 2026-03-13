// /pages/learn/[categoryId].js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import fs from 'fs';
import path from 'path';
import { ChevronLeft, Flame, Diamond, Star, Lock, Check, BookOpen } from 'lucide-react';
import { getProgress, spendGemsToUnlock } from '../../lib/progress';

// --- 工具：震动反馈 ---
const vibrate = (pattern = 15) => {
  if (typeof window !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(pattern);
  }
};

export default function CategoryRoadmap({ roadmap }) {
  const [progress, setProgress] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setProgress(getProgress());
  }, [roadmap.id]);

  if (!progress) return <div className="min-h-screen bg-[#f3f4f6]" />;

  return (
    <div className="min-h-screen bg-[#f3f4f6] pb-32 font-sans overflow-x-hidden selection:bg-transparent">
      
      {/* --- 1. 顶部状态栏 (胶囊风格，接入真实数据) --- */}
      <header className="sticky top-0 bg-white/90 backdrop-blur-md border-b-2 border-[#e5e5e5] h-14 z-50 flex items-center justify-between px-4">
        <button 
          onClick={() => { vibrate(10); router.push('/learn'); }} 
          className="p-2 -ml-2 text-gray-400 hover:text-gray-600 active:scale-90 transition-transform"
        >
          <ChevronLeft size={28} strokeWidth={3} />
        </button>
        
        <div className="flex gap-3">
          {/* 火苗胶囊 */}
          <div className="flex items-center gap-1.5 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
            <Flame className="text-orange-500 fill-orange-500" size={18} />
            <span className="font-black text-orange-500 text-sm tracking-wide">{progress.streak}</span>
          </div>
          {/* 钻石胶囊 */}
          <div className="flex items-center gap-1.5 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            <Diamond className="text-blue-500 fill-blue-500" size={18} />
            <span className="font-black text-blue-500 text-sm tracking-wide">{progress.gems}</span>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto relative pt-6">
        
        {/* 大标题 */}
        <h1 className="text-center text-xl font-black text-[#4b4b4b] uppercase tracking-widest mb-8">
          {roadmap.title}
        </h1>

        {roadmap.units.map((unit, unitIdx) => {
          // 计算当前单元的进度
          const totalLessons = unit.lessons.length;
          const completedLessons = unit.lessons.filter(l => progress.completedLessons.includes(l.id)).length;
          const progressPercent = Math.round((completedLessons / totalLessons) * 100);
          
          // 判断整个单元是否被锁定 (只要第一关没解锁，就认为整个单元锁住了)
          const isUnitLocked = !progress.unlockedLessons.includes(unit.lessons[0].id);

          return (
            <section key={unit.id} className="mb-14">
              
              {/* --- 2. 单元横幅 (变窄、加圆角、加进度条) --- */}
              <div className="sticky top-[70px] z-40 mb-10 px-4">
                <div className="relative bg-[#58cc02] rounded-3xl p-5 text-white shadow-[0_6px_0_0_#46a302] transition-transform group">
                  <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/10 rounded-t-3xl pointer-events-none" />
                  
                  <div className="relative z-10 flex justify-between items-center mb-3">
                    <div>
                      <h3 className="text-[12px] font-black uppercase opacity-90 tracking-widest text-green-100 mb-0.5">
                        单元 {unitIdx + 1}
                      </h3>
                      <h2 className="text-[20px] font-black leading-tight drop-shadow-sm">
                        {unit.title}
                      </h2>
                    </div>
                    <div className="w-12 h-12 bg-black/10 rounded-2xl flex items-center justify-center">
                      <BookOpen size={24} className="text-white opacity-90" />
                    </div>
                  </div>

                  {/* 进度条指示器 */}
                  <div className="relative z-10">
                    <div className="flex justify-between text-[11px] font-bold text-green-100 mb-1">
                      <span>{unit.description}</span>
                      <span>{completedLessons} / {totalLessons}</span>
                    </div>
                    <div className="h-2.5 bg-black/15 rounded-full overflow-hidden">
                      <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* --- 3. 蛇形关卡地图 --- */}
              <div className="relative flex flex-col items-center py-2 gap-7">
                
                {/* 粗壮的背景轨道线 */}
                <div className="absolute top-0 bottom-0 left-1/2 w-[16px] -ml-[8px] bg-[#e5e5e5] -z-10 rounded-full" />

                {/* 单元锁定时的捷径按钮 (消耗钻石) */}
                {isUnitLocked && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#f3f4f6]/60 backdrop-blur-[1px] pt-10">
                     <button 
                       onClick={() => {
                         vibrate([10, 30, 10]);
                         if(spendGemsToUnlock(unit.lessons[0].id, 100)) {
                           setProgress(getProgress()); // 刷新视图
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
                  
                  // 轨道偏移
                  const xOffsets = [0, -35, -60, -35, 0, 35, 60, 35];
                  const xPos = xOffsets[idx % 8];

                  return (
                    <div key={lesson.id} className="relative z-10 my-1" style={{ transform: `translateX(${xPos}px)` }}>
                      
                      {/* 根据锁定状态决定是否使用 Link */}
                      {isLocked ? (
                        // 锁定状态：不可点击的 div
                        <div className="flex flex-col items-center opacity-80 scale-95 cursor-not-allowed">
                          <div className="relative w-[70px] h-[70px] rounded-full flex items-center justify-center bg-[#e5e5e5] border-b-[6px] border-[#cfcfcf]">
                            <Lock size={28} className="text-[#afafaf]" strokeWidth={2.5} />
                          </div>
                        </div>
                      ) : (
                        // 解锁状态：可点击的 Link
                        <Link href={`/learn/quiz/${lesson.id}`} onClick={() => vibrate(15)}>
                          <div className="flex flex-col items-center cursor-pointer relative group">
                            
                            {/* 当前关卡的呼吸光晕 */}
                            {isCurrent && (
                              <div className="absolute inset-0 bg-[#58cc02] rounded-full scale-[1.3] opacity-20 animate-pulse pointer-events-none" />
                            )}

                            {/* 节点本体 */}
                            <div className={`
                              relative w-[76px] h-[76px] rounded-full flex items-center justify-center 
                              transition-transform duration-100 ease-in-out active:scale-90
                              ${isCompleted ? 'bg-[#ffc800] border-b-[8px] border-[#e5a500]' : 'bg-[#58cc02] border-b-[8px] border-[#46a302]'}
                            `}>
                              {/* 3D高光 */}
                              <div className="absolute top-1 left-[15%] right-[15%] h-[20%] bg-white/20 rounded-full pointer-events-none" />
                              
                              {/* 动态图标 */}
                              {isCompleted ? (
                                <Check size={36} className="text-white drop-shadow-sm" strokeWidth={3} />
                              ) : (
                                <Star size={32} className="text-white fill-white drop-shadow-sm" />
                              )}
                              
                              {/* 当前关卡的漂浮气泡 */}
                              {isCurrent && (
                                <div className="absolute -top-12 bg-white text-[#58cc02] font-black text-[12px] px-3 py-1.5 border-[2px] border-[#e5e5e5] rounded-xl shadow-sm whitespace-nowrap z-20">
                                  START
                                  <div className="absolute -bottom-1.5 left-1/2 -ml-1.5 w-2.5 h-2.5 bg-white border-b-[2px] border-r-[2px] border-[#e5e5e5] rotate-45" />
                                </div>
                              )}
                            </div>
                            
                            {/* 节点下方小标题 */}
                            {lesson.title && (
                              <span className="mt-2.5 font-bold text-[13px] text-[#4b4b4b] bg-white px-2.5 py-0.5 rounded-lg shadow-sm border border-[#e5e5e5]">
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
  const file = path.join(process.cwd(), 'data/categories.json');
  const cats = JSON.parse(fs.readFileSync(file, 'utf8'));
  return { paths: cats.map(c => ({ params: { categoryId: c.id } })), fallback: false };
}

export async function getStaticProps({ params }) {
  const file = path.join(process.cwd(), `data/roadmaps/${params.categoryId}.json`);
  const roadmap = JSON.parse(fs.readFileSync(file, 'utf8'));
  return { props: { roadmap } };
}
