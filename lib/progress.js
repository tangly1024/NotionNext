// /lib/progress.js

const PROGRESS_KEY = 'my_duolingo_progress';

export function getProgress() {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(PROGRESS_KEY);
  if (stored) return JSON.parse(stored);
  
  // 初始默认状态：只解锁第一关
  return {
    unlockedLessons: ['lesson-1'],
    completedLessons: [],
    lessonStats: {}
  };
}

export function saveProgress(progress) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  }
}

// 完成关卡并解锁下一关
export function completeLesson(lessonId, resultStats, mapData) {
  const progress = getProgress();
  
  // 1. 记录本关成绩
  progress.lessonStats[lessonId] = resultStats;
  
  // 2. 标记已完成
  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId);
  }

  // 3. 寻找并解锁下一关 (简易逻辑，遍历 mapData 找下一个)
  let foundCurrent = false;
  let nextLessonId = null;
  
  for (const unit of mapData.units) {
    for (const lesson of unit.lessons) {
      if (foundCurrent) {
        nextLessonId = lesson.id;
        break;
      }
      if (lesson.id === lessonId) foundCurrent = true;
    }
    if (nextLessonId) break;
  }

  if (nextLessonId && !progress.unlockedLessons.includes(nextLessonId)) {
    progress.unlockedLessons.push(nextLessonId);
  }

  saveProgress(progress);
}
