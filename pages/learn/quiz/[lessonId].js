// /pages/learn/quiz/[lessonId].js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import fs from 'fs';
import path from 'path';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { completeLesson } from '../../../lib/progress';

// 🔥 强制取消 SSR，防止任何浏览器专属对象导致服务端报错
const XuanZeTi = dynamic(() => import('../../../components/quiz/Tixing/XuanZeTi'), { 
  ssr: false,
  loading: () => (
    <div className="flex-1 flex flex-col items-center justify-center h-full">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin mb-4"></div>
      <p className="text-gray-400 font-bold tracking-widest animate-pulse">加载题目引擎...</p>
    </div>
  )
});

// 🌟 接收真实的地图数据 currentRoadmap 和安全的 explicitLessonId
export default function QuizPage({ lessonData, currentRoadmap, explicitLessonId }) {
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

  if (!mainQueue.length) return <div className="min-h-screen bg-white" />;

  const isDoingWrongQueue = currentIndex >= mainQueue.length;
  const currentQuestion = isDoingWrongQueue 
    ? wrongQueue[currentIndex - mainQueue.length] 
    : mainQueue[currentIndex];

  const totalSteps = mainQueue.length + wrongQueue.length;
  const progressPercent = Math.max(5, (currentIndex / totalSteps) * 100);

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
    
    // 🌟 终极修复：传入真实的地图 currentRoadmap 和绝对 ID
    // 这样 progress.js 就能在地图里找到下一关并解锁了！
    completeLesson(explicitLessonId, resultStats, currentRoadmap); 
  };

  // 结算通关界面
  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center h-[100dvh] bg-white p-6 text-center">
        <h1 className="text-6xl mb-6 animate-bounce">🎉</h1>
        <h2 className="text-3xl font-black text-green-500 mb-2">太棒了！</h2>
        <p className="text-gray-500 font-bold mb-10 text-lg">你完成了本节课，错误次数：{stats.mistakes}</p>
        <button 
          onClick={() => router.replace('/learn')}
          className="w-full max-w-sm bg-green-500 text-white py-4 rounded-2xl font-black text-lg shadow-[0_6px_0_0_#46a302] active:translate-y-1 active:shadow-[0_2px_0_0_#46a302] transition-all"
        >
          继续
        </button>
      </div>
    );
  }

  // --- 极致全屏沉浸式 UI ---
  return (
    <div className="flex flex-col h-[100dvh] bg-white overflow-hidden relative selection:bg-transparent">
      
      {/* 1. 顶部进度条 (去掉了返回键，彻底全屏居中) */}
      <div className="pt-8 pb-4 px-6 flex items-center justify-center shrink-0">
        <div className="flex-1 max-w-lg h-4 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${progressPercent}%` }} 
          />
        </div>
      </div>

      {/* 错题重做提示 */}
      {isDoingWrongQueue && (
         <div className="text-center text-red-500 font-black text-sm pb-2 animate-pulse shrink-0">
           ⚠️ 强化练习：重做错题
         </div>
      )}

      {/* 2. 连击特效 (悬浮在最上层) */}
      <AnimatePresence>
        {combo >= 3 && (
          <motion.div
            key="combo"
            initial={{ opacity: 0, y: 50, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1.1 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="absolute top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          >
            <div className={`px-6 py-2 rounded-full shadow-lg border-2 flex items-center gap-2 ${combo >= 5 ? 'bg-purple-100 border-purple-500' : 'bg-orange-100 border-orange-500'}`}>
              <span className="text-2xl">{combo >= 5 ? '🦄' : '🔥'}</span>
              <span className={`font-black italic text-lg ${combo >= 5 ? 'text-purple-600' : 'text-orange-600'}`}>
                {combo} 连击！
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. 核心题目区域 (自动填满剩余屏幕高度) */}
      <div className="flex-1 relative w-full max-w-lg mx-auto overflow-hidden">
        <XuanZeTi 
          key={`${currentQuestion?.id || 'q'}-${currentIndex}`} // 🌟 终极防错位修复：加入绝对唯一的 key！
          data={currentQuestion} 
          onCorrect={handleCorrect}
          onWrong={handleWrong}
          onNext={handleNext}
          triggerAI={async (params) => {
            console.log("AI解析请求:", params);
          }}
        />
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  const lessonsDir = path.join(process.cwd(), 'data/lessons');
  if (!fs.existsSync(lessonsDir)) return { paths: [], fallback: false };
  const filenames = fs.readdirSync(lessonsDir);
  const paths = filenames
    .filter(name => name.endsWith('.json'))
    .map(name => ({ params: { lessonId: name.replace('.json', '') } }));
  return { paths, fallback: false };
}

// 🌟 终极修复：找出这张图的真实数据并传给页面
export async function getStaticProps({ params }) {
  const lessonId = params.lessonId;
  try {
    const filePath = path.join(process.cwd(), 'data/lessons', `${lessonId}.json`);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const lessonData = JSON.parse(fileContents);

    // 去 roadmaps 文件夹里找这关属于哪张图
    const roadmapsDir = path.join(process.cwd(), 'data/roadmaps');
    let currentRoadmap = { units: [] }; 
    if (fs.existsSync(roadmapsDir)) {
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
    }

    return { 
      props: { 
        lessonData,
        currentRoadmap,      // 传给页面真实地图
        explicitLessonId: lessonId // 传给页面真实ID
      } 
    };
  } catch (e) {
    return { notFound: true };
  }
}
