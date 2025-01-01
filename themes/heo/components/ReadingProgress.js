import { ArrowSmallUp } from '@/components/HeroIcons'
import { useEffect, useState } from 'react'

/**
 * 阅读进度条组件
 * @returns
 */
export default function ReadingProgress() {
  const [scrollPercentage, setScrollPercentage] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  function handleScroll() {
    const scrollHeight = document.documentElement.scrollHeight
    const clientHeight = document.documentElement.clientHeight
    const scrollY = window.scrollY || window.pageYOffset

    const percent = Math.floor((scrollY / (scrollHeight - clientHeight - 20)) * 100)
    setScrollPercentage(percent)
    setIsVisible(scrollY > 50)
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

  return (
    <>
      <style jsx global>{`
        @keyframes progress-shine {
          0% {
            background-position: 200% center;
            box-shadow: 0 0 8px rgba(59, 130, 246, 0.5);
          }
          50% {
            box-shadow: 0 0 16px rgba(59, 130, 246, 0.8);
          }
          100% {
            background-position: -200% center;
            box-shadow: 0 0 8px rgba(59, 130, 246, 0.5);
          }
        }

        @keyframes glow {
          0% {
            filter: drop-shadow(0 0 4px rgba(59, 130, 246, 0.3));
          }
          50% {
            filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.5));
          }
          100% {
            filter: drop-shadow(0 0 4px rgba(59, 130, 246, 0.3));
          }
        }

        .progress-bar {
          background: linear-gradient(
            90deg,
            #93c5fd 0%,
            #3b82f6 20%,
            #2563eb 50%,
            #3b82f6 80%,
            #93c5fd 100%
          );
          background-size: 200% auto;
          animation: progress-shine 3s ease-in-out infinite;
          border-radius: 0 2px 2px 0;
          position: relative;
        }

        .progress-bar::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.2) 50%,
            transparent 100%
          );
          animation: glow 2s ease-in-out infinite;
        }

        .dark .progress-bar {
          background: linear-gradient(
            90deg,
            #1d4ed8 0%,
            #2563eb 20%,
            #3b82f6 50%,
            #2563eb 80%,
            #1d4ed8 100%
          );
        }
      `}</style>
      <div className="flex items-center">
        {/* 进度条容器 */}
        <div className={`fixed top-0 left-0 w-full h-1.5 bg-gray-100/30 dark:bg-gray-800/30 z-50 backdrop-blur transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}`}>
          {/* 进度条 */}
          <div
            className={`h-full progress-bar transition-transform duration-300 ease-out transform origin-left`}
            style={{
              transform: `scaleX(${scrollPercentage / 100})`,
              transformOrigin: 'left'
            }}
          />
        </div>

        {/* 回到顶部按钮 */}
        <div
          title={'阅读进度'}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`${scrollPercentage > 0 ? 'w-10 h-10 scale-100 opacity-100' : 'w-0 h-0 scale-50 opacity-0'
            } group cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 rounded-full flex justify-center items-center duration-300 transition-all transform hover:scale-110`}
        >
          <ArrowSmallUp className={'w-5 h-5 hidden group-hover:block'} />
          <div className='group-hover:hidden text-xs flex justify-center items-center rounded-full w-6 h-6 bg-blue-500 dark:bg-blue-600 text-white shadow-lg'>
            {scrollPercentage < 100 ? scrollPercentage : <ArrowSmallUp className={'w-5 h-5 fill-white'} />}
          </div>
        </div>
      </div>
    </>
  )
}
