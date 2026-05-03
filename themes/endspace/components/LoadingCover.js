'use client'

import { useState, useEffect, useRef } from 'react'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import CONFIG from '../config'

/**
 * LoadingCover Component - Endfield Style
 * Full-screen loading animation with progress bar
 */
export const LoadingCover = () => {
  const [isVisible, setIsVisible] = useState(true)
  const [displayProgress, setDisplayProgress] = useState(0)
  const [phase, setPhase] = useState('init') // init -> loading -> complete -> sweeping -> fadeout
  const { onLoading } = useGlobal()
  const hasCompletedRef = useRef(false)
  const targetProgressRef = useRef(0)
  const displayProgressRef = useRef(0)

  // Configurable texts
  const siteName = siteConfig('ENDSPACE_LOADING_SITE_NAME', null, CONFIG) || siteConfig('TITLE') || 'CLOUD09_SPACE'
  const textInit = siteConfig('ENDSPACE_LOADING_TEXT_INIT', 'INITIALIZING', CONFIG)
  const textLoading = siteConfig('ENDSPACE_LOADING_TEXT_LOADING', 'LOADING', CONFIG)
  const textComplete = siteConfig('ENDSPACE_LOADING_TEXT_COMPLETE', 'READY', CONFIG)
  const textSweeping = siteConfig('ENDSPACE_LOADING_TEXT_SWEEPING', 'LAUNCHING', CONFIG)
  const textFadeout = siteConfig('ENDSPACE_LOADING_TEXT_FADEOUT', 'WELCOME', CONFIG)
  // Custom Loading Image
  const loadingImage = siteConfig('ENDSPACE_LOADING_IMAGE', null, CONFIG)

  // Resource loading tracking and smooth animation
  useEffect(() => {
    // Prevent body scroll during loading
    document.body.style.overflow = 'hidden'

    // Start loading phase after brief init
    const initTimer = setTimeout(() => {
      setPhase('loading')
    }, 100)

    // Track resources
    let totalResources = 0
    let loadedResources = 0

    // Count initial resources
    const countResources = () => {
      const images = document.images
      totalResources = Math.max(1, images.length)
      
      // Count already loaded images
      for (let i = 0; i < images.length; i++) {
        if (images[i].complete) loadedResources++
      }
      
      // Add event listeners for remaining images
      for (let i = 0; i < images.length; i++) {
        if (!images[i].complete) {
          images[i].addEventListener('load', () => { loadedResources++ })
          images[i].addEventListener('error', () => { loadedResources++ })
        }
      }
    }
    countResources()

    // Smooth animation loop using requestAnimationFrame
    let rafId = null
    const animate = () => {
      const target = targetProgressRef.current
      const current = displayProgressRef.current
      
      if (current < target) {
        // Smooth easing - larger step when further from target
        const diff = target - current
        const step = Math.max(0.5, diff * 0.15)
        displayProgressRef.current = Math.min(target, current + step)
        setDisplayProgress(Math.floor(displayProgressRef.current))
      }
      
      rafId = requestAnimationFrame(animate)
    }
    rafId = requestAnimationFrame(animate)

    // Update target progress based on actual loading
    const progressInterval = setInterval(() => {
      const realProgress = totalResources > 0 
        ? Math.floor((loadedResources / totalResources) * 100) 
        : 0
      
      // When onLoading becomes false, go to 100
      if (!onLoading) {
        targetProgressRef.current = 100
      } else {
        // Use real progress, cap at 90 until fully loaded
        targetProgressRef.current = Math.min(90, Math.max(targetProgressRef.current, realProgress))
      }
    }, 30)

    // Max wait timer - force complete after timeout
    const maxWaitTimer = setTimeout(() => {
      if (!hasCompletedRef.current) {
        targetProgressRef.current = 100
      }
    }, 5000)

    return () => {
      clearTimeout(initTimer)
      clearInterval(progressInterval)
      clearTimeout(maxWaitTimer)
      if (rafId) cancelAnimationFrame(rafId)
      document.body.style.overflow = ''
    }
  }, [onLoading])

  // Complete loading sequence when display progress reaches 100
  useEffect(() => {
    if (displayProgress >= 100 && !hasCompletedRef.current) {
      hasCompletedRef.current = true
      
      // Immediately start exit sequence
      setPhase('complete')
      
      const sweepTimer = setTimeout(() => {
        setPhase('sweeping')
        setTimeout(() => {
          setPhase('fadeout')
          setTimeout(() => setIsVisible(false), 300)
        }, 400)
      }, 100)

      return () => clearTimeout(sweepTimer)
    }
  }, [displayProgress])

  if (!isVisible) return null

  return (
    <div
      className={`loading-cover ${phase}`}
      style={{ '--progress': `${displayProgress}%`, '--progress-num': displayProgress }}
    >
      {/* Left side - Vertical Progress Bar (thicker) */}
      <div className="progress-container">
        <div className="progress-track">
          <div className="progress-fill" />
        </div>
      </div>

      {/* Center - Loading Image and Site Name (horizontal, stacked) */}
      <div className="center-content">
        {loadingImage && (
          <img src={loadingImage} alt="Loading" className="loading-image" />
        )}
        <div className="site-name">
          {siteName}
        </div>
      </div>

      {/* Progress Info - follows progress bar */}
      <div className="progress-info">
        <div className="progress-percent">
          {Math.floor(displayProgress)}%
        </div>
        <div className="status-line">
          <span className="status-dot" />
          <span className="status-text">
            {phase === 'init' && textInit}
            {phase === 'loading' && textLoading}
            {phase === 'complete' && textComplete}
            {phase === 'sweeping' && textSweeping}
            {phase === 'fadeout' && textFadeout}
          </span>
        </div>
      </div>

      {/* Sweep overlay - full screen cover from left to right */}
      <div className="sweep-overlay" />

      <style jsx>{`
        .loading-cover {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: #0f1419;
          z-index: 99999;
          overflow: hidden;
        }

        /* Right side Content - Image above, Site Name below (Desktop) */
        .center-content {
          position: absolute;
          top: 50%;
          right: 12%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          z-index: 10;
        }

        .loading-image {
          max-width: 240px;
          max-height: 240px;
          opacity: 0.9;
        }

        .site-name {
          font-family: 'JetBrains Mono', 'Consolas', 'Monaco', monospace;
          font-size: clamp(0.75rem, 1.5vw, 1rem);
          font-weight: 600;
          color: #ffffff;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          user-select: none;
        }

        /* Progress Bar Container - Left Side (thicker) */
        .progress-container {
          position: absolute;
          left: 0;
          top: 0;
          width: 12px;
          height: 100%;
          background: rgba(255, 255, 255, 0.1);
        }

        .progress-track {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
        }

        .progress-fill {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: var(--progress);
          background: #FBFB46;
          transition: height 0.05s linear;
        }

        /* Progress Info - follows progress bar */
        .progress-info {
          position: absolute;
          left: 24px;
          top: var(--progress);
          transform: translateY(-100%);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 6px;
          transition: top 0.05s linear;
          padding-bottom: 12px;
        }

        .progress-percent {
          font-family: 'JetBrains Mono', 'Consolas', 'Monaco', monospace;
          font-size: clamp(32px, 5vw, 48px);
          font-weight: 700;
          color: #FBFB46;
          letter-spacing: 2px;
          line-height: 1;
        }

        .status-line {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          background: #FBFB46;
          border-radius: 50%;
          animation: blink 0.8s ease-in-out infinite;
        }

        .status-text {
          font-family: 'JetBrains Mono', 'Consolas', 'Monaco', monospace;
          font-size: 11px;
          font-weight: 500;
          color: rgba(251, 251, 70, 0.8);
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        /* Sweep Overlay - Full screen cover */
        .sweep-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #FBFB46;
          transform: scaleX(0);
          transform-origin: left;
          pointer-events: none;
          z-index: 50;
        }

        .loading-cover.sweeping .sweep-overlay {
          animation: sweepCover 0.4s ease-in-out forwards;
        }

        .loading-cover.fadeout {
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .loading-cover.fadeout .sweep-overlay {
          transform: scaleX(1);
        }



        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        @keyframes sweepCover {
          0% {
            transform: scaleX(0);
            transform-origin: left;
          }
          100% {
            transform: scaleX(1);
            transform-origin: left;
          }
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .center-content {
            top: 50%;
            right: auto;
            left: 50%;
            transform: translate(-50%, -50%);
            gap: 16px;
          }

          .loading-image {
            max-width: 160px;
            max-height: 160px;
          }

          .site-name {
            font-size: 0.7rem;
            letter-spacing: 0.15em;
          }

          /* Progress Bar at bottom on mobile */
          .progress-container {
            width: calc(100% - 6rem);
            height: 8px;
            top: auto;
            bottom: 30px;
            left: 0;
          }
          
          .progress-fill {
            width: var(--progress);
            height: 100%;
            transition: width 0.05s linear;
          }

          /* Progress Info follows horizontal bar */
          .progress-info {
            top: auto;
            bottom: 24px;
            left: 0;
            transform: translateX(calc((100vw - 6rem) * var(--progress-num) / 100 + 12px));
            flex-direction: row;
            gap: 8px;
            padding-bottom: 0;
          }

          .progress-percent {
            font-size: 14px;
          }

          .status-line {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}

export default LoadingCover
