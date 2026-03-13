import fs from 'fs';
import path from 'path';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import BottomNav from '../../components/layout/BottomNav';
import { getProgress } from '../../lib/progress';

export default function CategoryPage({ roadmap, allCategories }) {
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    setProgress(getProgress());
  }, [roadmap.id]);

  if (!progress) return null;

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* 顶部状态栏 */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b-2 border-gray-100 p-4 z-40">
        <h1 className="text-center font-black text-xl text-gray-800">{roadmap.title}</h1>
      </div>

      <main className="max-w-md mx-auto pt-8 px-4">
        {roadmap.units.map((unit) => (
          <div key={unit.id} className="mb-12">
            {/* 单元头部卡片 */}
            <div className="bg-green-500 rounded-2xl p-5 text-white shadow-lg border-b-4 border-green-700 mb-10">
              <h2 className="text-xl font-black">{unit.title}</h2>
              <p className="text-sm font-bold opacity-90">掌握基础表达</p>
            </div>

            {/* 关卡节点：蛇形排列 */}
            <div className="flex flex-col items-center gap-10">
              {unit.lessons.map((lesson, idx) => {
                const isUnlocked = progress.unlockedLessons.includes(lesson.id);
                const isCompleted = progress.completedLessons.includes(lesson.id);
                // 左右交错位移
                const xOffset = idx % 2 === 0 ? '-20px' : '20px';

                return (
                  <div key={lesson.id} className="relative" style={{ transform: `translateX(${xOffset})` }}>
                    <Link href={isUnlocked ? `/learn/quiz/${lesson.id}` : '#'}>
                      <button 
                        disabled={!isUnlocked}
                        className={`w-20 h-20 rounded-full border-b-8 transition-all active:translate-y-1 active:border-b-0
                          ${isUnlocked 
                            ? (isCompleted ? 'bg-yellow-400 border-yellow-600' : 'bg-green-500 border-green-600 shadow-xl') 
                            : 'bg-gray-200 border-gray-300 pointer-events-none'}`}
                      >
                        <span className="text-3xl">{isUnlocked ? (isCompleted ? '✅' : '⭐') : '🔒'}</span>
                      </button>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </main>

      {/* 底部导航切换分类 */}
      <BottomNav categories={allCategories} />
    </div>
  );
}

// 静态路径和数据抓取
export async function getStaticPaths() {
  const cats = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/categories.json'), 'utf8'));
  return {
    paths: cats.map(c => ({ params: { categoryId: c.id } })),
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  const allCategories = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/categories.json'), 'utf8'));
  const roadmap = JSON.parse(fs.readFileSync(path.join(process.cwd(), `data/roadmaps/${params.categoryId}.json`), 'utf8'));
  return { props: { roadmap, allCategories } };
}
