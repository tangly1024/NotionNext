import CopyRightDate from '@/components/CopyRightDate'
import PoweredBy from '@/components/PoweredBy'
import { siteConfig } from '@/lib/config'
import { useEffect, useState } from 'react'

/**
 * 动态灵动状态组件
 */
const StatusTracker = () => {
  const [status, setStatus] = useState({ icon: '✨', text: '连接中...' })

  useEffect(() => {
    const getBeijingHour = () => {
      const formatter = new Intl.DateTimeFormat('zh-CN', {
        hour12: false,
        hour: 'numeric',
        timeZone: 'Asia/Shanghai'
      })
      return parseInt(formatter.format(new Date()))
    }

    const hour = getBeijingHour()
    const moods = [
      { icon: '☕', text: '正在享受一杯手冲' },
      { icon: '💻', text: '正在清理代码的思绪' },
      { icon: '🎧', text: '单曲循环中...' },
      { icon: '📖', text: '正在读一本好书' },
      { icon: '🪐', text: '在数字宇宙里漫游' },
      { icon: '✍️', text: '构思下一篇文章' },
      { icon: '🐛', text: '正在与 Bug 搏斗' },
      { icon: '🐱', text: '正在陪猫主子' },
      { icon: '🍕', text: '思考下一顿吃什么' },
      { icon: '🔋', text: '正在充电中' },
      { icon: '🎮', text: '处于短暂的游戏时间' },
      { icon: '🍵', text: '淡定摸鱼中' }
    ]

    if (hour >= 0 && hour < 5) {
      setStatus({ icon: '🌙', text: '北京时间深夜，灵感爆发中' })
    } else if (hour >= 5 && hour < 9) {
      setStatus({ icon: '🌅', text: '北京时间清晨，新的一天开始' })
    } else if (hour >= 12 && hour < 14) {
      setStatus({ icon: '🍱', text: '午餐时间，暂停营业' })
    } else if (hour >= 22) {
      setStatus({ icon: '🌌', text: '夜深了，该准备休息了' })
    } else {
      const randomMood = moods[Math.floor(Math.random() * moods.length)]
      setStatus(randomMood)
    }
  }, [])

  return (
    <div className="relative group overflow-hidden p-[2px] rounded-full animate-float">
      {/* 动画流光背景 - 旋转渐变 */}
      <div className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2E8F0_0%,#3B82F6_50%,#E2E8F0_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#1a191d_0%,#6366f1_50%,#1a191d_100%)]" />
      
      {/* 内部容器 - 磨砂玻璃质感 */}
      <div className="relative flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/90 dark:bg-[#1a191d]/90 backdrop-blur-md text-gray-700 dark:text-gray-200">
        <span className="text-xl inline-block animate-bounce-slow">
          {status.icon}
        </span>
        <span className="text-sm md:text-base font-bold tracking-wide whitespace-nowrap bg-gradient-to-r from-gray-800 to-gray-500 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
          {status.text}
        </span>
      </div>

      {/* 自定义动画样式 */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

/**
 * 页脚
 */
const Footer = () => {
  const BIO = siteConfig('BIO')

  return (
    <footer className='relative flex-shrink-0 bg-white dark:bg-[#1a191d] justify-center text-center m-auto w-full leading-6 text-gray-600 dark:text-gray-100'>
      {/* 颜色过度区 */}
      <div
        id='color-transition'
        className='h-32 bg-gradient-to-b from-[#f7f9fe] to-white dark:bg-[#1a191d] dark:from-inherit dark:to-inherit'
      />

      {/* 底部页面信息 */}
      <div
        id='footer-bottom'
        className='w-full min-h-[8rem] py-10 flex flex-col lg:flex-row justify-between px-8 lg:px-20 items-center bg-[#f1f3f7] dark:bg-[#21232A] border-t dark:border-t-[#3D3D3F] gap-y-10'>
        
        {/* 左侧：版权与作者信息 */}
        <div id='footer-bottom-left' className='text-center lg:text-start flex flex-col gap-3'>
          <PoweredBy />
          <div className='flex flex-wrap items-center justify-center lg:justify-start gap-x-2 text-sm md:text-base'>
            <CopyRightDate />
            <a
              href={'/about'}
              className='underline font-black dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
              {siteConfig('AUTHOR')}
            </a>
            {BIO && <span className='opacity-60 hidden sm:inline'> | {BIO}</span>}
          </div>
        </div>

        {/* 右侧：灵动状态展示 */}
        <div id='footer-bottom-right' className='flex justify-center items-center'>
          <StatusTracker />
        </div>

      </div>
    </footer>
  )
}

export default Footer
