import { useState, useEffect } from 'react'
import { TIMELINE_CONFIG } from '@/lib/timeline.config'

// 格式化进度显示
const formatProgress = (progress) => {
  return `${progress.toFixed(1)}%`
}

// 格式化日期显示 - 只显示到月
const formatDate = (year, month) => {
  return `${year}.${month.toString().padStart(2, '0')}`
}

// 计算时间线进度的函数 - 精确到日
const calculateProgress = (startDate, endDate) => {
  // 获取当前日期并重置时间为00:00:00
  const now = new Date()
  now.setHours(0, 0, 0, 0)

  const start = new Date(startDate)
  const end = new Date(endDate)

  // 重置开始和结束日期的时间为00:00:00
  start.setHours(0, 0, 0, 0)
  end.setHours(0, 0, 0, 0)

  // 如果还未开始，返回0
  if (now < start) return 0
  // 如果已经结束，返回100
  if (now > end) return 100

  const total = end.getTime() - start.getTime()
  const current = now.getTime() - start.getTime()
  return Math.round((current / total) * 10000) / 100 // 保留两位小数
}

const CareerTimeline = () => {
  // 使用 state 存储进度
  const [progresses, setProgresses] = useState({})

  // 计算下一个凌晨的时间
  const getNextMidnight = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    return tomorrow
  }

  // 每天凌晨更新进度
  useEffect(() => {
    const updateProgresses = () => {
      const newProgresses = {}
      TIMELINE_CONFIG.timelines.forEach(timeline => {
        newProgresses[timeline.period] = calculateProgress(
          timeline.startDate,
          timeline.endDate
        )
      })
      setProgresses(newProgresses)
    }

    // 初始更新
    updateProgresses()

    // 计算到下一个凌晨的延迟时间
    const now = new Date()
    const nextMidnight = getNextMidnight()
    const delay = nextMidnight.getTime() - now.getTime()

    // 设置定时器在下一个凌晨触发
    const timeout = setTimeout(() => {
      updateProgresses()
      // 设置每24小时更新一次的间隔
      const interval = setInterval(updateProgresses, 24 * 60 * 60 * 1000)
      return () => clearInterval(interval)
    }, delay)

    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
      <div className="mb-6">
        <div className="text-sm text-gray-500 dark:text-gray-400">生涯</div>
        <div className="text-2xl font-bold dark:text-white">无限进步</div>
      </div>

      <div className="space-y-8">
        {TIMELINE_CONFIG.timelines.map((timeline, index) => (
          <div key={index} className="relative">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {timeline.period}
              </span>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {formatProgress(progresses[timeline.period] || 0)}
              </span>
            </div>

            {/* 进度条 */}
            <div className="relative w-full h-3 bg-gray-200 rounded-full dark:bg-gray-700 overflow-hidden">
              <div
                className="absolute h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-1000 ease-in-out progress-bar-animation progress-update"
                style={{ width: `${progresses[timeline.period]}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
              </div>
            </div>

            {/* 时间线标记 */}
            <div className="relative h-24 mt-2">
              <div className="absolute w-full h-0.5 bg-gray-200 dark:bg-gray-700 top-3"></div>
              {timeline.milestones.map((milestone, mIndex, array) => {
                if (!milestone.date) {
                  console.error('Missing date for milestone:', milestone)
                  return null
                }

                try {
                  // 处理日期格式
                  let position
                  let displayDate

                  if (milestone.type === 0) {
                    // 进行中的里程碑 - 使用单一日期
                    const [year, month] = milestone.date.split('-')
                    const milestoneDate = new Date(milestone.date)
                    const startDate = new Date(timeline.startDate)
                    const endDate = new Date(timeline.endDate)

                    position = ((milestoneDate - startDate) / (endDate - startDate)) * 100
                    displayDate = formatDate(year, month)
                  } else {
                    // 已完成的里程碑 - 可能包含日期范围
                    const dates = milestone.date.split('至')
                    const startDate = new Date(timeline.startDate)
                    const endDate = new Date(timeline.endDate)
                    const milestoneDate = new Date(dates[0]) // 使用开始日期作为位置参考

                    position = ((milestoneDate - startDate) / (endDate - startDate)) * 100
                    displayDate = milestone.date // 保存完整日期范围用于悬浮显示
                  }

                  // 根据类型决定样式
                  const dotColorClass = milestone.type === 0
                    ? 'bg-yellow-400 ring-4 ring-yellow-100 dark:ring-yellow-900/30'
                    : 'bg-blue-500'

                  const labelColorClass = milestone.type === 0
                    ? 'text-yellow-600 dark:text-yellow-400 font-medium'
                    : 'text-gray-500 dark:text-gray-400'

                  return (
                    <div
                      key={mIndex}
                      className="absolute transform -translate-x-1/2 top-0 group"
                      style={{
                        left: `${position}%`,
                        zIndex: milestone.type === 0 ? 10 : mIndex
                      }}
                    >
                      <div className="flex flex-col items-center">
                        <div className="relative">
                          <div className={`w-2.5 h-2.5 rounded-full ${dotColorClass} mb-1 transition-all duration-300
                            ${milestone.type === 0 ? 'animate-pulse scale-110' : ''}`}
                          ></div>

                          {/* 悬浮提示 - 仅对已完成的里程碑显示 */}
                          {milestone.type === 1 && (
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-20">
                              <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 text-white text-xs rounded-lg py-3 px-4 shadow-xl border border-gray-700/50 backdrop-blur-sm min-w-[240px]">
                                {/* 日期 */}
                                <div className="flex items-center justify-between gap-4 w-full">
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    <div className="w-3 h-3">
                                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16.78 9.7L11.11 15.37C10.97 15.51 10.78 15.59 10.58 15.59C10.38 15.59 10.19 15.51 10.05 15.37L7.22 12.54C6.93 12.25 6.93 11.77 7.22 11.48C7.51 11.19 7.99 11.19 8.28 11.48L10.58 13.78L15.72 8.64C16.01 8.35 16.49 8.35 16.78 8.64C17.07 8.93 17.07 9.4 16.78 9.7Z" fill="currentColor" />
                                      </svg>
                                    </div>
                                    <span className="font-medium text-gray-300">完成时间</span>
                                  </div>
                                  <span className="font-semibold text-sm text-white">{displayDate}</span>
                                </div>

                                {/* 装饰元素 */}
                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
                                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>

                                {/* 尾部箭头 */}
                                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                                  <div className="w-2 h-2 bg-gray-900 rotate-45 transform origin-center"></div>
                                </div>

                                {/* 模糊光晕效果 */}
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg filter blur opacity-50"></div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* 日期和标签 */}
                        <div className="flex flex-col items-center">
                          {/* 只为进行中的里程碑显示日期 */}
                          {milestone.type === 0 && (
                            <span className={`text-xs ${labelColorClass} whitespace-nowrap`}>
                              {displayDate}
                            </span>
                          )}
                          <span className={`text-xs mt-0.5 whitespace-nowrap
                            ${milestone.type === 0 ? 'text-yellow-600 dark:text-yellow-400 font-medium' : 'text-gray-400 dark:text-gray-500'}`}
                          >
                            {milestone.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                } catch (error) {
                  console.error('Error processing milestone:', milestone, error)
                  return null
                }
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 添加动画样式 */}
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite linear;
        }

        .progress-bar-animation {
          position: relative;
        }

        .progress-bar-animation::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          animation: progress-animation 1.5s linear infinite;
        }

        @keyframes progress-animation {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .progress-update {
          animation: pulse 0.5s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .milestone-enter {
          animation: fadeIn 0.3s ease-out forwards;
        }

        @keyframes tooltipEnter {
          0% {
            opacity: 0;
            transform: translate(-50%, -10px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, 0) scale(1);
          }
        }

        @keyframes glowPulse {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
        }

        .group-hover\\:block {
          animation: tooltipEnter 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: transform, opacity;
        }

        .shadow-xl {
          box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.2),
                      0 0 15px -3px rgba(0, 0, 0, 0.1),
                      0 0 30px -5px rgba(59, 130, 246, 0.1);
        }

        .backdrop-blur-sm {
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }

        @keyframes ping {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          80%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        .animate-ping {
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .whitespace-nowrap {
          white-space: nowrap;
        }
      `}</style>
    </div>
  )
}

export default CareerTimeline 