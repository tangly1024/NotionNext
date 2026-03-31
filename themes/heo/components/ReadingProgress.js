import { ArrowSmallUp } from '@/components/HeroIcons'
import { useEffect, useRef, useState } from 'react'

/**
 * 回顶按钮
 * @returns
 */
export default function ReadingProgress() {
  const [scrollPercentage, setScrollPercentage] = useState(0)
  const lastPercentRef = useRef(0)

  // 监听滚动事件
  useEffect(() => {
    let requestId

    function updateScrollPercentage() {
      const scrollHeight = document.documentElement.scrollHeight
      const clientHeight = document.documentElement.clientHeight
      const scrollY = window.scrollY || window.pageYOffset
      const denominator = Math.max(1, scrollHeight - clientHeight - 20)
      const percent = Math.min(100, Math.max(0, Math.floor((scrollY / denominator) * 100)))

      if (percent !== lastPercentRef.current) {
        lastPercentRef.current = percent
        setScrollPercentage(percent)
      }
      requestId = null
    }

    function handleAnimationFrame() {
      if (requestId) {
        return
      }
      requestId = requestAnimationFrame(updateScrollPercentage)
    }

    handleAnimationFrame()
    window.addEventListener('scroll', handleAnimationFrame, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleAnimationFrame)
      if (requestId) {
        cancelAnimationFrame(requestId)
      }
    }
  }, [])

  return (<div
        title={'阅读进度'}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`${scrollPercentage > 0 ? 'w-10 h-10 ' : 'w-0 h-0 opacity-0'} group cursor-pointer hover:bg-[rgba(139,92,246,0.12)] dark:hover:bg-[rgba(139,92,246,0.2)] rounded-full flex justify-center items-center duration-200 transition-all`}
    >
        <ArrowSmallUp className={'w-5 h-5 hidden group-hover:block'} />
        <div className='group-hover:hidden text-xs flex justify-center items-center rounded-full w-6 h-6 bg-black text-white'>
            {scrollPercentage < 100 ? scrollPercentage : <ArrowSmallUp className={'w-5 h-5 fill-white'} />}
        </div>
    </div>
  )
}
