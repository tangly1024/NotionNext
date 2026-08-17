'user client'
import { useGlobal } from '@/lib/global'
import { useEffect, useState } from 'react'
/**
 * @see https://css-loaders.com/
 * @returns 加载动画
 */
export default function LoadingCover() {
  const { onLoading, setOnLoading } = useGlobal()
  const [isVisible, setIsVisible] = useState(false) // 初始状态设置为false，避免服务端渲染与客户端渲染不一致

  useEffect(() => {
    // 确保在客户端渲染时才设置可见性
    if (onLoading) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [onLoading])

  const handleClick = () => {
    setOnLoading(false) // 强行关闭 LoadingCover
  }

  if (typeof window === 'undefined') {
    return null // 避免在服务端渲染时渲染出这个组件
  }

  return isVisible ? (
    <div
      id='loading-cover'
      onClick={handleClick}
      className={`dark:text-white text-black bg-white dark:bg-black animate__animated animate__faster ${
        onLoading ? 'animate__fadeIn' : 'animate__fadeOut'
      } flex flex-col justify-center z-50 w-full h-screen fixed top-0 left-0`}>
      <div className='mx-auto'>
        <style global>
          {`
            .loading-logo {
              width: 104px;
              height: 104px;
              border-radius: 50%;
              object-fit: cover;
              border: 3px solid rgba(217, 119, 6, 0.35);
              box-shadow: 0 0 24px rgba(217, 119, 6, 0.4);
              animation: loading-logo-pulse 2.2s ease-in-out infinite;
            }
            @keyframes loading-logo-pulse {
              0%,
              100% {
                transform: scale(1);
                box-shadow: 0 0 24px rgba(217, 119, 6, 0.35);
              }
              50% {
                transform: scale(1.06);
                box-shadow: 0 0 52px rgba(217, 119, 6, 0.65);
              }
            }
            @media (max-width: 640px) {
              .loading-logo {
                width: 88px;
                height: 88px;
              }
            }
          `}
        </style>
        <img src='/favicon.png' alt='logo' className='loading-logo' />
      </div>
    </div>
  ) : null
}
