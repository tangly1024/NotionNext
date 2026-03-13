import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import fs from 'fs';
import path from 'path';
import XuanZeTi from '../../../components/quiz/Tixing/XuanZeTi';
import { completeLesson, getProgress } from '../../../lib/progress';

export default function QuizPage({ lessonData }) {
  const router = useRouter();
  
  // 1. 状态管理
  const [mainQueue, setMainQueue] = useState([]);
  const [wrongQueue, setWrongQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [stats, setStats] = useState({ totalInitial: 0, mistakes: 0 });

  // 2. 初始化数据
  useEffect(() => {
    if (lessonData && lessonData.questions) {
      setMainQueue(lessonData.questions);
      setStats({ totalInitial: lessonData.questions.length, mistakes: 0 });
    }
  }, [lessonData]);

  if (!mainQueue.length) return <div className="p-10 text-center">加载题目中...</div>;

  // 3. 计算当前题目
  const isDoingWrongQueue = currentIndex >= mainQueue.length;
  const currentQuestion = isDoingWrongQueue 
    ? wrongQueue[currentIndex - mainQueue.length] 
    : mainQueue[currentIndex];

  const totalSteps = mainQueue.length + wrongQueue.length;
  const progressPercent = (currentIndex / totalSteps) * 100;

  // 4. 事件处理函数 (对接你的 XuanZeTi 组件)
  const handleCorrect = () => {
    // 答对了，不做额外操作
  };

  const handleWrong = () => {
    // 答错了，记录错误并加入错题队列
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
    
    // 计算结果
    const accuracy = ((stats.totalInitial - stats.mistakes) / stats.totalInitial) * 100;
    const resultStats = {
      completedAt: Date.now(),
      accuracy: accuracy,
      stars: accuracy === 100 ? 3 : accuracy >= 80 ? 2 : 1
    };

    // 保存进度
    // 注意：这里需要传入你当前的 roadmap 数据来解锁下一关，或者简化逻辑
    completeLesson(lessonData.id, resultStats, { units: [] }); 
  };

  // 5. 完成界面
  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <h1 className="text-5xl mb-6">🎉</h1>
        <h2 className="text-3xl font-black text-green-500 mb-2">通关完成！</h2>
        <p className="text-gray-500 font-bold mb-8">错误次数：{stats.mistakes}</p>
        <button 
          onClick={() => router.back()}
          className="w-full max-w-xs bg-green-500 text-white py-4 rounded-2xl font-black shadow-lg border-b-4 border-green-700 active:border-b-0 transition-all"
        >
          返回路线图
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 顶部进度条 */}
      <div className="fixed top-8 left-0 right-0 px-6 z-50 flex items-center gap-4">
        <button onClick={() => router.back()} className="text-gray-400 text-2xl font-bold">✕</button>
        <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden border border-gray-100">
          <div 
            className="h-full bg-green-500 transition-all duration-500" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="pt-10">
        {isDoingWrongQueue && (
           <div className="text-center text-red-500 font-black text-sm pt-4 animate-pulse">
             ⚠️ 强化练习：重做错题
           </div>
        )}

        {/* 渲染题目：直接使用你的 XuanZeTi */}
        <XuanZeTi 
          data={currentQuestion} 
          onCorrect={handleCorrect}
          onWrong={handleWrong}
          onNext={handleNext}
          triggerAI={async (params) => {
            console.log("AI分析请求:", params);
            // 这里以后接 API
          }}
        />
      </div>
    </div>
  );
}

// --- 静态逻辑：修复了之前的 ... 占位符错误 ---

export async function getStaticPaths() {
  const lessonsDir = path.join(process.cwd(), 'data/lessons');
  // 确保目录存在
  if (!fs.existsSync(lessonsDir)) {
    return { paths: [], fallback: false };
  }
  
  const filenames = fs.readdirSync(lessonsDir);
  const paths = filenames
    .filter(name => name.endsWith('.json'))
    .map(name => ({
      params: { lessonId: name.replace('.json', '') }
    }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const filePath = path.join(process.cwd(), 'data/lessons', `${params.lessonId}.json`);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const lessonData = JSON.parse(fileContents);

  return {
    props: {
      lessonData
    }
  };
}
