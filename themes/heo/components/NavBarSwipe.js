import BLOG from '@/blog.config'
import { isBrowser } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { MenuListTop } from './MenuListTop'

/**
 * 一个swipe组件
 * 垂直方向，g给导航栏用
 * @param {*} param0
 * @returns
 */
export default function NavSwipe(props) {
  const [activeIndex, setActiveIndex] = useState(0)

  const item1 = (
    <div className='mr-1 justify-end items-center hidden lg:block'>
      <div className='hidden lg:flex'>
        <MenuListTop {...props} />
      </div>
    </div>
  )

  const item2 = <h1 className='font-bold text-light-400 dark:text-gray-400'>{BLOG.AUTHOR || BLOG.TITLE} | {BLOG.BIO}</h1>
  const items = [item1, item2]

  useEffect(() => {
    let prevScrollY = 0
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY

          if (currentScrollY > prevScrollY) {
            setActiveIndex(1) // 向下滚动时设置activeIndex为1
          } else {
            setActiveIndex(0) // 向上滚动时设置activeIndex为0
          }

          prevScrollY = currentScrollY
          ticking = false
        })

        ticking = true
      }
    }

    if (isBrowser()) {
      window.addEventListener('scroll', handleScroll)
    }

    return () => {
      if (isBrowser()) {
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  return (
    <div className="hidden lg:block h-full relative w-full overflow-hidden">
      {items.map((item, index) => (
        <div
          key={index}
          className={`absolute top-0 bottom-0 w-full h-full flex justify-center items-center line-clamp-1 transform transition-transform duration-500 ${
            index === activeIndex ? 'slide-in' : 'slide-out'
          }`}
        >
          {item}
        </div>
      ))}

      <style jsx>{`
        .slide-in {
          animation-name: slide-in;
          animation-duration: 0.5s;
          animation-fill-mode: forwards;
        }

        .slide-out {
          animation-name: slide-out;
          animation-duration: 0.5s;
          animation-fill-mode: forwards;
        }

        @keyframes slide-in {
          from {
            transform: translateY(${activeIndex === 1 ? '100%' : '-100%'});
          }
          to {
            transform: translateY(0);
          }
        }

        @keyframes slide-out {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(${activeIndex === 1 ? '-100%' : '100%'});
          }
        }
      `}</style>
    </div>
  )
};
