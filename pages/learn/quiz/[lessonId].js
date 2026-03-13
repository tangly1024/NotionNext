// /pages/learn/quiz/[lessonId].js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import fs from 'fs';
import path from 'path';
import { completeLesson } from '../../../lib/progress';
import { motion, AnimatePresence } from 'framer-motion'; 

import dynamic from 'next/dynamic';
const XuanZeTi = dynamic(() => import('../../../components/quiz/Tixing/XuanZeTi'), { 
  ssr: false, 
  loading: () => <div className="flex justify-center mt-32 text-gray-400 font-bold animate-pulse text-lg tracking-widest">引擎启动中...</div>
});

export default function QuizPage({ lessonData, currentRoadmap }) { 
  const router = useRouter();
  
  const [mainQueue, setMainQueue] = useState([]);
  const [wrongQueue, setWrongQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [stats, setStats] = useState({ totalInitial: 0, mistakes: 0 });
  
  const [combo, setCombo] = useState(0);

  useEffect(() => {
    if (lessonData && lessonData.questions) {
      setMainQueue(lessonData.questions);
      setStats({ totalInitial: lessonData.questions.length, mistakes: 0 });
    }
  }, [lessonData]);

  if (!mainQueue.length) return <div className="p-10 text-center font-bold text-gray-500">加载题目中...</div>;

  const isDoingWrongQueue = currentIndex >= mainQueue.length;
  const currentQuestion = isDoingWrongQueue 
    ? wrongQueue[currentIndex - mainQueue.length] 
    : mainQueue[currentIndex];

  const totalSteps = mainQueue.length + wrongQueue.length;
  const progressPercent = (currentIndex / totalSteps) * 100;

  const handleCorrect = () => {
    setCombo(prev => prev + 1);
  };

  const handleWrong = () => {
    setCombo(0); 
    if (!isDoingWrongQueue) {
      setStats(prev => ({ ...prev, mistakes: prev.mistakes + 1 }));
    }
    setWrongQueue(prev => [...prev, currentQuestion]);
  };

  const handleNext = () => {
    const nextIdx = currentIndex + 1;
    if (nextIdx >= totalSteps) {
      finishLesson();
    } else {
      setCurrentIndex(nextIdx);
    }
  };

  const finishLesson = () => {
    setIsFinished(true);
    const accuracy = ((stats.totalInitial - stats.mistakes) / stats.totalInitial) * 100;
    const resultStats = {
      completedAt: Date.now(),
      accuracy: accuracy,
      stars: accuracy === 100 ? 3 : accuracy >= 80 ? 2 : 1
    };
    
    completeLesson(lessonData.id, resultStats, currentRoadmap); 
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-[#f3f4f6]">
        <h1 className="text-6xl mb-6 animate-bounce">🎉</h1>
        <h2 className="text-3xl font-black text-[#58cc02] mb-3 drop-shadow-sm">太棒了，通关成功！</h2>
        <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border-2 border-[#e5e5e5] mb-10 w-full max-w-xs">
           <p className="text-gray-500 font-bold mb-2">本次错误次数：<span className="text-red-500 text-lg">{stats.mistakes}</span></p>
           <p className="text-gray-500 font-bold">获得奖励：<span className="text-blue-500 text-lg">💎 +15</span></p>
        </div>
        
        <button 
          onClick={() => router.back()}
          className="w-full max-w-xs bg-[#58cc02] text-white py-4 rounded-2xl font-black text-lg shadow-[0_6px_0_0_#46a302] active:translate-y-1 active:shadow-[0_2px_0_0_#46a302] transition-all uppercase tracking-widest"
        >
          继续前进
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      
      {/* 🌟 修复：更精致、更细的进度条，以及更轻量的退出按钮 */}
      <div className="fixed top-6 left-0 right-0 px-4 z-50 flex items-center gap-3">
        <button onClick={() => router.back()} className="text-[#cfcfcf] hover:text-gray-400 active:scale-90 transition-transform p-1">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
        {/* 进度条变细为 h-2.5 */}
        <div className="flex-1 h-2.5 bg-[#e5e5e5] rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-[#58cc02] rounded-full" 
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }} 
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          />
        </div>
      </div>

      <AnimatePresence>
        {combo >= 3 && ( 
          <motion.div
            key="combo-popup"
            initial={{ opacity: 0, y: 50, scale: 0.5, rotate: -5 }}
            animate={{ opacity: 1, y: 0, scale: 1.1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-40 pointer-events-none"
          >
            <div className={`
              px-6 py-1.5 rounded-2xl shadow-lg border-b-[3px] flex items-center gap-2
              ${combo >= 10 ? 'bg-[#ce82ff] border-[#a559d9]' : 'bg-[#ff9600] border-[#d97706]'}
            `}>
              <span className="text-xl drop-shadow-md">{combo >= 10 ? '🦄' : '🔥'}</span>
              <span className="text-white font-black text-lg italic tracking-wider drop-shadow-sm">
                {combo} 连击！
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-20 pb-10">
        {isDoingWrongQueue && (
          <div className="text-center font-black text-[#ff4b4b] text-sm animate-pulse mb-2 tracking-widest uppercase">
            ⚠️ 错题强化训练
          </div>
        )}
        
        {/* 🌟 核心修复：加入了 key={currentIndex}，彻底解决选项画面错乱 Bug！ */}
        <XuanZeTi 
          key={currentIndex}
          data={currentQuestion} 
          onCorrect={handleCorrect}
          onWrong={handleWrong}
          onNext={handleNext}
        />
      </div>
    </div>
  );
}

// ... 静态路由逻辑保持完全不变 ...
export async function getStaticPaths() {
  const lessonsDir = path.join(process.cwd(), 'data/lessons');
  if (!fs.existsSync(lessonsDir)) {
    return { paths: [], fallback: false };
  }
  const filenames = fs.readdirSync(lessonsDir).filter(name => name.endsWith('.json'));
  const paths = filenames.map(name => ({
    params: { lessonId: name.replace('.json', '') }
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const lessonId = params.lessonId;
  const filePath = path.join(process.cwd(), 'data/lessons', `${lessonId}.json`);
  let lessonData = null;
  
  try {
    lessonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    return { notFound: true }; 
  }

  const roadmapsDir = path.join(process.cwd(), 'data/roadmaps');
  let currentRoadmap = { units: [] }; 
  
  try {
    const roadmapFiles = fs.readdirSync(roadmapsDir).filter(f => f.endsWith('.json'));
    for (const file of roadmapFiles) {
      const roadmapData = JSON.parse(fs.readFileSync(path.join(roadmapsDir, file), 'utf8'));
      
      let found = false;
      if (roadmapData.units) {
        for (const unit of roadmapData.units) {
          if (unit.lessons && unit.lessons.some(l => l.id === lessonId)) {
            found = true;
            break;
          }
        }
      }
      
      if (found) {
        currentRoadmap = roadmapData; 
        break;
      }
    }
  } catch (e) {
  }

  return {
    props: {
      lessonData,
      currentRoadmap 
    }
  };
}
