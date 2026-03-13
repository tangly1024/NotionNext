// /pages/learn/quiz/[lessonId].js
import { useState, useEffect, useRef } from 'react';
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
      <p className="text-gray-400 font-black tracking-widest animate-pulse">加载题目引擎...</p>
    </div>
  )
});

export default function QuizPage({ lessonData, currentRoadmap, explicitLessonId }) {
  const router = useRouter();

  const [mainQueue, setMainQueue] = useState([]);
  const [wrongQueue, setWrongQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [stats, setStats] = useState({ totalInitial: 0, mistakes: 0 });
  const [combo, setCombo] = useState(0);

  // 连击浮层
  const [comboFlash, setComboFlash] = useState(null);
  const comboTimerRef = useRef(null);

  // 进度条 pulse
  const [progressPulse, setProgressPulse] = useState(false);
  const progressTimerRef = useRef(null);

  // 错误时页面轻 shake
  const [shakeStage, setShakeStage] = useState(0);
  const shakeTimerRef = useRef(null);

  useEffect(() => {
    if (lessonData && lessonData.questions) {
      setMainQueue(lessonData.questions);
      setWrongQueue([]);
      setCurrentIndex(0);
      setIsFinished(false);
      setCombo(0);
      setComboFlash(null);
      setProgressPulse(false);
      setShakeStage(0);
      setStats({ totalInitial: lessonData.questions.length, mistakes: 0 });
    }
  }, [lessonData]);

  useEffect(() => {
    return () => {
      if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
      if (progressTimerRef.current) clearTimeout(progressTimerRef.current);
      if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current);
    };
  }, []);

  if (!mainQueue.length) return <div className="min-h-screen bg-white" />;

  const isDoingWrongQueue = currentIndex >= mainQueue.length;
  const currentQuestion = isDoingWrongQueue
    ? wrongQueue[currentIndex - mainQueue.length]
    : mainQueue[currentIndex];

  const totalSteps = mainQueue.length + wrongQueue.length;
  const progressPercent = Math.max(5, (currentIndex / Math.max(totalSteps, 1)) * 100);

  const accuracy =
    stats.totalInitial > 0
      ? Math.round(((stats.totalInitial - stats.mistakes) / stats.totalInitial) * 100)
      : 0;

  const triggerProgressPulse = () => {
    setProgressPulse(true);
    if (progressTimerRef.current) clearTimeout(progressTimerRef.current);
    progressTimerRef.current = setTimeout(() => {
      setProgressPulse(false);
    }, 420);
  };

  const triggerShake = () => {
    setShakeStage((prev) => prev + 1);
    if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current);
    shakeTimerRef.current = setTimeout(() => {
      setShakeStage(0);
    }, 420);
  };

  const triggerComboBurst = async (nextCombo) => {
    if (typeof window === 'undefined') return;
    if (nextCombo < 5) return;

    try {
      const { default: confetti } = await import('canvas-confetti');
      confetti({
        particleCount: nextCombo >= 8 ? 40 : 24,
        angle: 220,
        spread: nextCombo >= 8 ? 80 : 56,
        startVelocity: 28,
        gravity: 1,
        ticks: 90,
        origin: { x: 0.92, y: 0.08 },
        scalar: nextCombo >= 8 ? 1 : 0.82
      });
    } catch (_) {}
  };

  const showComboEffect = (nextCombo) => {
    if (nextCombo < 3) return;

    if (comboTimerRef.current) clearTimeout(comboTimerRef.current);

    let icon = '🔥';
    let color = 'text-orange-500';

    if (nextCombo >= 8) {
      icon = '🌈';
      color = 'text-pink-500';
    } else if (nextCombo >= 5) {
      icon = '🦄';
      color = 'text-purple-500';
    } else if (nextCombo >= 4) {
      icon = '⚡';
      color = 'text-amber-500';
    }

    setComboFlash({
      combo: nextCombo,
      icon,
      color,
      id: `${Date.now()}-${nextCombo}`
    });

    comboTimerRef.current = setTimeout(() => {
      setComboFlash(null);
    }, 2000);
  };

  const handleCorrect = () => {
    triggerProgressPulse();

    setCombo((prev) => {
      const next = prev + 1;
      showComboEffect(next);
      triggerComboBurst(next);
      return next;
    });
  };

  const handleWrong = () => {
    setCombo(0);
    setComboFlash(null);
    triggerShake();

    if (comboTimerRef.current) clearTimeout(comboTimerRef.current);

    if (!isDoingWrongQueue) {
      setStats((prev) => ({ ...prev, mistakes: prev.mistakes + 1 }));
    }

    // 可重复加入，形成真正强化；如果以后想去重再改
    setWrongQueue((prev) => [...prev, currentQuestion]);
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

    const finalAccuracy =
      stats.totalInitial > 0
        ? ((stats.totalInitial - stats.mistakes) / stats.totalInitial) * 100
        : 0;

    const resultStats = {
      completedAt: Date.now(),
      accuracy: finalAccuracy,
      stars: finalAccuracy === 100 ? 3 : finalAccuracy >= 80 ? 2 : 1
    };

    completeLesson(explicitLessonId, resultStats, currentRoadmap);
  };

  // 通关页
  if (isFinished) {
    const stars = accuracy === 100 ? 3 : accuracy >= 80 ? 2 : 1;
    const praise =
      accuracy === 100
        ? '完美通关！'
        : accuracy >= 80
        ? '做得很棒！'
        : '继续加油！';

    return (
      <div className="flex flex-col items-center justify-center h-[100dvh] bg-white p-6 text-center overflow-hidden relative">
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 16 }}
          className="mb-4"
        >
          <div className="text-6xl">🎉</div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="text-3xl font-black text-green-500 mb-2"
        >
          {praise}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
          className="text-gray-500 font-bold mb-6 text-lg"
        >
          本节课完成，错误次数：{stats.mistakes}
        </motion.p>

        {/* 星级动画 */}
        <div className="flex items-center gap-3 mb-6">
          {[1, 2, 3].map((n) => (
            <motion.div
              key={n}
              initial={{ scale: 0, rotate: -25, opacity: 0 }}
              animate={{
                scale: 1,
                rotate: 0,
                opacity: 1
              }}
              transition={{
                delay: 0.2 + n * 0.12,
                type: 'spring',
                stiffness: 260,
                damping: 14
              }}
              className={`text-5xl ${n <= stars ? '' : 'opacity-25 grayscale'}`}
            >
              ⭐
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full max-w-sm bg-slate-50 rounded-3xl p-5 mb-8 border border-slate-100"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-black text-slate-500">正确率</span>
            <span className="text-2xl font-black text-slate-800">{accuracy}%</span>
          </div>

          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${accuracy}%` }}
              transition={{ delay: 55, duration: 0.7,              className="h-full bg-green-500 rounded-full"
            />
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 18, scale: 0.95 }}
          ,, delay.65 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.replace('/learn')}
          className="w-full max-w-sm bg-green-500 text-white py-4 rounded-2xl font-black text-lg shadow-[0_6px_0_0_#46a302] active:translate-y-1 active:shadow-[0_2px_0_0_#46a302] transition-all"
        >
          继续学习
        </motion.button>
      </div>
    );
  }

  const shakeAnimation =
    shakeStage > 0
      ? {
          x: [0, -8, 8, -6, 6, -3, 3, 0]
        }
      : { x: 0 };

  return (
    <div className="flex flex-col h-[100dvh] bg-white overflow-hidden relative selection:bg-transparent">
      {/* 顶部状态区 */}
      <div className="pt-7 pb-4 px-5 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <motion.div
              animate={progressPulse ? { scale: 1.015 } : { scale: 1 }}
              transition={{ duration: 0.22 }}
              className="w-full"
            >
              <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-green-500 rounded-full"
                  animate={
                    progressPulse
                      ? {
                          width: `${progressPercent}%`,
                          boxShadow: [
                            '0 0 0 rgba(34,197,94,0)',
                            '0 0 14px rgba(34,197,94,0.4)',
                            '0 0 0 rgba(34,197,94,0)'
                          ]
                        }
                      : {
                          width: `${progressPercent}%`,
                          boxShadow: '0 0 0 rgba(0,0,0,0)'
                        }
                  }
                  transition={{
                    width: { duration: 0.45, ease: 'easeOut' },
                    boxShadow: { duration: 0.35 }
                  }}
                />
              </div>
            </motion.div>
          </div>

          <div className="shrink-0 text-xs font-black text-slate-400 min-w-[52px] text-right">
            {currentIndex + 1}/{Math.max(totalSteps, 1)}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="text-[11px] font-black tracking-wide text-slate-400 uppercase">
            {isDoingWrongQueue ? '复习模式' : '练习中'}
          </div>

          <div className="text-[11px] font-black text-slate-400">
            错误 {stats.mistakes} 次
          </div>
        </div>
      </div>

      {/* 错题提示：更像鼓励式 */}
      <AnimatePresence>
        {isDoingWrongQueue && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="text-center text-orange-500 font-black text-sm pb-2 shrink-0"
          >
            再练一次，你快掌握了 ✨
          </motion.div>
        )}
      </AnimatePresence>

      {/* 连击特效：右上角，无背景 */}
      <AnimatePresence mode="wait">
        {comboFlash && (
          <motion.div
            key={comboFlash.id}
            initial={{ opacity: 0, x: 26, y: -10, scale: 0.68, rotate: 8 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, x: 16, y: -8, scale: 0.86 }}
            transition={{ type: 'spring', stiffness: 320, damping: 18 }}
            className="absolute top-4 right-4 z-50 pointer-events-none select-none"
          >
            <div className="relative w-[100px] h-[56px] flex items-center justify-end">
              <div className="relative flex items-center gap-1.5 z-10">
                <motion.span
                  initial={{ scale: 0.7 }}
                  animate={{ scale: [0.82, 1.2, 1] }}
                  transition={{ duration: 0.45 }}
                  className="text-3xl drop-shadow-sm"
                >
                  {comboFlash.icon}
                </motion.span>
                <span className={`font-black italic text-xl tracking-wide ${comboFlash.color}`}>
                  x{comboFlash.combo}
                </span>
              </div>

              {[
                { x: -10, y: -16, d: 0 },
                { x: 10, y: -20, d: 0.03 },
                { x: 24, y: -7, d: 0.06 },
                { x: -14, y: 12, d: 0.09 },
                { x: 12, y: 15, d: 0.12 },
                { x: 28, y: 10, d: 0.15 }
              ].map((p, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, x: 0, y: 0, scale: 0.2 }}
                  animate={{ opacity: [0, 1, 0], x: p.x, y: p.y, scale: [0.2, 1, 0.4] }}
                  transition={{ duration: 0.7, delay: p.d }}
                  className="absolute right-8 top-5 text-sm"
                >
                  {comboFlash.combo >= 8 ? '✨' : comboFlash.combo >= 5 ? '⭐' : '•'}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 核心题区：加切换动画 + 错误轻 shake */}
      <motion.div
        animate={shakeAnimation}
        transition={{ duration: 0.35 }}
        className="flex-1 relative w-full max-w-lg mx-auto overflow-hidden"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${currentQuestion?.id || 'q'}-${currentIndex}`}
            initial={{ opacity: 0, x: 34, scale: 0.985 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -26, scale: 0.985 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            <XuanZeTi
              data={currentQuestion}
              onCorrect={handleCorrect}
              onWrong={handleWrong}
              onNext={handleNext}
              triggerAI={async (params) => {
                console.log('AI解析请求:', params);
              }}
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export async function getStaticPaths() {
  const lessonsDir = path.join(process.cwd(), 'data/lessons');
  if (!fs.existsSync(lessonsDir)) return { paths: [], fallback: false };

  const filenames = fs.readdirSync(lessonsDir);
  const paths = filenames
    .filter((name) => name.endsWith('.json'))
    .map((name) => ({
      params: { lessonId: name.replace('.json', '') }
    }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const lessonId = params.lessonId;

  try {
    const filePath = path.join(process.cwd(), 'data/lessons', `${lessonId}.json`);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const lessonData = JSON.parse(fileContents);

    const roadmapsDir = path.join(process.cwd(), 'data/roadmaps');
    let currentRoadmap = { units: [] };

    if (fs.existsSync(roadmapsDir)) {
      const roadmapFiles = fs.readdirSync(roadmapsDir).filter((f) => f.endsWith('.json'));

      for (const file of roadmapFiles) {
        const roadmapData = JSON.parse(
          fs.readFileSync(path.join(roadmapsDir, file), 'utf8')
        );

        let found = false;
        if (roadmapData.units) {
          for (const unit of roadmapData.units) {
            if (unit.lessons && unit.lessons.some((l) => l.id === lessonId)) {
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
        currentRoadmap,
        explicitLessonId: lessonId
      }
    };
  } catch (e) {
    return { notFound: true };
  }
            }
