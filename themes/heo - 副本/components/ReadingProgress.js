import { ArrowSmallUp } from '@/components/HeroIcons'
import { useEffect, useState } from 'react'

/**
 * 回顶按钮
 * @returns
 */
export default function ReadingProgress() {
  const [scrollPercentage, setScrollPercentage] = useState(0)

  function handleScroll() {
    const scrollHeight = document.documentElement.scrollHeight
    const clientHeight = document.documentElement.clientHeight
    const scrollY = window.scrollY || window.pageYOffset

    const percent = Math.floor((scrollY / (scrollHeight - clientHeight - 20)) * 100)
    setScrollPercentage(percent)
  }

  // 监听滚动事件
  useEffect(() => {
    let requestId

    function updateScrollPercentage() {
      handleScroll()
      requestId = null
    }

    function handleAnimationFrame() {
      if (requestId) {
        return
      }
      requestId = requestAnimationFrame(updateScrollPercentage)
    }

    window.addEventListener('scroll', handleAnimationFrame)
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
        className={`${scrollPercentage > 0 ? 'w-10 h-10 ' : 'w-0 h-0 opacity-0'} group cursor-pointer  hover:bg-black hover:bg-opacity-10 rounded-full flex justify-center items-center duration-200 transition-all`}
    >
        <ArrowSmallUp className={'w-5 h-5 hidden group-hover:block'} />
        <div className='group-hover:hidden text-xs flex justify-center items-center rounded-full w-6 h-6 bg-black text-white'>
            {scrollPercentage < 100 ? scrollPercentage : <ArrowSmallUp className={'w-5 h-5 fill-white'} />}
        </div>
    </div>
  )
}
