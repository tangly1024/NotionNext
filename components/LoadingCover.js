'use client'
import { useGlobal } from '@/lib/global'
import { useEffect, useState } from 'react'

/**
 * @see https://css-loaders.com/
 * @returns 加载动画
 */
export default function LoadingCover() {
  const { onLoading, setOnLoading } = useGlobal()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (onLoading) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [onLoading])

  const handleClick = () => {
    setOnLoading(false)
  }

  if (typeof window === 'undefined') {
    return null
  }

  return isVisible ? (
    <>
      <style jsx>{`
        @keyframes l2 {
          100% {
            box-shadow: 0 0 0 40px transparent;
          }
        }
        .loading-cover {
          display: flex;
          flex-direction: column;
          justify-content: center;
          z-index: 50;
          width: 100%;
          height: 100vh;
          position: fixed;
          top: 0;
          left: 0;
        }
        .loader {
          width: 20px;
          aspect-ratio: 1;
          border-radius: 50%;
          background: #000;
          box-shadow: 0 0 0 0 rgba(0,0,0,0.2);
          animation: l2 1.5s infinite linear;
          position: relative;
        }
        .loader:before,
        .loader:after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          box-shadow: 0 0 0 0 rgba(0,0,0,0.2);
          animation: inherit;
        }
        .loader:before {
          animation-delay: -0.5s;
        }
        .loader:after {
          animation-delay: -1s;
        }
        :global(.dark) .loader {
          background: #fff;
          box-shadow: 0 0 0 0 rgba(255,255,255,0.2);
        }
        :global(.dark) .loader:before,
        :global(.dark) .loader:after {
          box-shadow: 0 0 0 0 rgba(255,255,255,0.2);
        }
      `}</style>
      <div
        id='loading-cover'
        onClick={handleClick}
        className={`loading-cover bg-white dark:bg-black animate__animated animate__faster ${onLoading ? 'animate__fadeIn' : 'animate__fadeOut'
          }`}
      >
        <div className='mx-auto'>
          <div className='loader'></div>
        </div>
      </div>
    </>
  ) : null
}
