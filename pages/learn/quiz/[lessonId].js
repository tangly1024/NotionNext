import { useState } from 'react';
import { useRouter } from 'next/router';
import fs from 'fs';
import path from 'path';
import XuanZeTi from '../../../components/quiz/Tixing/XuanZeTi'; // 你提供的代码
import { completeLesson } from '../../../lib/progress';

export default function QuizEngine({ lessonData }) {
  const router = useRouter();
  
  // 核心队列：题目数组
  const [mainQueue, setMainQueue] = useState(lessonData.questions);
  // 错题队列：答错的题会存入这里
  const [wrongQueue, setWrongQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // 获取当前正在展示哪道题
  const isDoingWrongQueue = currentIndex >= mainQueue.length;
  const currentQuestion = isDoingWrongQueue 
    ? wrongQueue[currentIndex - mainQueue.length] 
    : mainQueue[currentIndex];

  // 计算进度条：(当前完成数 / 总题目数)
  // 注意：总题目数会随着答错而动态增加，这非常多邻国！
  const totalSteps = mainQueue.length + wrongQueue.length;
  const progress = (currentIndex / totalSteps) * 100;

  const handleCorrect = () => {
    // 答对了，不用做特殊处理，handleNext 会切题
  };

  const handleWrong = () => {
    // 答错了：把当前这道题复制一份，丢进错题队列
    setWrongQueue(prev => [...prev, currentQuestion]);
  };

  const handleNext = () => {
    const nextIdx = currentIndex + 1;
    if (nextIdx >= totalSteps) {
      finishQuiz();
    } else {
      setCurrentIndex(nextIdx);
    }
  };

  const finishQuiz = () => {
    setIsFinished(true);
    // 保存进度并返回
    completeLesson(lessonData.id, { completed: true }, {});
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
        <h1 className="text-5xl mb-4">🎉</h1>
        <h2 className="text-3xl font-black text-green-500 mb-8">练习完成！</h2>
        <button 
          onClick={() => router.back()}
          className="w-full max-w-xs bg-green-500 text-white py-4 rounded-2xl font-black border-b-4 border-green-700 active:border-b-0"
        >
          继续
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white">
      {/* 顶部进度条 */}
      <div className="fixed top-10 left-0 right-0 px-6 z-50">
        <div className="h-4 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
          <div 
            className="h-full bg-green-500 transition-all duration-500" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 你的高级选择题组件 */}
      <XuanZeTi 
        data={currentQuestion} 
        onCorrect={handleCorrect}
        onWrong={handleWrong}
        onNext={handleNext}
        triggerAI={async (params) => {
          console.log("Asking AI...", params);
          // 在这里对接你的 AI 解析 API
        }}
      />
    </div>
  );
}

// 静态获取数据逻辑 (与之前一致)
export async function getStaticPaths() { ... }
export async function getStaticProps({ params }) { ... }
