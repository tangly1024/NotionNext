// /pages/learn/quiz/[lessonId].js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import fs from 'fs';
import path from 'path';
import { completeLesson } from '../../../lib/progress';
import { motion, AnimatePresence } from 'framer-motion'; 

// 🔥 防爆修复：使用 dynamic import 取消 SSR，避开 canvas-confetti 在服务端的报错！
import dynamic from 'next/dynamic';
const XuanZeTi = dynamic(() => import('../../../components/quiz/Tixing/XuanZeTi'), { 
  ssr: false, 
  loading: () => <div className="flex justify-center mt-32 text-gray-400 font-bold animate-pulse text-lg tracking-widest">引擎启动中...</div>
});

export default function QuizPage({ lessonData, currentRoadmap }) { // 🌟 接收到了真实的地图数据
  const router = useRouter();
  
  const [mainQueue, setMainQueue] = useState([]);
  const [wrongQueue, setWrongQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [stats, setStats] = useState({ totalInitial: 0, mistakes: 0 });
  
  // 🌟 连击状态
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

  // 🌟 答对：增加连击
  const handleCorrect = () => {
    setCombo(prev => prev + 1);
  };

  // 🌟 答错：连击清零，加入错题本
  const handleWrong = () => {
    setCombo(0); // 连击断了
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
    
    // 🌟 核心修复：传入真实的 currentRoadmap 地图，progress.js 终于知道下一关是谁了！
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
      
      {/* 顶部进度条 (多邻国经典绿条) */}
      <div className="fixed top-8 left-0 right-0 px-5 z-50 flex items-center gap-4">
        <button onClick={() => router.back()} className="text-[#afafaf] hover:text-gray-500 active:scale-90 transition-transform text-2xl font-black">
          ✕
        </button>
        <div className="flex-1 h-4 bg-[#e5e5e5] rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-[#58cc02] rounded-full" 
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }} 
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          />
        </div>
      </div>

      {/* 🌟 核心特效：超燃连击弹出动画！(3连击出现，10连击变紫变独角兽) */}
      <AnimatePresence>
        {combo >= 3 && ( 
          <motion.div
            key="combo-popup"
            initial={{ opacity: 0, y: 50, scale: 0.5, rotate: -5 }}
            animate={{ opacity: 1, y: 0, scale: 1.1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-40 pointer-events-none"
          >
            <div className={`
              px-6 py-2 rounded-2xl shadow-lg border-b-[4px] flex items-center gap-2
              ${combo >= 10 ? 'bg-[#ce82ff] border-[#a559d9]' : 'bg-[#ff9600] border-[#d97706]'}
            `}>
              <span className="text-2xl drop-shadow-md">{combo >= 10 ? '🦄' : '🔥'}</span>
              <span className="text-white font-black text-xl italic tracking-wider drop-shadow-sm">
                {combo} 连击！
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-24 pb-10">
        {isDoingWrongQueue && (
          <div className="text-center font-black text-[#ff4b4b] text-sm animate-pulse mb-4 tracking-widest uppercase">
            ⚠️ 错题强化训练
          </div>
        )}
        
        {/* 调用你的核心题库组件 */}
        <XuanZeTi 
          data={currentQuestion} 
          onCorrect={handleCorrect}
          onWrong={handleWrong}
          onNext={handleNext}
        />
      </div>
    </div>
  );
}

// 静态路由生成 (获取所有关卡文件)
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

// 🌟 获取关卡数据，并自动寻找它所在的路线地图！
export async function getStaticProps({ params }) {
  const lessonId = params.lessonId;
  const filePath = path.join(process.cwd(), 'data/lessons', `${lessonId}.json`);
  let lessonData = null;
  
  try {
    lessonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    return { notFound: true }; // 找不到题目时防爆
  }

  // 找出当前关卡属于哪个大分类地图
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
    // 忽略寻找地图的错误
  }

  return {
    props: {
      lessonData,
      currentRoadmap // 把真实地图传给页面组件
    }
  };
}
