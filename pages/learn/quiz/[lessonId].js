import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import fs from 'fs';
import path from 'path';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { completeLesson } from '../../../lib/progress';

const XuanZeTi = dynamic(() => import('../../../components/quiz/Tixing/XuanZeTi'), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex flex-col items-center justify-center h-full bg-white">
      <div className="w-12 h-12 border-4 border-[#e5e5e5] border-t-[#58cc02] rounded-full animate-spin mb-4"></div>
      <p className="text-gray-400 font-black tracking-widest animate-pulse">引擎启动中...</p>
    </div>
  )
});

const getQuizProgressKey = (lessonId) => `quiz_progress_${lessonId}`;

export default function QuizPage({ lessonData, currentRoadmap, explicitLessonId }) {
  const router = useRouter();

  const [mainQueue, setMainQueue] = useState([]);
  const [wrongQueue, setWrongQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [stats, setStats] = useState({ totalInitial: 0, mistakes: 0 });
  const [combo, setCombo] = useState(0);

  const [comboFlash, setComboFlash] = useState(null);
  const comboTimerRef = useRef(null);
  const [progressPulse, setProgressPulse] = useState(false);
  const progressTimerRef = useRef(null);
  const [shakeStage, setShakeStage] = useState(0);
  const shakeTimerRef = useRef(null);

  const [restored, setRestored] = useState(false);

  useEffect(() => {
    if (!lessonData?.questions) return;

    let loaded = false;

    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(getQuizProgressKey(explicitLessonId));
        if (raw) {
          const saved = JSON.parse(raw);
          if (
            saved &&
            saved.lessonId === explicitLessonId &&
            Array.isArray(saved.mainQueue) &&
            Array.isArray(saved.wrongQueue)
          ) {
            setMainQueue(saved.mainQueue);
            setWrongQueue(saved.wrongQueue);
            setCurrentIndex(saved.currentIndex || 0);
            setIsFinished(false);
            setCombo(0);
            setComboFlash(null);
            setProgressPulse(false);
            setShakeStage(0);
            setStats(saved.stats || { totalInitial: lessonData.questions.length, mistakes: 0 });
            loaded = true;
          }
        }
      } catch (_) {}
    }

    if (!loaded) {
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

    setRestored(true);
  }, [lessonData, explicitLessonId]);

  // 本地保存进行中的关卡进度
  useEffect(() => {
    if (!restored) return;
    if (typeof window === 'undefined') return;
    if (isFinished) return;
    if (!mainQueue.length) return;

    try {
      localStorage.setItem(
        getQuizProgressKey(explicitLessonId),
        JSON.stringify({
          lessonId: explicitLessonId,
          mainQueue,
          wrongQueue,
          currentIndex,
          stats,
          savedAt: Date.now()
        })
      );
    } catch (_) {}
  }, [restored, explicitLessonId, mainQueue, wrongQueue, currentIndex, stats, isFinished]);

  useEffect(() => {
    return () => {
      if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
      if (progressTimerRef.current) clearTimeout(progressTimerRef.current);
      if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (isFinished) {
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem(getQuizProgressKey(explicitLessonId));
        } catch (_) {}
      }

      import('canvas-confetti').then((confetti) => {
        confetti.default({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#58cc02', '#ffc800', '#ce82ff', '#1cb0f6']
        });
      });
    }
  }, [isFinished, explicitLessonId]);

  if (!restored || !mainQueue.length) {
    return <div className="min-h-screen bg-white" />;
  }

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
    }, 500);
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
        particleCount: nextCombo >= 8 ? 40 : 20,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff9600', '#ffc800']
      });
      confetti({
        particleCount: nextCombo >= 8 ? 40 : 20,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff9600', '#ffc800']
      });
    } catch (_) {}
  };

  const showComboEffect = (nextCombo) => {
    if (nextCombo < 3) return;
    if (comboTimerRef.current) clearTimeout(comboTimerRef.current);

    let icon = '🔥';
    let color = 'text-orange-500';

    if (nextCombo >= 8) {
      icon = '🦄';
      color = 'text-purple-500';
    } else if (nextCombo >= 5) {
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
    }, 2200);
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

  if (isFinished) {
    const stars = accuracy === 100 ? 3 : accuracy >= 80 ? 2 : 1;
    const praise = accuracy === 100 ? '完美通关！' : accuracy >= 80 ? '做得很棒！' : '继续加油！';

    return (
      <div className="flex flex-col items-center justify-center h-[100dvh] bg-white p-6 text-center overflow-hidden relative selection:bg-transparent">
        <motion.div
          initial={{ scale: 0, opacity: 0, rotate: -180 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="mb-4"
        >
          <div className="text-7xl drop-shadow-md">🎉</div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-black text-[#58cc02] mb-2 drop-shadow-sm"
        >
          {praise}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 font-bold mb-6 text-lg"
        >
          本次错误次数：<span className="text-red-500">{stats.mistakes}</span>
        </motion.p>

        <div className="flex items-center gap-4 mb-8">
          {[1, 2, 3].map((n) => (
            <motion.div
              key={n}
              initial={{ scale: 0, y: -50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ delay: 0.4 + n * 0.15, type: 'spring', stiffness: 300, damping: 12 }}
              className={`text-6xl drop-shadow-lg ${n <= stars ? '' : 'opacity-20 grayscale'}`}
            >
              ⭐
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, type: 'spring' }}
          className="w-full max-w-sm bg-[#f3f4f6] rounded-3xl p-5 mb-10 border-2 border-[#e5e5e5]"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-black text-gray-500 uppercase tracking-widest">准确率</span>
            <span className="text-2xl font-black text-[#4b4b4b]">{accuracy}%</span>
          </div>

          <div className="w-full h-4 bg-[#e5e5e5] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#ffc800] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${accuracy}%` }}
              transition={{ delay: 1, duration: 1, type: 'spring' }}
            />
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, type: 'spring', stiffness: 200 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.replace('/learn')}
          className="w-full max-w-sm bg-[#58cc02] text-white py-4 rounded-2xl font-black text-xl tracking-widest uppercase shadow-[0_6px_0_0_#46a302] active:translate-y-1 active:shadow-[0_2px_0_0_#46a302] transition-all"
        >
          继续学习
        </motion.button>
      </div>
    );
  }

  const shakeAnimation = shakeStage > 0 ? { x: [0, -10, 10, -8, 8, -4, 4, 0] } : { x: 0 };

  return (
    <div className="flex flex-col h-[100dvh] bg-white overflow-hidden relative selection:bg-transparent">
      {/* 顶部进度条 */}
      <div className="pt-8 pb-4 px-6 shrink-0">
        <div className="h-3.5 bg-[#e5e5e5] rounded-full relative">
          {progressPulse && (
            <motion.div
              className="absolute inset-0 bg-[#58cc02] rounded-full"
              initial={{ opacity: 0.8, scale: 1 }}
              animate={{ opacity: 0, scaleY: 2.5, scaleX: 1.05 }}
              transition={{ duration: 0.5 }}
            />
          )}

          <motion.div
            className="absolute top-0 left-0 bottom-0 bg-[#58cc02] rounded-full z-10"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          >
            <div className="absolute top-1 left-2 right-2 h-[30%] bg-white/30 rounded-full" />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isDoingWrongQueue && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-center text-orange-500 font-black text-[13px] pb-3 shrink-0 uppercase tracking-widest"
          >
            ⚠️ 再练一次，你快掌握了
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {comboFlash && (
          <motion.div
            key={comboFlash.id}
            initial={{ opacity: 0, y: -20, scale: 0.5, rotate: 10 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            className="absolute top-16 right-6 z-50 pointer-events-none"
          >
            <div className="bg-white px-4 py-2 rounded-2xl shadow-lg border-2 border-[#e5e5e5] flex items-center gap-2">
              <span className="text-2xl drop-shadow-sm">{comboFlash.icon}</span>
              <span className={`font-black italic text-xl ${comboFlash.color}`}>
                {comboFlash.combo} 连击
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={shakeAnimation}
        transition={{ duration: 0.4 }}
        className="flex-1 relative w-full max-w-lg mx-auto overflow-hidden"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${currentQuestion?.id || 'q'}-${currentIndex}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
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
    .map((name) => ({ params: { lessonId: name.replace('.json', '') } }));
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
        const roadmapData = JSON.parse(fs.readFileSync(path.join(roadmapsDir, file), 'utf8'));
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
