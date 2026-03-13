// /lib/progress.js

const PROGRESS_KEY = 'my_duolingo_progress';

export function getProgress() {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(PROGRESS_KEY);
  
  const defaultProgress = {
    unlockedLessons: ['greet-l1', 'travel-l1', 'med-l1'], // 各分类第一关默认解锁
    completedLessons: [],
    lessonStats: {},
    streak: 0,
    gems: 500,
    lastStudyDate: null
  };

  if (stored) {
    return { ...defaultProgress, ...JSON.parse(stored) };
  }
  return defaultProgress;
}

export function saveProgress(progress) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  }
}

export function completeLesson(lessonId, resultStats, mapData) {
  const progress = getProgress();
  
  progress.lessonStats[lessonId] = resultStats;
  
  // 只有首次通关才加钻石和记录
  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId);
    progress.gems += 15; 
  }

  // 🌟 终极修复：把解锁逻辑从 if 里拿出来！！！
  // 这样哪怕你重打已经过关的关卡，它也会确保下一关被解锁！
  if (mapData && mapData.units) {
    const allLessonIds = mapData.units.flatMap(unit => unit.lessons.map(l => l.id));
    const currentIndex = allLessonIds.indexOf(lessonId);
    
    if (currentIndex !== -1 && currentIndex < allLessonIds.length - 1) {
      const nextLessonId = allLessonIds[currentIndex + 1];
      if (!progress.unlockedLessons.includes(nextLessonId)) {
        progress.unlockedLessons.push(nextLessonId);
      }
    }
  }

  // 更新火苗
  const today = new Date().toDateString();
  if (progress.lastStudyDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (progress.lastStudyDate === yesterday.toDateString()) {
      progress.streak += 1;
    } else {
      progress.streak = 1;
    }
    progress.lastStudyDate = today;
  }

  saveProgress(progress);
}

export function spendGemsToUnlock(lessonId, cost = 100) {
  const progress = getProgress();
  if (progress.gems >= cost && !progress.unlockedLessons.includes(lessonId)) {
    progress.gems -= cost;
    progress.unlockedLessons.push(lessonId);
    saveProgress(progress);
    return true;
  }
  return false;
}
