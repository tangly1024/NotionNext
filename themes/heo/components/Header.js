import { siteConfig } from '@/lib/config'
import { isBrowser } from '@/lib/utils'
import throttle from 'lodash.throttle'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useRef, useState } from 'react'
import DarkModeButton from './DarkModeButton'
import Logo from './Logo'
import { MenuListTop } from './MenuListTop'
import RandomPostButton from './RandomPostButton'
import ReadingProgress from './ReadingProgress'
import SearchButton from './SearchButton'
import SlideOver from './SlideOver'

/**
 * 页头：顶部导航
 * @param {*} param0
 * @returns
 */
const Header = props => {
  const [fixedNav, setFixedNav] = useState(false)
  const [textWhite, setTextWhite] = useState(false)
  const [navBgWhite, setBgWhite] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const router = useRouter()
  const slideOverRef = useRef()

  const toggleMenuOpen = () => {
    slideOverRef?.current?.toggleSlideOvers()
  }

  /**
   * 根据滚动条，切换导航栏样式
   */
  const scrollTrigger = useCallback(
    throttle(() => {
      const scrollS = window.scrollY
      // 导航栏设置 白色背景
      if (scrollS <= 1) {
        setFixedNav(false)
        setBgWhite(false)
        setTextWhite(false)

        // 文章详情页特殊处理
        if (document?.querySelector('#post-bg')) {
          setFixedNav(true)
          setTextWhite(true)
        }
      } else {
        // 向下滚动后的导航样式
        setFixedNav(true)
        setTextWhite(false)
        setBgWhite(true)
      }
    }, 100)
  )
  useEffect(() => {
    scrollTrigger()
  }, [router])

  // 监听滚动
  useEffect(() => {
    window.addEventListener('scroll', scrollTrigger)
    return () => {
      window.removeEventListener('scroll', scrollTrigger)
    }
  }, [])

  // 导航栏根据滚动轮播菜单内容
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

    if (isBrowser) {
      window.addEventListener('scroll', handleScroll)
    }

    return () => {
      if (isBrowser) {
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  return (
    <>
      <style jsx>{`
        @keyframes fade-in-down {
          0% {
            opacity: 0.5;
            transform: translateY(-30%);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          0% {
            opacity: 0.5;
            transform: translateY(30%);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-in-down {
          animation: fade-in-down 0.3s ease-in-out;
        }

        .fade-in-up {
          animation: fade-in-up 0.3s ease-in-out;
        }

        /* 液态玻璃药丸 - 用于平滑过渡 */
        .nav-pill {
          backdrop-filter: saturate(100%) blur(0px);
          -webkit-backdrop-filter: saturate(100%) blur(0px);
          background: transparent;
          border-radius: 9999px;
          box-shadow: none;
          border: 1px solid transparent;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* 液态玻璃药丸 - 激活态 */
        .nav-pill.glass-active {
          backdrop-filter: saturate(180%) blur(24px);
          -webkit-backdrop-filter: saturate(180%) blur(24px);
          background: rgba(255, 255, 255, 0.68);
          box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.04),
            0 2px 8px rgba(0, 0, 0, 0.02),
            inset 0 1px 0 rgba(255, 255, 255, 0.5);
          border-color: rgba(255, 255, 255, 0.3);
        }

        /* 暗黑模式液态玻璃 */
        :global(.dark) .nav-pill.glass-active {
          background: rgba(30, 28, 40, 0.72);
          border-color: rgba(255, 255, 255, 0.12);
          box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.3),
            0 2px 8px rgba(0, 0, 0, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.08),
            inset 0 0 0 0.5px rgba(255, 255, 255, 0.05);
        }

        /* 悬浮渐变光晕效果 */
        .nav-pill.glass-active:hover {
          transform: scale(1.03);
          background: linear-gradient(
              135deg,
              rgba(99, 102, 241, 0.1),
              rgba(168, 85, 247, 0.08),
              rgba(236, 72, 153, 0.06)
            ),
            rgba(255, 255, 255, 0.75);
          border-color: rgba(139, 92, 246, 0.25);
          box-shadow:
            0 8px 32px rgba(139, 92, 246, 0.1),
            0 2px 8px rgba(139, 92, 246, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.6);
        }

        :global(.dark) .nav-pill.glass-active:hover {
          transform: scale(1.03);
          background: linear-gradient(
              135deg,
              rgba(99, 102, 241, 0.18),
              rgba(168, 85, 247, 0.14),
              rgba(236, 72, 153, 0.1)
            ),
            rgba(30, 28, 40, 0.78);
          border-color: rgba(139, 92, 246, 0.3);
          box-shadow:
            0 8px 32px rgba(139, 92, 246, 0.15),
            0 2px 8px rgba(139, 92, 246, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            inset 0 0 0 0.5px rgba(139, 92, 246, 0.15);
        }

        /* 文章标题药丸 */
        .post-title-pill.glass-active {
          cursor: pointer;
        }

        .post-title-pill:hover .post-title-text {
          background: linear-gradient(135deg, #6366f1, #a855f7, #ec4899);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
        }
      `}</style>

      {/* fixed时留白高度 */}
      {fixedNav && !document?.querySelector('#post-bg') && (
        <div className='h-16'></div>
      )}

      {/* 顶部导航菜单栏 */}
      <nav
        id='nav'
        className={`z-20 h-16 top-0 w-full duration-300 transition-all
            ${fixedNav ? 'fixed' : 'relative bg-transparent'}
            ${textWhite ? 'text-white ' : 'text-black dark:text-white'}
            ${navBgWhite ? '' : 'bg-transparent'}`}>
        <div className={`flex h-full mx-auto justify-between items-center max-w-[86rem] px-6 ${navBgWhite ? 'gap-3' : ''}`}>
          {/* 左侧药丸 - Logo */}
          <div className={`nav-pill flex items-center flex-shrink-0
              ${navBgWhite ? 'glass-active px-5 py-2' : ''}`}>
            <Logo {...props} />
          </div>

          {/* 中间区域 - 菜单药丸与标题药丸独立切换 */}
          <div
            id='nav-bar-swipe'
            className='hidden lg:flex flex-grow justify-center items-center relative w-full h-full'>
            {/* 菜单药丸 */}
            <div
              className={`absolute inset-0 flex items-center justify-center transition-all duration-500
                ${activeIndex === 0 ? 'opacity-100' : 'opacity-0 -translate-y-5 pointer-events-none'}`}>
              <div className={`nav-pill flex items-center
                  ${navBgWhite ? 'glass-active h-12 px-1' : ''}`}>
                <MenuListTop {...props} />
              </div>
            </div>
            {/* 标题药丸 - 文章页显示文章标题，其他页显示作者信息 */}
            <div
              className={`absolute inset-0 flex items-center justify-center transition-all duration-500
                ${activeIndex === 1 ? 'opacity-100' : 'opacity-0 translate-y-5 pointer-events-none'}`}>
              <div
                title={props.post ? '返回顶部' : ''}
                className={`nav-pill flex items-center
                  ${navBgWhite ? 'glass-active h-11 px-4' : ''}
                  ${props.post ? 'post-title-pill' : ''}`}
                onClick={props.post ? () => window.scrollTo({ top: 0, behavior: 'smooth' }) : undefined}>
                {props.post ? (
                  <span className='post-title-text font-bold text-base truncate max-w-[36rem]'>
                    {props.post.title}
                  </span>
                ) : (
                  <h2 className='font-bold text-center text-light-400 dark:text-gray-400 whitespace-nowrap'>
                    {siteConfig('AUTHOR') || siteConfig('TITLE')}{' '}
                    {siteConfig('BIO') && <>|</>} {siteConfig('BIO')}
                  </h2>
                )}
              </div>
            </div>
          </div>

          {/* 右侧药丸 - 操作按钮 */}
          <div className={`nav-pill flex flex-shrink-0 justify-end items-center
              ${navBgWhite ? 'glass-active px-0.5 py-0.5' : ''}`}>
            <RandomPostButton {...props} />
            <SearchButton {...props} />
            {!JSON.parse(siteConfig('THEME_SWITCH')) && (
              <div className='hidden md:block'>
                <DarkModeButton {...props} />
              </div>
            )}
            <ReadingProgress />

            {/* 移动端菜单按钮 */}
            <div
              onClick={toggleMenuOpen}
              className='flex lg:hidden w-8 justify-center items-center h-8 cursor-pointer'>
              <i className='fas fa-bars' />
            </div>
          </div>

          {/* 右边侧拉抽屉 */}
          <SlideOver cRef={slideOverRef} {...props} />
        </div>
      </nav>
    </>
  )
}

export default Header
