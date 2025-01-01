'use client'
import { useGlobal } from '@/lib/global'
import { useEffect, useState } from 'react'

/**
 * 高科技风格加载动画
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
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.3);
            opacity: 0.7;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes cyber-glow {
          0% {
            box-shadow: 0 0 5px rgba(54, 228, 218, 0.5),
                        0 0 10px rgba(54, 228, 218, 0.3),
                        0 0 15px rgba(54, 228, 218, 0.1);
          }
          50% {
            box-shadow: 0 0 10px rgba(54, 228, 218, 0.8),
                        0 0 20px rgba(54, 228, 218, 0.5),
                        0 0 30px rgba(54, 228, 218, 0.3);
          }
          100% {
            box-shadow: 0 0 5px rgba(54, 228, 218, 0.5),
                        0 0 10px rgba(54, 228, 218, 0.3),
                        0 0 15px rgba(54, 228, 218, 0.1);
          }
        }

        @keyframes scan {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
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
          backdrop-filter: blur(8px);
          background: radial-gradient(
            circle at center,
            rgba(54, 228, 218, 0.1) 0%,
            rgba(0, 0, 0, 0) 70%
          );
        }

        .loader-container {
          position: relative;
          width: 120px;
          height: 120px;
          margin: 0 auto;
        }

        .loader {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 60px;
          height: 60px;
          margin: -30px 0 0 -30px;
          border: 3px solid rgba(54, 228, 218, 0.1);
          border-radius: 50%;
          border-top-color: #36e4da;
          animation: rotate 1s linear infinite;
          box-shadow: 0 0 10px rgba(54, 228, 218, 0.5);
        }

        .loader-pulse {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 80px;
          height: 80px;
          margin: -40px 0 0 -40px;
          border: 2px solid rgba(54, 228, 218, 0.3);
          border-radius: 50%;
          animation: pulse 1.5s ease-in-out infinite;
        }

        .cyber-circle {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100px;
          height: 100px;
          margin: -50px 0 0 -50px;
          border: 1px solid rgba(54, 228, 218, 0.3);
          border-radius: 50%;
          animation: cyber-glow 2s ease-in-out infinite;
        }

        .scan-line {
          position: absolute;
          width: 100%;
          height: 2px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(54, 228, 218, 0.5) 50%,
            transparent 100%
          );
          animation: scan 2s linear infinite;
        }

        .cyber-text {
          position: absolute;
          width: 100%;
          text-align: center;
          bottom: -40px;
          font-family: monospace;
          font-size: 12px;
          color: #36e4da;
          text-shadow: 0 0 5px rgba(54, 228, 218, 0.5);
          opacity: 0.8;
        }

        .corner {
          position: absolute;
          width: 10px;
          height: 10px;
          border: 2px solid rgba(54, 228, 218, 0.5);
        }

        .corner-tl {
          top: -5px;
          left: -5px;
          border-right: none;
          border-bottom: none;
        }

        .corner-tr {
          top: -5px;
          right: -5px;
          border-left: none;
          border-bottom: none;
        }

        .corner-bl {
          bottom: -5px;
          left: -5px;
          border-right: none;
          border-top: none;
        }

        .corner-br {
          bottom: -5px;
          right: -5px;
          border-left: none;
          border-top: none;
        }

        :global(.dark) .loader {
          border-color: rgba(255, 255, 255, 0.1);
          border-top-color: #fff;
        }

        :global(.dark) .loader-pulse {
          border-color: rgba(255, 255, 255, 0.2);
        }
      `}</style>
      <div
        id='loading-cover'
        onClick={handleClick}
        className={`loading-cover bg-white/60 dark:bg-black/60 animate__animated animate__faster ${onLoading ? 'animate__fadeIn' : 'animate__fadeOut'
          }`}
      >
        <div className="loader-container">
          <div className="cyber-circle" />
          <div className="loader-pulse" />
          <div className="loader" />
          <div className="scan-line" />
          <div className="corner corner-tl" />
          <div className="corner corner-tr" />
          <div className="corner corner-bl" />
          <div className="corner corner-br" />
          <div className="cyber-text">SYSTEM LOADING...</div>
        </div>
      </div>
    </>
  ) : null
}
