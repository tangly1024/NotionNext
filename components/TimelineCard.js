import { useState, useEffect } from 'react'

const formatProgress = (progress) => {
  if (progress === undefined || progress === null) {
    return '0%'
  }
  return `${Number(progress).toFixed(1)}%`
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}`
}

const calculateProgress = (startDate, endDate) => {
  const now = new Date()
  const start = new Date(startDate)
  const end = new Date(endDate)

  // 如果还未开始
  if (now < start) return 0
  // 如果已经结束
  if (now > end) return 100

  const total = end.getTime() - start.getTime()
  const current = now.getTime() - start.getTime()
  return (current / total) * 100
}

const TimelineCard = ({ timelines }) => {
  const [progresses, setProgresses] = useState({})

  useEffect(() => {
    // 计算每个时间段的进度
    const newProgresses = {}
    timelines.forEach(timeline => {
      newProgresses[timeline.period] = calculateProgress(
        timeline.startDate,
        timeline.endDate
      )
    })
    setProgresses(newProgresses)
  }, [timelines])

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 dark:from-blue-500/10 dark:via-purple-500/5 dark:to-pink-500/10"></div>

      {/* 卡片标题 */}
      <div className="relative mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100/80 dark:bg-blue-500/10 rounded-xl">
              <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 12V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15 8H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 16H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="17" cy="17" r="4" stroke="currentColor" strokeWidth="2" />
                <path d="M17 15V17H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">生涯历程</h2>
          </div>

          {/* 装饰动画 */}
          <div className="flex gap-1">
            <div className="w-1 h-1 rounded-full bg-blue-400 animate-pulse"></div>
            <div className="w-1 h-1 rounded-full bg-purple-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1 h-1 rounded-full bg-pink-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>

        {/* 描述文本 */}
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          记录我的学习和工作历程，见证每一步的成长。
        </p>
      </div>

      {/* 时间线内容 */}
      {timelines.map((timeline, index) => (
        <div key={index} className="relative">
          {/* 时间线 */}
          <div className="absolute left-8 top-0 h-full w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent dark:via-gray-700"></div>

          {/* 时间节点 */}
          <div className="relative flex items-start gap-6 py-4 group">
            {/* 节点图标 */}
            <div className={`relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-105
              ${timeline.milestones[timeline.milestones.length - 1].type === 0
                ? 'bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800/80 dark:to-gray-700/80 border border-gray-200/50 dark:border-gray-600/50'
                : 'bg-gradient-to-br from-blue-500 to-purple-500 animate-gradient border border-white/20 dark:border-white/10'}`}>

              {/* 图标 */}
              <div className={`text-2xl relative z-10
                ${timeline.milestones[timeline.milestones.length - 1].type === 0
                  ? 'text-gray-600 dark:text-gray-300'
                  : 'text-white'}`}>
                {timeline.period === 'EDU' ? '🎓' : '💼'}
              </div>

              {/* 动态光效 */}
              {timeline.milestones[timeline.milestones.length - 1].type !== 0 && (
                <>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/50 to-purple-500/50 blur-xl animate-pulse opacity-75"></div>
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-xl animate-pulse delay-100"></div>
                </>
              )}
            </div>

            {/* 内容区域 */}
            <div className="flex-1 pt-1">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                    {timeline.period === 'EDU' ? '学习阶段' : '工作阶段'}
                  </h3>
                  <div className="text-sm px-2.5 py-1 rounded-full bg-blue-50 text-blue-500 dark:bg-blue-500/10 dark:text-blue-400 font-medium">
                    {formatProgress(progresses[timeline.period])}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <span>{formatDate(timeline.startDate)}</span>
                  <span className="text-gray-400 dark:text-gray-500">—</span>
                  <span>{formatDate(timeline.endDate)}</span>
                </div>
              </div>

              {/* 里程碑列表 */}
              <div className="space-y-3">
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  {timeline.milestones.map((milestone, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                        <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                      </svg>
                      <span>{milestone.label}</span>
                      <span className="text-gray-400">({milestone.date})</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 进度条 */}
              <div className="relative h-2 rounded-full bg-gray-100 dark:bg-gray-700/50 overflow-hidden backdrop-blur-sm mt-4">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000"
                  style={{ width: `${progresses[timeline.period]}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/0 animate-shimmer"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <style jsx global>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 4s ease infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  )
}

export default TimelineCard 