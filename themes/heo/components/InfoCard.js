import { ArrowRightCircle } from '@/components/HeroIcons'
import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect, useRef } from 'react'
import CONFIG from '../config'
import Announcement from './Announcement'
import Card from './Card'

/**
 * 社交信息卡
 * @param {*} props
 * @returns
 */
export function InfoCard(props) {
  const { siteInfo, notice } = props
  const router = useRouter()
  const avatarRef = useRef(null)
  const cardRef = useRef(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [stars, setStars] = useState([])

  // 在文章详情页特殊处理
  const isSlugPage = router.pathname.indexOf('/[prefix]') === 0
  const url1 = siteConfig('HEO_INFO_CARD_URL1', null, CONFIG)
  const icon1 = siteConfig('HEO_INFO_CARD_ICON1', null, CONFIG)
  const url2 = siteConfig('HEO_INFO_CARD_URL2', null, CONFIG)
  const icon2 = siteConfig('HEO_INFO_CARD_ICON2', null, CONFIG)

  // 生成随机星星
  useEffect(() => {
    const generateStars = () => {
      const newStars = []
      for (let i = 0; i < 20; i++) {
        newStars.push({
          id: i,
          left: Math.random() * 100,
          top: Math.random() * 100,
          size: Math.random() * 3 + 1,
          delay: Math.random() * 2,
          duration: Math.random() * 1 + 1
        })
      }
      setStars(newStars)
    }
    generateStars()
  }, [])

  // 处理鼠标移动事件
  const handleMouseMove = (e) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY

    // 计算旋转角度（最大±10度）
    const rotateX = (mouseY / (rect.height / 2)) * -10
    const rotateY = (mouseX / (rect.width / 2)) * 10

    setMousePosition({ x: rotateY, y: rotateX })
  }

  // 处理鼠标进入事件
  const handleMouseEnter = () => {
    setIsHovering(true)
  }

  // 处理鼠标离开事件
  const handleMouseLeave = () => {
    setIsHovering(false)
    setMousePosition({ x: 0, y: 0 })
  }

  // 添加和移除事件监听器
  useEffect(() => {
    const card = cardRef.current
    if (card) {
      card.addEventListener('mousemove', handleMouseMove)
      card.addEventListener('mouseenter', handleMouseEnter)
      card.addEventListener('mouseleave', handleMouseLeave)

      return () => {
        card.removeEventListener('mousemove', handleMouseMove)
        card.removeEventListener('mouseenter', handleMouseEnter)
        card.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [])

  return (
    <div className="perspective-3000">
      <Card
        ref={cardRef}
        className='wow fadeInUp bg-gradient-to-br from-blue-500 via-blue-400 to-blue-500 dark:from-yellow-500 dark:via-yellow-400 dark:to-yellow-500 text-white flex flex-col w-72 h-[320px] relative p-5 overflow-hidden group transition-all duration-300 hover:shadow-2xl'
        style={{
          transform: isHovering
            ? `rotateX(${mousePosition.y}deg) rotateY(${mousePosition.x}deg)`
            : 'rotateX(0deg) rotateY(0deg)',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.3s ease-out'
        }}
      >
        {/* 背景装饰 */}
        <div className='absolute inset-0 bg-[url("/images/patterns/pattern-1-light.svg")] dark:bg-[url("/images/patterns/pattern-1-dark.svg")] opacity-30 bg-repeat bg-[length:48px_48px] animate-pattern-slide'></div>

        {/* 光泽效果 */}
        <div
          className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none'
          style={{
            background: isHovering
              ? `radial-gradient(circle at ${((mousePosition.x + 10) * 5)}% ${((mousePosition.y + 10) * 5)}%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 60%)`
              : 'none'
          }}
        ></div>

        {/* 星星闪烁效果 */}
        <div className='absolute inset-0 overflow-hidden'>
          {stars.map(star => (
            <div
              key={star.id}
              className='absolute rounded-full bg-white animate-twinkle'
              style={{
                left: `${star.left}%`,
                top: `${star.top}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                animationDelay: `${star.delay}s`,
                animationDuration: `${star.duration}s`
              }}
            ></div>
          ))}
        </div>

        {/* 光束效果 */}
        <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700'>
          <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-[200%] bg-gradient-to-b from-white/0 via-white/5 to-white/0 rotate-45 transform -translate-x-full animate-light-beam'></div>
        </div>

        {/* 卡片内容 */}
        <div className='flex flex-col items-center relative z-10' style={{ transform: 'translateZ(50px)' }}>
          {/* 原有内容保持不变 */}
          {/* 问候语 - 可点击切换 */}
          <div className='mb-4 cursor-pointer transform hover:scale-105 transition-all duration-200'>
            <GreetingsWords />
          </div>

          {/* 头像和描述容器 */}
          <div className='relative w-full flex justify-center items-center mb-10 group/avatar perspective-1000'>
            {/* 头像装饰光环 */}
            <div className='absolute inset-0 bg-gradient-to-r from-white/0 via-white/50 to-white/0 rounded-full blur opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-700 animate-halo'></div>

            {/* 头像容器 */}
            <div
              ref={avatarRef}
              className='relative transform-gpu transition-transform duration-200 ease-out'
              style={{
                transform: isHovering
                  ? `rotateX(${mousePosition.y}deg) rotateY(${mousePosition.x}deg)`
                  : 'rotateX(0deg) rotateY(0deg)',
                transformStyle: 'preserve-3d'
              }}
            >
              {/* 头像正面 */}
              <LazyImage
                src={siteInfo?.icon}
                className='rounded-2xl w-[120px] h-[120px] object-cover transition-all duration-500 group-hover/avatar:scale-110 group-hover/avatar:shadow-xl'
                width={120}
                height={120}
                alt={siteConfig('AUTHOR')}
              />

              {/* 头像悬浮信息 */}
              <div className='absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-2xl opacity-0 group-hover/avatar:opacity-100 transition-all duration-300'>
                <div className='text-center text-white px-2 transform translate-z-30'>
                  <div className='text-sm font-medium mb-1'>测试开发工程师</div>
                  <div className='text-xs opacity-80'>热爱生活，热爱编程</div>
                </div>
              </div>

              {/* 3D 效果阴影 */}
              <div
                className='absolute inset-0 rounded-2xl bg-black/20 blur-md -z-10 transition-transform duration-200'
                style={{
                  transform: isHovering
                    ? `translateZ(-20px) rotateX(${mousePosition.y}deg) rotateY(${mousePosition.x}deg)`
                    : 'translateZ(-20px)'
                }}
              ></div>
            </div>
          </div>

          {/* 底部信息组 */}
          <div className='flex justify-between items-center w-full'>
            {/* 左侧名称和描述 */}
            <Link href='/about' className='group/link flex flex-col hover:scale-105 transition-all duration-200'>
              <h2 className='text-xl font-bold group-hover/link:text-white/90'>{siteConfig('AUTHOR')}</h2>
              <div className='text-sm text-white/80 group-hover/link:text-white/70'>无限进步</div>
            </Link>

            {/* 右侧社交图标 */}
            <div className='flex items-center gap-2'>
              {url1 && (
                <Link href={url1} className='transform hover:scale-110 transition-all duration-200'>
                  <div className='w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center backdrop-blur-sm transition-all duration-200 hover:rotate-12'>
                    <i className={`${icon1} text-xl`}></i>
                  </div>
                </Link>
              )}
              {url2 && (
                <Link href={url2} className='transform hover:scale-110 transition-all duration-200'>
                  <div className='w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center backdrop-blur-sm transition-all duration-200 hover:rotate-12'>
                    <i className={`${icon2} text-xl`}></i>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* 添加动画样式 */}
        <style jsx global>{`
          .perspective-3000 {
            perspective: 3000px;
          }

          @keyframes pattern-slide {
            0% {
              background-position: 0 0;
            }
            100% {
              background-position: 48px 48px;
            }
          }

          .animate-pattern-slide {
            animation: pattern-slide 20s linear infinite;
          }

          @keyframes halo {
            0%, 100% {
              transform: rotate(0deg) scale(1);
            }
            50% {
              transform: rotate(180deg) scale(1.2);
            }
          }

          .animate-halo {
            animation: halo 10s ease-in-out infinite;
          }

          @keyframes light-beam {
            0% {
              transform: translateX(-200%) rotate(45deg);
            }
            100% {
              transform: translateX(200%) rotate(45deg);
            }
          }

          .animate-light-beam {
            animation: light-beam 3s ease-in-out infinite;
          }

          @keyframes twinkle {
            0%, 100% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.3;
              transform: scale(0.5);
            }
          }

          .animate-twinkle {
            animation: twinkle var(--duration, 2s) ease-in-out infinite;
            animation-delay: var(--delay, 0s);
          }

          .perspective-1000 {
            perspective: 1000px;
          }

          .translate-z-30 {
            transform: translateZ(30px);
          }

          @keyframes greeting-change {
            0% {
              transform: translateY(0);
              opacity: 1;
            }
            50% {
              transform: translateY(-10px);
              opacity: 0;
            }
            100% {
              transform: translateY(0);
              opacity: 1;
            }
          }

          .animate-greeting-change {
            animation: greeting-change 0.3s ease-in-out;
          }
        `}</style>
      </Card>
    </div>
  )
}

/**
 * 了解更多按钮
 * @returns
 */
function MoreButton() {
  const url3 = siteConfig('HEO_INFO_CARD_URL3', null, CONFIG)
  const text3 = siteConfig('HEO_INFO_CARD_TEXT3', null, CONFIG)
  if (!url3) {
    return <></>
  }
  return (
    <Link href={url3}>
      <div className='group bg-white/20 hover:bg-white/30 flex items-center transition-all duration-200 py-2 px-3 rounded-full space-x-1 backdrop-blur-sm'>
        <ArrowRightCircle className='w-6 h-6 transition-all duration-200 group-hover:translate-x-1' />
        <div className='font-bold'>{text3}</div>
      </div>
    </Link>
  )
}

/**
 * 欢迎语
 */
function GreetingsWords() {
  const greetings = siteConfig('HEO_INFOCARD_GREETINGS', null, CONFIG)
  const [greeting, setGreeting] = useState(greetings[0])
  const [isAnimating, setIsAnimating] = useState(false)

  // 每次点击，随机获取greetings中的一个
  const handleChangeGreeting = () => {
    setIsAnimating(true)
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * greetings.length)
      setGreeting(greetings[randomIndex])
      setIsAnimating(false)
    }, 300)
  }

  return (
    <div
      onClick={handleChangeGreeting}
      className={`select-none cursor-pointer py-1 px-3 bg-white/20 hover:bg-white/30 text-sm rounded-lg backdrop-blur-sm transition-all duration-200 ${isAnimating ? 'animate-greeting-change' : ''}`}
    >
      {greeting}
    </div>
  )
}
