// /lib/progress.js

const PROGRESS_KEY = 'my_duolingo_progress';

export function getProgress() {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(PROGRESS_KEY);
  if (stored) return JSON.parse(stored);
  
  // 核心修复：把所有大分类的“第一关”默认解锁！
  // 假设你有问候、购物、交通三个大类
  return {
    unlockedLessons: ['greet-l1', 'shop-l1', 'trans-l1'], 
    completedLessons: [],
    lessonStats: {}
  };
}

export function saveProgress(progress) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  }
}

// 完成关卡并解锁下一关 (优化版，防止跨大类解锁报错)
export function completeLesson(lessonId, resultStats, mapData) {
  const progress = getProgress();
  
  progress.lessonStats[lessonId] = resultStats;
  
  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId);
  }

  // 寻找下一关
  let foundCurrent = false;
  let nextLessonId = null;
  
  if (mapData && mapData.units) {
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
  }

  // 如果找到下一关，且还没解锁，就解锁它
  if (nextLessonId && !progress.unlockedLessons.includes(nextLessonId)) {
    progress.unlockedLessons.push(nextLessonId);
  }

  saveProgress(progress);
}
