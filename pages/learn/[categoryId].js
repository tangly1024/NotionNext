// /pages/learn/[categoryId].js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { getProgress } from '../../lib/progress';

// 顶部状态栏组件 (纯粹的多邻国风格：国旗、连击、钻石)
const StatusBar = () => (
  <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b-2 border-[#e5e5e5] h-14 z-50 flex items-center justify-between px-5 shadow-sm">
    <div className="w-8 h-6 rounded bg-gray-200 overflow-hidden flex-shrink-0 border-2 border-[#e5e5e5]">
      {/* 替换成你真实的国旗图片 */}
      <div className="w-full h-full bg-red-500 flex items-center justify-center text-[10px] text-white font-black">MM</div>
    </div>
    
    <div className="flex items-center gap-1 font-black text-orange-500">
      <span className="text-xl">🔥</span> 
      <span className="text-lg">1</span>
    </div>
    
    <div className="flex items-center gap-1 font-black text-blue-500">
      <span className="text-xl">💎</span> 
      <span className="text-lg">800</span>
    </div>
  </header>
);

export default function CategoryRoadmap({ roadmap }) {
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    setProgress(getProgress());
  }, [roadmap.id]);

  if (!progress) return <div className="min-h-screen bg-[#f3f4f6] animate-pulse" />;

  return (
    <div className="min-h-screen bg-[#f3f4f6] pb-32 font-sans overflow-x-hidden selection:bg-transparent">
      
      <StatusBar />

      <main className="max-w-md mx-auto relative pt-6 px-4">
        
        {/* 页面大标题 (可选，如果不想要可以删掉，多邻国通常只有单元标题) */}
        <div className="text-center mb-8">
           <h1 className="text-2xl font-black text-[#4b4b4b] uppercase tracking-wider">{roadmap.title}</h1>
        </div>

        {roadmap.units.map((unit, unitIdx) => (
          <section key={unit.id} className="mb-14">
            
            {/* --- 极致还原的 3D 单元横幅 --- */}
            <div className="sticky top-[70px] z-40 mb-10">
              <div className="relative bg-[#58cc02] rounded-2xl p-5 text-white shadow-[0_6px_0_0_#46a302] active:translate-y-1 active:shadow-[0_2px_0_0_#46a302] transition-all cursor-pointer overflow-hidden group">
                {/* 内部高光遮罩，增加立体感 */}
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/10 rounded-t-2xl pointer-events-none" />
                
                <div className="relative z-10 flex justify-between items-center">
                  <div>
                    <h3 className="text-[12px] font-black uppercase opacity-90 tracking-widest mb-1 text-green-100">
                      单元 {unitIdx + 1}
                    </h3>
                    <h2 className="text-[22px] font-black leading-tight drop-shadow-sm">
                      {unit.title}
                    </h2>
                    <p className="font-bold opacity-90 text-[14px] mt-1 text-green-50">
                      {unit.description}
                    </p>
                  </div>
                  {/* 右侧的图标装饰 (类似多邻国的笔记本) */}
                  <div className="w-12 h-12 bg-black/10 rounded-xl flex items-center justify-center group-hover:bg-black/20 transition-colors">
                    <span className="text-2xl opacity-90">📖</span>
                  </div>
                </div>
              </div>
            </div>

            {/* --- 蛇形关卡地图 --- */}
            <div className="relative flex flex-col items-center py-4 gap-6">
              
              {/* 贯穿的背景连线 (加粗，更有质感) */}
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
