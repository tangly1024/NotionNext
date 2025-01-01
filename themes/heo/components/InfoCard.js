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
        className='wow fadeInUp relative w-72 h-[320px] overflow-hidden group transition-all duration-300 hover:shadow-2xl'
        style={{
          transform: isHovering
            ? `rotateX(${mousePosition.y}deg) rotateY(${mousePosition.x}deg)`
            : 'rotateX(0deg) rotateY(0deg)',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.3s ease-out'
        }}
      >
        {/* 背景图片 */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-110"
          style={{
            backgroundImage: 'url("/images/infoCardBg.png")',
            filter: 'brightness(0.85) contrast(1.1)'
          }}
        />

        {/* 添加一个非常淡的遮罩，以确保文字可读性 */}
        <div className="absolute inset-0 bg-black/10 dark:bg-black/20" />

        {/* 装饰图案 */}
        <div className='absolute inset-0 bg-[url("/images/patterns/pattern-1-light.svg")] dark:bg-[url("/images/patterns/pattern-1-dark.svg")] opacity-20 bg-repeat bg-[length:48px_48px] animate-pattern-slide'></div>

        {/* 光泽效果 */}
        <div
          className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none'
          style={{
            background: isHovering
              ? `radial-gradient(circle at ${((mousePosition.x + 10) * 5)}% ${((mousePosition.y + 10) * 5)}%, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 60%)`
              : 'none'
          }}
        />

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
            />
          ))}
        </div>

        {/* 光束效果 */}
        <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700'>
          <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-[200%] bg-gradient-to-b from-white/0 via-white/5 to-white/0 rotate-45 transform -translate-x-full animate-light-beam'></div>
        </div>

        {/* 卡片内容 - 调整内部布局 */}
        <div className='relative flex flex-col justify-between h-full p-5 z-10' style={{ transform: 'translateZ(50px)' }}>
          {/* 上部分内容 */}
          <div className='flex flex-col items-center'>
            {/* 问候语 */}
            <div className='mb-4'>
              <GreetingsWords />
            </div>

            {/* 头像部分 */}
            <div className='relative w-full flex justify-center items-center mb-6 group/avatar perspective-1000'>
              {/* 头像装饰光环 */}
              <div className='absolute inset-0 bg-gradient-to-r from-white/0 via-white/50 to-white/0 rounded-full blur opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-700 animate-halo'></div>

              {/* 头像容器 */}
              <div
                ref={avatarRef}
                className='relative transform-gpu transition-all duration-300 ease-out hover:scale-110'
                style={{
                  transform: isHovering
                    ? `translateZ(50px) rotateX(${mousePosition.y}deg) rotateY(${mousePosition.x}deg)`
                    : 'translateZ(0) rotateX(0deg) rotateY(0deg)',
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* 头像正面 */}
                <div className="relative">
                  <LazyImage
                    src={siteInfo?.icon}
                    className='rounded-2xl w-[120px] h-[120px] object-cover transition-all duration-500 group-hover/avatar:shadow-2xl'
                    width={120}
                    height={120}
                    alt={siteConfig('AUTHOR')}
                  />

                  {/* 头像边框发光效果 */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-yellow-500 dark:to-orange-500 rounded-2xl opacity-0 group-hover/avatar:opacity-70 blur transition-all duration-500 -z-10"></div>
                </div>

                {/* 头像悬浮信息 - 前面板 */}
                <div
                  className='absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-2xl opacity-0 group-hover/avatar:opacity-100 transition-all duration-300'
                  style={{ transform: 'translateZ(60px)' }}
                >
                  <div className='text-center text-white px-2'>
                    <div className='text-sm font-medium mb-1'>测试开发工程师</div>
                    <div className='text-xs opacity-80'>热爱生活，热爱编程</div>
                  </div>
                </div>

                {/* 装饰边框 - 后面板 */}
                <div
                  className='absolute inset-2 border-2 border-white/20 rounded-2xl opacity-0 group-hover/avatar:opacity-100 transition-all duration-300'
                  style={{ transform: 'translateZ(-30px)' }}
                ></div>

                {/* 3D 效果阴影 */}
                <div
                  className='absolute inset-0 rounded-2xl bg-black/20 blur-xl transition-all duration-300'
                  style={{
                    transform: isHovering
                      ? 'translateZ(-50px)'
                      : 'translateZ(-20px)',
                    opacity: isHovering ? 0.5 : 0.2
                  }}
                />
              </div>
            </div>
          </div>

          {/* 底部信息组 */}
          <div className='flex justify-between items-end w-full gap-4'>
            {/* 左侧名称和描述 */}
            <Link href='/about' className='group/link flex flex-col flex-1 hover:scale-105 transition-all duration-200'>
              <h2 className='text-xl font-bold text-white group-hover/link:text-white/90'>{siteConfig('AUTHOR')}</h2>
              <div className='text-sm text-white/80 group-hover/link:text-white/70'>无限进步</div>
            </Link>

            {/* 右侧社交图标 */}
            <div className='flex items-center gap-2 shrink-0'>
              {url1 && (
                <Link href={url1} className='transform hover:scale-110 transition-all duration-200'>
                  <div className='w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center backdrop-blur-sm transition-all duration-200 hover:rotate-12'>
                    <i className={`${icon1} text-xl text-white`}></i>
                  </div>
                </Link>
              )}
              {url2 && (
                <Link href={url2} className='transform hover:scale-110 transition-all duration-200'>
                  <div className='w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center backdrop-blur-sm transition-all duration-200 hover:rotate-12'>
                    <i className={`${icon2} text-xl text-white`}></i>
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

          .group-hover\/avatar:hover {
            transform: scale(1.1);
          }

          @keyframes float {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          .animate-float {
            animation: float 3s ease-in-out infinite;
          }

          @keyframes glow {
            0%, 100% {
              opacity: 0.5;
            }
            50% {
              opacity: 0.8;
            }
          }

          .animate-glow {
            animation: glow 2s ease-in-out infinite;
          }

          @keyframes rotate3d {
            0% {
              transform: rotate3d(0, 1, 0, 0deg);
            }
            100% {
              transform: rotate3d(0, 1, 0, 360deg);
            }
          }

          .hover\:rotate3d:hover {
            animation: rotate3d 8s linear infinite;
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
  const [greeting, setGreeting] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [sparkles, setSparkles] = useState([])
  const greetingRef = useRef(null)

  // 根据时间生成问候语
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours()
    const timeGreetings = {
      morning: ['早安，准备开始一天的工作了吗？', '早上好，今天也要元气满满哦！', '早安，一日之计在于晨'],
      noon: ['午安，要记得午休哦', '中午好，要不要小憩一下？', '午安，来杯下午茶吧'],
      afternoon: ['下午好，要来杯咖啡吗？', '下午茶时间到！', '悠闲的下午时光'],
      evening: ['晚上好，今天过得怎么样？', '夜幕降临，放松一下吧', '晚安，记得早点休息哦'],
      midnight: ['夜深了，还在加班吗？', '深夜了，要注意休息哦', '已经很晚了，早点休息吧']
    }

    let timeBasedGreetings
    if (hour >= 5 && hour < 11) {
      timeBasedGreetings = timeGreetings.morning
    } else if (hour >= 11 && hour < 13) {
      timeBasedGreetings = timeGreetings.noon
    } else if (hour >= 13 && hour < 18) {
      timeBasedGreetings = timeGreetings.afternoon
    } else if (hour >= 18 && hour < 23) {
      timeBasedGreetings = timeGreetings.evening
    } else {
      timeBasedGreetings = timeGreetings.midnight
    }

    return timeBasedGreetings[Math.floor(Math.random() * timeBasedGreetings.length)]
  }

  // 初始化问候语
  useEffect(() => {
    setGreeting(getTimeBasedGreeting())
  }, [])

  // 生成随机火花效果
  useEffect(() => {
    const generateSparkles = () => {
      const newSparkles = []
      for (let i = 0; i < 10; i++) {
        newSparkles.push({
          id: i,
          left: Math.random() * 100,
          top: Math.random() * 100,
          size: Math.random() * 4 + 1,
          delay: Math.random() * 1,
          duration: Math.random() * 0.5 + 0.5
        })
      }
      setSparkles(newSparkles)
    }
    generateSparkles()
  }, [greeting])

  // 每次点击，随机获取问候语
  const handleChangeGreeting = (e) => {
    e.stopPropagation() // 阻止事件冒泡
    if (isAnimating) return
    setIsAnimating(true)

    // 添加点击波纹效果
    const rect = greetingRef.current?.getBoundingClientRect()
    if (rect) {
      const ripple = document.createElement('div')
      ripple.className = 'greeting-ripple'
      ripple.style.left = `${e.clientX - rect.left}px`
      ripple.style.top = `${e.clientY - rect.top}px`
      greetingRef.current?.appendChild(ripple)
      setTimeout(() => ripple.remove(), 1000)
    }

    setTimeout(() => {
      // 随机选择：80%概率使用时间相关问候语，20%概率使用自定义问候语
      const useTimeBasedGreeting = Math.random() < 0.8
      let newGreeting
      do {
        if (useTimeBasedGreeting) {
          newGreeting = getTimeBasedGreeting()
        } else {
          const randomIndex = Math.floor(Math.random() * greetings.length)
          newGreeting = greetings[randomIndex]
        }
      } while (newGreeting === greeting)
      setGreeting(newGreeting)
      setIsAnimating(false)
    }, 300)
  }

  // 获取时间相关的图标
  const getTimeIcon = () => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 11) return 'fas fa-sun animate-spin-slow text-yellow-500'
    if (hour >= 11 && hour < 13) return 'fas fa-cloud-sun animate-pulse text-orange-500'
    if (hour >= 13 && hour < 18) return 'fas fa-sun animate-spin-slow text-orange-500'
    if (hour >= 18 && hour < 23) return 'fas fa-moon animate-bounce text-blue-500'
    return 'fas fa-stars animate-twinkle text-purple-500'
  }

  return (
    <div
      ref={greetingRef}
      className="greeting-container relative select-none cursor-pointer group"
      onClick={handleChangeGreeting}
      onMouseEnter={(e) => {
        e.stopPropagation()
        setIsHovering(true)
      }}
      onMouseLeave={(e) => {
        e.stopPropagation()
        setIsHovering(false)
      }}
    >
      {/* 主要内容 */}
      <div
        className={`
          relative z-10 py-2 px-4 
          bg-gradient-to-r from-white/20 to-white/10
          hover:from-white/30 hover:to-white/20
          rounded-lg backdrop-blur-sm
          transition-all duration-300
          border border-white/10
          hover:border-white/20
          shadow-lg hover:shadow-xl
          transform hover:-translate-y-0.5
          overflow-hidden
          ${isAnimating ? 'animate-greeting-change' : ''}
        `}
      >
        {/* 火花效果 */}
        {isHovering && sparkles.map(spark => (
          <div
            key={spark.id}
            className="absolute w-1 h-1 bg-white rounded-full animate-sparkle pointer-events-none"
            style={{
              left: `${spark.left}%`,
              top: `${spark.top}%`,
              width: `${spark.size}px`,
              height: `${spark.size}px`,
              animationDelay: `${spark.delay}s`,
              animationDuration: `${spark.duration}s`
            }}
          />
        ))}

        {/* 文字内容 */}
        <div className="relative z-10 flex items-center gap-2">
          <span className="text-sm font-medium text-white/90 group-hover:text-white transition-colors duration-300">
            {greeting}
          </span>
          <span className="text-xs text-white/60 group-hover:text-white/80 transition-colors duration-300">
            <i className={getTimeIcon()} />
          </span>
        </div>

        {/* 光束效果 */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/0 via-white/5 to-white/0 -skew-x-12 animate-shine" />
        </div>

        {/* 悬浮光晕 */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 blur-xl" />
        </div>
      </div>

      {/* 添加动画样式 */}
      <style jsx>{`
        @keyframes greeting-change {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          50% {
            transform: translateY(-5px) scale(0.95);
            opacity: 0;
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes shine {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }

        .animate-sparkle {
          animation: sparkle var(--duration, 1s) ease-in-out infinite;
          animation-delay: var(--delay, 0s);
        }

        .animate-shine {
          animation: shine 2s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }

        .greeting-ripple {
          position: absolute;
          border-radius: 50%;
          width: 100px;
          height: 100px;
          background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%);
          transform: translate(-50%, -50%) scale(0);
          animation: ripple 1s ease-out;
          pointer-events: none;
        }

        @keyframes ripple {
          to {
            transform: translate(-50%, -50%) scale(4);
            opacity: 0;
          }
        }

        @keyframes stars-twinkle {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(0.8);
          }
        }

        .animate-twinkle {
          animation: stars-twinkle 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
