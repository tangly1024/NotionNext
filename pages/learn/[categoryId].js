// /pages/learn/[categoryId].js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import fs from 'fs';
import path from 'path';
import { ChevronLeft } from 'lucide-react';
import { getProgress } from '../../lib/progress';

export default function CategoryRoadmap({ roadmap }) {
  const [progress, setProgress] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setProgress(getProgress());
  }, [roadmap.id]);

  if (!progress) return <div className="min-h-screen bg-[#f3f4f6] animate-pulse" />;

  return (
    <div className="min-h-screen bg-[#f3f4f6] pb-32 font-sans overflow-x-hidden selection:bg-transparent">
      
      {/* --- 1. 顶部面板：带有返回键和居中的大分类标题 --- */}
      <header className="sticky top-0 bg-[#f3f4f6]/95 backdrop-blur-md h-14 z-50 flex items-center justify-between px-4">
        {/* 左侧返回键 */}
        <button 
          onClick={() => router.push('/learn')}
          className="p-2 -ml-2 text-gray-400 hover:text-gray-600 active:scale-90 transition-transform"
        >
          <ChevronLeft size={30} strokeWidth={3} />
        </button>
        
        {/* 中间大标题 */}
        <h1 className="flex-1 text-center text-[17px] font-black text-[#4b4b4b] tracking-wide">
          {roadmap.title}
        </h1>
        
        {/* 右侧占位（为了让标题绝对居中） */}
        <div className="w-10"></div>
      </header>

      <main className="max-w-md mx-auto relative pt-4 px-4">
        {roadmap.units.map((unit, unitIdx) => (
          <section key={unit.id} className="mb-8">
            
            {/* --- 2. 极致还原图中的实线文字分割线 --- */}
            <div className="flex items-center justify-center w-full mb-8 mt-2 z-20">
              <div className="h-[2px] flex-1 bg-[#e5e5e5]"></div>
              <span className="px-4 text-[15px] font-black text-gray-400 text-center tracking-wide">
                {unit.description || unit.title}
              </span>
              <div className="h-[2px] flex-1 bg-[#e5e5e5]"></div>
            </div>

            {/* --- 3. 蛇形关卡地图 (保持你原有完美的逻辑不变) --- */}
            <div className="relative flex flex-col items-center py-2 gap-7">
              
              {/* 贯穿的背景连线 (垂直灰线) */}
              <div className="absolute top-0 bottom-0 left-1/2 w-[14px] -ml-[7px] bg-[#e5e5e5] -z-10 rounded-full shadow-inner" />

              {unit.lessons.map((lesson, idx) => {
                const isUnlocked = progress.unlockedLessons.includes(lesson.id);
                const isCompleted = progress.completedLessons.includes(lesson.id);
                const isCurrent = isUnlocked && !isCompleted;
                const isLocked = !isUnlocked; 
                
                // 更平滑的曲线偏移 (类似正弦波)
                const xOffsets = [0, -38, -65, -38, 0, 38, 65, 38];
                const xPos = xOffsets[idx % 8];

                // 节点颜色定义
                let nodeClasses = "";
                let icon = "";
                
                if (isLocked) { // 锁定：灰色石头质感
                  nodeClasses = "bg-[#e5e5e5] border-b-[8px] border-[#cfcfcf]";
                  icon = "🔒";
                } else if (isCompleted) { // 完成：金色奖杯/皇冠质感
                  nodeClasses = "bg-[#ffc800] border-b-[8px] border-[#e5a500]";
                  icon = "⭐";
                } else { // 当前：绿色果冻质感
                  nodeClasses = "bg-[#58cc02] border-b-[8px] border-[#46a302]";
                  icon = "🌟";
                }

                return (
                  <div key={lesson.id} className="relative z-10 my-1" style={{ transform: `translateX(${xPos}px)` }}>
                    <Link href={isUnlocked ? `/learn/quiz/${lesson.id}` : '#'}>
                      <div className="flex flex-col items-center cursor-pointer group relative">
                        
                        {/* --- 当前关卡的专属呼吸光环 --- */}
                        {isCurrent && (
                          <div className="absolute inset-0 bg-[#58cc02] rounded-full scale-110 opacity-30 animate-ping pointer-events-none" />
                        )}

                        {/* --- 节点本体 --- */}
                        <div className={`
                          relative w-[76px] h-[76px] rounded-full flex items-center justify-center 
                          transition-transform duration-100 ease-in-out
                          ${isUnlocked ? 'active:scale-90' : ''}
                          ${nodeClasses}
                        `}>
                          {/* 内部高光，增加圆润的 3D 感 */}
                          <div className="absolute top-1 left-[15%] right-[15%] h-[20%] bg-white/20 rounded-full pointer-events-none" />
                          
                          <span className={`text-[32px] ${!isUnlocked && 'opacity-40 grayscale'}`}>
                            {icon}
                          </span>
                          
                          {/* --- 当前关卡的 START 漂浮气泡 --- */}
                          {isCurrent && (
                            <div className="absolute -top-12 bg-white text-[#58cc02] font-black text-[13px] px-4 py-2 border-[2.5px] border-[#e5e5e5] rounded-xl shadow-sm animate-bounce whitespace-nowrap z-20">
                              START
                              {/* 气泡小尾巴 */}
                              <div className="absolute -bottom-2 left-1/2 -ml-2 w-3.5 h-3.5 bg-white border-b-[2.5px] border-r-[2.5px] border-[#e5e5e5] rotate-45" />
                            </div>
                          )}
                        </div>
                        
                        {/* --- 节点下方小标题 --- */}
                        {lesson.title && (
                          <span className={`
                            mt-3 font-black text-[14px] px-2.5 py-1 rounded-lg tracking-wide
                            ${isUnlocked ? 'text-[#4b4b4b] bg-white shadow-sm border-2 border-[#e5e5e5]' : 'text-gray-400 opacity-60'}
                          `}>
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

// 获取分类下的所有路线数据
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
