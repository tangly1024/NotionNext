import CopyRightDate from '@/components/CopyRightDate'
import PoweredBy from '@/components/PoweredBy'
import { siteConfig } from '@/lib/config'
import { useEffect, useState } from 'react'

/**
 * 状态小组件：根据时间和随机性显示不同的状态
 */
const StatusTracker = () => {
  const [status, setStatus] = useState({ icon: '✨', text: '初始化中...' })

  useEffect(() => {
    const hour = new Date().getHours()

    // 基础状态库 (可自行添加/修改有趣的文案)
    const moods = [
      { icon: '☕', text: '正在享受一杯手冲' },
      { icon: '💻', text: '正在清理代码的思绪' },
      { icon: '🎧', text: '单曲循环中...' },
      { icon: '📖', text: '正在读一本好书' },
      { icon: '🪐', text: '在数字宇宙里漫游' },
      { icon: '✍️', text: '构思下一篇文章' },
      { icon: '🐛', text: '正在与 Bug 搏斗' },
      { icon: '🐱', text: '正在给主子铲屎' },
      { icon: '🍕', text: '思考下一顿吃什么' }
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
    <div className='flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-[#2d2e32] text-xs text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300'>
      {/* animate-pulse 让图标有轻轻闪烁的呼吸感 */}
      <span className='animate-pulse'>{status.icon}</span>
      <span>{status.text}</span>
    </div>
  )
}

/**
 * 页脚组件
 * @returns
 */
const Footer = () => {
  const BIO = siteConfig('BIO')

  return (
    <footer className='relative flex-shrink-0 bg-white dark:bg-[#1a191d] justify-center text-center m-auto w-full leading-6  text-gray-600 dark:text-gray-100 text-sm'>
      {/* 颜色过度区 */}
      <div
        id='color-transition'
        className='h-15 bg-gradient-to-b from-[#f7f9fe] to-white  dark:bg-[#1a191d] dark:from-inherit dark:to-inherit'
      />

      {/* 底部页面信息 */}
      <div
        id='footer-bottom'
        className='w-full min-h-[5rem] py-4 flex flex-col lg:flex-row justify-between px-6 lg:px-12 items-center bg-[#f1f3f7] dark:bg-[#21232A] border-t dark:border-t-[#3D3D3F] gap-y-4'>
        
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
            {BIO && <span className='mx-1 opacity-70'> | {BIO}</span>}
          </div>
        </div>

        {/* 右侧：动态状态展示 */}
        <div id='footer-bottom-right' className='flex justify-center'>
          <StatusTracker />
        </div>

      </div>
    </footer>
  )
}

export default Footer
