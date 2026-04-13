import CopyRightDate from '@/components/CopyRightDate'
import PoweredBy from '@/components/PoweredBy'
import { siteConfig } from '@/lib/config'
import { useEffect, useState } from 'react'

/**
 * 状态小组件：以北京时间为准显示状态
 */
const StatusTracker = () => {
  const [status, setStatus] = useState({ icon: '✨', text: '连接中...' })

  useEffect(() => {
    // 获取北京时间的函数
    const getBeijingHour = () => {
      // 使用 Intl.DateTimeFormat 强制获取东八区(上海/北京)的时间
      const formatter = new Intl.DateTimeFormat('zh-CN', {
        hour12: false,
        hour: 'numeric',
        timeZone: 'Asia/Shanghai'
      })
      return parseInt(formatter.format(new Date()))
    }

    const hour = getBeijingHour()

    // 更有趣的状态库
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

    // 根据北京时间段设置特殊状态
    if (hour >= 0 && hour < 5) {
      setStatus({ icon: '🌙', text: '北京时间深夜，灵感爆发中' })
    } else if (hour >= 5 && hour < 7) {
      setStatus({ icon: '🌅', text: '北京时间清晨，新的一天开始' })
    } else if (hour >= 12 && hour < 13) {
      setStatus({ icon: '🍱', text: '午餐时间，暂停营业' })
    } else if (hour >= 22) {
      setStatus({ icon: '🌌', text: '夜深了，该准备休息了' })
    } else {
      // 其他时间随机抽取一个
      const randomMood = moods[Math.floor(Math.random() * moods.length)]
      setStatus(randomMood)
    }
  }, [])

  return (
    <div className='flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#2d2e32] text-xs text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 shadow-sm'>
      <span className='animate-pulse'>{status.icon}</span>
      <span className='whitespace-nowrap'>{status.text}</span>
    </div>
  )
}

/**
 * 页脚组件
 */
const Footer = () => {
  const BIO = siteConfig('BIO')

  return (
    <footer className='relative flex-shrink-0 bg-white dark:bg-[#1a191d] justify-center text-center m-auto w-full leading-6 text-gray-600 dark:text-gray-100 text-sm'>
      {/* 颜色过度区 */}
      <div
        id='color-transition'
        className='h-32 bg-gradient-to-b from-[#f7f9fe] to-white dark:bg-[#1a191d] dark:from-inherit dark:to-inherit'
      />

      {/* 底部页面信息 */}
      <div
        id='footer-bottom'
        className='w-full min-h-[5rem] py-6 flex flex-col lg:flex-row justify-between px-6 lg:px-12 items-center bg-[#f1f3f7] dark:bg-[#21232A] border-t dark:border-t-[#3D3D3F] gap-y-4'>
        
        {/* 左侧：版权与作者信息 */}
        <div id='footer-bottom-left' className='text-center lg:text-start flex flex-col gap-1'>
          <PoweredBy />
          <div className='flex items-center justify-center lg:justify-start gap-x-1'>
            <CopyRightDate />
            <a
              href={'/about'}
              className='underline font-semibold dark:text-gray-300 hover:text-blue-500 transition-colors'>
              {siteConfig('AUTHOR')}
            </a>
            {BIO && <span className='mx-1 opacity-70 hidden md:inline'> | {BIO}</span>}
          </div>
        </div>

        {/* 右侧：北京时间状态展示 */}
        <div id='footer-bottom-right' className='flex justify-center items-center'>
          <StatusTracker />
        </div>

      </div>
    </footer>
  )
}

export default Footer
