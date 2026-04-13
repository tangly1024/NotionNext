import CopyRightDate from '@/components/CopyRightDate'
import PoweredBy from '@/components/PoweredBy'
import { siteConfig } from '@/lib/config'
import { useEffect, useState } from 'react'

/**
 * 状态小组件：更大、更醒目的样式
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
    <div className='flex items-center gap-3 px-5 py-2 rounded-full bg-gray-100/80 dark:bg-[#2d2e32] text-sm md:text-base text-gray-600 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600 shadow-md transition-all duration-300 hover:scale-105'>
      {/* 图标稍微加大，并带呼吸动画 */}
      <span className='text-lg md:text-xl animate-pulse flex-shrink-0'>
        {status.icon}
      </span>
      {/* 字体加粗了一点点，确保清晰 */}
      <span className='font-medium whitespace-nowrap leading-none'>
        {status.text}
      </span>
    </div>
  )
}

/**
 * 页脚组件
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
        className='w-full min-h-[6rem] py-8 flex flex-col lg:flex-row justify-between px-6 lg:px-16 items-center bg-[#f1f3f7] dark:bg-[#21232A] border-t-2 dark:border-t-[#3D3D3F] gap-y-6'>
        
        {/* 左侧：版权与作者信息 */}
        <div id='footer-bottom-left' className='text-center lg:text-start flex flex-col gap-2'>
          <PoweredBy />
          <div className='flex flex-wrap items-center justify-center lg:justify-start gap-x-2 text-sm'>
            <CopyRightDate />
            <a
              href={'/about'}
              className='underline font-bold dark:text-gray-200 hover:text-blue-500 transition-colors'>
              {siteConfig('AUTHOR')}
            </a>
            {BIO && <span className='opacity-70 hidden sm:inline'> | {BIO}</span>}
          </div>
        </div>

        {/* 右侧：更醒目的状态展示 */}
        <div id='footer-bottom-right' className='flex justify-center items-center scale-110 lg:scale-125 origin-center lg:origin-right'>
          <StatusTracker />
        </div>

      </div>
    </footer>
  )
}

export default Footer
