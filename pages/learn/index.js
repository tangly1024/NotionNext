// /pages/learn/index.js
import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getProgress } from '../../lib/progress';

export default function LearnMap({ courseMap }) {
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    // 客户端挂载后读取进度，避免服务端水合报错
    setProgress(getProgress());
  }, []);

  if (!progress) return <div>加载中...</div>;

  return (
    <div className="max-w-md mx-auto p-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-8">{courseMap.title}</h1>

      {courseMap.units.map(unit => (
        <div key={unit.id} className="w-full mb-12 flex flex-col items-center">
          <h2 className="text-xl font-bold bg-green-500 text-white w-full p-4 rounded-xl text-center mb-6">
            {unit.title}
          </h2>
          
          <div className="flex flex-col gap-6 items-center relative">
            {/* 绘制节点 */}
            {unit.lessons.map((lesson, index) => {
              const isCompleted = progress.completedLessons.includes(lesson.id);
              const isUnlocked = progress.unlockedLessons.includes(lesson.id);
              
              // 让节点左右交替出现（类似多邻国的蛇形路线）
              const offsetClass = index % 2 === 0 ? '-ml-12' : 'ml-12';

              return (
                <div key={lesson.id} className={`relative z-10 ${offsetClass}`}>
                  {isUnlocked ? (
                    <Link href={`/learn/${lesson.id}`}>
                      <button className={`w-20 h-20 rounded-full border-b-4 font-bold text-white transition-transform active:translate-y-1 ${
                        isCompleted ? 'bg-yellow-400 border-yellow-500' : 'bg-green-500 border-green-600'
                      }`}>
                        {isCompleted ? '✔' : '⭐'}
                      </button>
                    </Link>
                  ) : (
                    <button disabled className="w-20 h-20 rounded-full bg-gray-300 border-b-4 border-gray-400 text-gray-500 cursor-not-allowed">
                      🔒
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// 构建时读取数据
export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'data', 'course-map.json');
  const jsonData = fs.readFileSync(filePath, 'utf8');
  return { props: { courseMap: JSON.parse(jsonData) } };
              }
