// /pages/learn/[lesson].js
import fs from 'fs';
import path from 'path';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { completeLesson } from '../../lib/progress';
import QuestionRenderer from '../../components/quiz/QuestionRenderer';
import courseMapData from '../../data/course-map.json';

export default function LessonPage({ lessonData }) {
  const router = useRouter();
  
  // 核心状态
  const [mainQueue, setMainQueue] = useState(lessonData.questions);
  const [wrongQueue, setWrongQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  
  // 统计数据
  const [stats, setStats] = useState({ totalInitial: lessonData.questions.length, mistakes: 0 });

  // 判断当前出哪道题
  const isDoingWrongQueue = currentIndex >= mainQueue.length;
  const currentQuestion = isDoingWrongQueue 
    ? wrongQueue[currentIndex - mainQueue.length] 
    : mainQueue[currentIndex];

  const handleAnswer = (isCorrect) => {
    if (!isCorrect) {
      // 答错：加入错题队列，并记录错误次数
      if (!isDoingWrongQueue) {
        setStats(prev => ({ ...prev, mistakes: prev.mistakes + 1 }));
      }
      setWrongQueue(prev => [...prev, currentQuestion]);
    }

    // 前往下一题
    const nextIndex = currentIndex + 1;
    const totalQuestions = mainQueue.length + wrongQueue.length;

    if (nextIndex >= totalQuestions) {
      finishLesson();
    } else {
      setCurrentIndex(nextIndex);
    }
  };

  const finishLesson = () => {
    setIsFinished(true);
    // 计算准确率
    const accuracy = ((stats.totalInitial - stats.mistakes) / stats.totalInitial) * 100;
    
    const resultStats = {
      completedAt: Date.now(),
      accuracy: accuracy,
      stars: accuracy === 100 ? 3 : accuracy >= 80 ? 2 : 1
    };

    // 保存进度并解锁
    completeLesson(lessonData.id, resultStats, courseMapData);
  };

  if (isFinished) {
    return (
      <div className="max-w-md mx-auto p-8 text-center mt-20">
        <h1 className="text-4xl font-bold text-yellow-500 mb-4">通关完成！</h1>
        <p className="text-xl mb-8">错误次数：{stats.mistakes}</p>
        <button 
          onClick={() => router.push('/learn')}
          className="bg-green-500 text-white px-8 py-3 rounded-2xl border-b-4 border-green-600 font-bold w-full"
        >
          返回路线图
        </button>
      </div>
    );
  }

  // 顶部进度条计算
  const progressPercent = (currentIndex / (mainQueue.length + wrongQueue.length)) * 100;

  return (
    <div className="max-w-md mx-auto p-4 flex flex-col h-screen">
      {/* 进度条 */}
      <div className="w-full bg-gray-200 h-4 rounded-full mb-8 overflow-hidden">
        <div className="bg-green-500 h-full transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
      </div>

      {isDoingWrongQueue && (
        <div className="text-red-500 font-bold mb-4">⚠️ 错题重做环节</div>
      )}

      {/* 题目渲染 */}
      <div className="flex-1">
        <QuestionRenderer question={currentQuestion} onAnswer={handleAnswer} />
      </div>
    </div>
  );
}

// 静态生成路由
export async function getStaticPaths() {
  const dirPath = path.join(process.cwd(), 'data', 'lessons');
  const filenames = fs.readdirSync(dirPath);
  const paths = filenames.map(name => ({
    params: { lesson: name.replace('.json', '') }
  }));
  return { paths, fallback: false };
}

// 读取具体关卡数据
export async function getStaticProps({ params }) {
  const filePath = path.join(process.cwd(), 'data', 'lessons', `${params.lesson}.json`);
  const jsonData = fs.readFileSync(filePath, 'utf8');
  return { props: { lessonData: JSON.parse(jsonData) } };
}
