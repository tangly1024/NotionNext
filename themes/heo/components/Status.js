// components/Status.js
import { useEffect, useState } from 'react'

const Status = () => {
  const [status, setStatus] = useState({ icon: '✨', text: '初始化中...' })

  useEffect(() => {
    const hour = new Date().getHours()
    
    // 基础状态库
    const moods = [
      { icon: '☕', text: '正在享受一杯手冲' },
      { icon: '🌱', text: '正在清理代码的思绪' },
      { icon: '🎧', text: '单曲循环中' },
      { icon: '📖', text: '正在读一本好书' },
      { icon: '🪐', text: '在数字宇宙里漫游' },
      { icon: '✍️', text: '构思下一篇文章' }
    ]

    // 根据时间段设置特殊状态
    if (hour >= 0 && hour < 5) {
      setStatus({ icon: '🌙', text: '深夜灵感爆发中' })
    } else if (hour >= 5 && hour < 10) {
      setStatus({ icon: '🌅', text: '早安，新的一天' })
    } else if (hour >= 22) {
      setStatus({ icon: '🌌', text: '夜深了，准备休息' })
    } else {
      // 其他时间随机抽取一个状态
      const randomMood = moods[Math.floor(Math.random() * moods.length)]
      setStatus(randomMood)
    }
  }, [])

  return (
    <div className='flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400'>
      <span className='animate-pulse'>{status.icon}</span>
      <span>{status.text}</span>
    </div>
  )
}

export default Status
