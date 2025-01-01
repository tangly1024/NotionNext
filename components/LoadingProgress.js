import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

/**
 * 高科技风格进度条
 */
export default function LoadingProgress() {
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let timer = null

    const handleStart = () => {
      setIsLoading(true)
      setProgress(0)

      timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 85) {
            clearInterval(timer)
            return 85
          }
          return prev + (90 - prev) * 0.1
        })
      }, 100)
    }

    const handleComplete = () => {
      clearInterval(timer)
      setProgress(100)
      setTimeout(() => {
        setIsLoading(false)
      }, 300)
    }

    const handleError = () => {
      clearInterval(timer)
      setProgress(100)
      setTimeout(() => {
        setIsLoading(false)
      }, 300)
    }

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleError)

    return () => {
      clearInterval(timer)
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleError)
    }
  }, [router])

  if (!isLoading) return null

  return (
    <>
      <style jsx>{`
        .progress-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 3px;
          z-index: 9999;
          background: rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }

        .progress-bar {
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, 
            #00dc82 0%,
            #36e4da 30%,
            #0047ff 70%,
            #36e4da 100%
          );
          background-size: 200% 100%;
          animation: gradient 2s linear infinite;
          transform-origin: left;
          transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        @keyframes gradient {
          0% {
            background-position: 100% 0;
          }
          100% {
            background-position: -100% 0;
          }
        }

        .progress-glow {
          position: absolute;
          top: 0;
          right: 0;
          width: 150px;
          height: 100%;
          background: linear-gradient(90deg, 
            rgba(54, 228, 218, 0) 0%,
            rgba(54, 228, 218, 0.8) 50%,
            rgba(54, 228, 218, 0) 100%
          );
          transform: translateX(100%);
          animation: glow 2s ease-in-out infinite;
          filter: blur(2px);
        }

        .progress-particles {
          position: absolute;
          top: -2px;
          right: 0;
          width: 100%;
          height: 7px;
          transform: translateX(var(--progress));
          filter: blur(1px);
        }

        .progress-particle {
          position: absolute;
          width: 2px;
          height: 2px;
          border-radius: 50%;
          background: #36e4da;
          box-shadow: 0 0 4px #36e4da;
          animation: particle 1.5s ease-in-out infinite;
        }

        .progress-particle:nth-child(1) { left: 0%; animation-delay: 0s; }
        .progress-particle:nth-child(2) { left: 20%; animation-delay: 0.2s; }
        .progress-particle:nth-child(3) { left: 40%; animation-delay: 0.4s; }
        .progress-particle:nth-child(4) { left: 60%; animation-delay: 0.6s; }
        .progress-particle:nth-child(5) { left: 80%; animation-delay: 0.8s; }

        @keyframes glow {
          0% {
            transform: translateX(-100%) skewX(-45deg);
          }
          100% {
            transform: translateX(100%) skewX(-45deg);
          }
        }

        @keyframes particle {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          50% {
            transform: translateY(-10px) scale(0.8);
            opacity: 0.5;
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        :global(.dark) .progress-container {
          background: rgba(255, 255, 255, 0.05);
        }

        .cyber-line {
          position: absolute;
          top: 3px;
          left: 0;
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(54, 228, 218, 0.2) 50%,
            transparent 100%
          );
          transform: scaleX(var(--progress));
          transform-origin: left;
        }

        .cyber-dots {
          position: absolute;
          top: 4px;
          left: 0;
          width: 100%;
          height: 1px;
          transform: scaleX(var(--progress));
          transform-origin: left;
        }

        .cyber-dot {
          position: absolute;
          width: 1px;
          height: 1px;
          background: rgba(54, 228, 218, 0.5);
          animation: blink 0.8s ease-in-out infinite alternate;
        }

        .cyber-dot:nth-child(1) { left: 20%; animation-delay: 0s; }
        .cyber-dot:nth-child(2) { left: 40%; animation-delay: 0.2s; }
        .cyber-dot:nth-child(3) { left: 60%; animation-delay: 0.4s; }
        .cyber-dot:nth-child(4) { left: 80%; animation-delay: 0.6s; }

        @keyframes blink {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(2); opacity: 1; }
        }

        .scan-line {
          position: absolute;
          top: 0;
          left: var(--progress);
          width: 2px;
          height: 100%;
          background: rgba(54, 228, 218, 0.8);
          box-shadow: 0 0 8px rgba(54, 228, 218, 0.5);
          clip-path: polygon(0 0, 100% 0, 60% 100%, 40% 100%);
          animation: scan 1s ease-in-out infinite alternate;
        }

        @keyframes scan {
          0% { height: 3px; opacity: 0.8; }
          100% { height: 5px; opacity: 1; }
        }
      `}</style>
      <div className="progress-container">
        <div
          className="progress-bar"
          style={{
            transform: `scaleX(${progress / 100})`,
            '--progress': `${progress}%`
          }}
        >
          <div className="progress-glow" />
          <div className="progress-particles">
            <div className="progress-particle" />
            <div className="progress-particle" />
            <div className="progress-particle" />
            <div className="progress-particle" />
            <div className="progress-particle" />
          </div>
          <div className="scan-line" />
        </div>
        <div className="cyber-line" style={{ '--progress': progress / 100 }} />
        <div className="cyber-dots" style={{ '--progress': progress / 100 }}>
          <div className="cyber-dot" />
          <div className="cyber-dot" />
          <div className="cyber-dot" />
          <div className="cyber-dot" />
        </div>
      </div>
    </>
  )
}
