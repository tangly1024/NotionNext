// /lib/progress.js

const PROGRESS_KEY = 'my_duolingo_progress';

export function getProgress() {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(PROGRESS_KEY);
  
  const defaultProgress = {
    unlockedLessons: ['greet-l1', 'travel-l1', 'med-l1'], // 各分类第一关默认解锁
    completedLessons: [],
    lessonStats: {},
    streak: 0,       // 🔥 连续学习天数
    gems: 500,       // 💎 初始送 500 钻石
    lastStudyDate: null // 上次学习日期
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

// 完成关卡并结算奖励
export function completeLesson(lessonId, resultStats, mapData) {
  const progress = getProgress();
  
  // 1. 记录本关成绩
  progress.lessonStats[lessonId] = resultStats;
  
  // 2. 首次过关：给钻石奖励 + 解锁下一关
  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId);
    progress.gems += 15; // 每过一关奖励 15 钻石
    
    // 寻找并解锁下一关
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
    if (nextLessonId && !progress.unlockedLessons.includes(nextLessonId)) {
      progress.unlockedLessons.push(nextLessonId);
    }
  }

  // 3. 更新火苗 (Streak) 逻辑
  const today = new Date().toDateString();
  if (progress.lastStudyDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (progress.lastStudyDate === yesterday.toDateString()) {
      progress.streak += 1; // 昨天也学了，连击+1
    } else {
      progress.streak = 1;  // 断更了，重新计算
    }
    progress.lastStudyDate = today;
  }

  saveProgress(progress);
}

// 花费钻石解锁特定关卡 (捷径功能)
export function spendGemsToUnlock(lessonId, cost = 100) {
  const progress = getProgress();
  if (progress.gems >= cost && !progress.unlockedLessons.includes(lessonId)) {
    progress.gems -= cost;
    progress.unlockedLessons.push(lessonId);
    saveProgress(progress);
    return true; // 解锁成功
  }
  return false; // 钻石不足
}
