import { useGlobal } from '@/lib/global'
import { useEffect, useState } from 'react'

/**
 * 文章波浪动画
 */
export default function WavesArea() {
  const { isDarkMode } = useGlobal()
  const color = isDarkMode ? '#18171d' : '#f7f9fe'
  const [showWave, setShowWave] = useState(true)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 800) {
        setShowWave(false)
      } else {
        setShowWave(true)
      }
    }

    // Initial check
    handleResize()

    // Add event listener for window resize
    window.addEventListener('resize', handleResize)

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  if (!showWave) {
    return null
  }

  return (
    <section className='main-hero-waves-area waves-area w-full absolute left-0 z-10 bottom-0'>
      <svg
        className='waves-svg w-full h-[60px]'
        xmlns='http://www.w3.org/2000/svg'
        xlink='http://www.w3.org/1999/xlink'
        viewBox='0 24 150 28'
        preserveAspectRatio='none'
        shapeRendering='auto'>
        <defs>
          <path
            id='gentle-wave'
            d='M -160 44 c 30 0 58 -18 88 -18 s 58 18 88 18 s 58 -18 88 -18 s 58 18 88 18 v 44 h -352 Z'></path>
        </defs>
        <g className='parallax'>
          <use href='#gentle-wave' x='48' y='0'></use>
          <use href='#gentle-wave' x='48' y='3'></use>
          <use href='#gentle-wave' x='48' y='5'></use>
          <use href='#gentle-wave' x='48' y='7'></use>
        </g>
      </svg>
      <style jsx global>
        {`
          /* Animation */

          .parallax > use {
            animation: move-forever 30s cubic-bezier(0.55, 0.5, 0.45, 0.5)
              infinite;
          }
          .parallax > use:nth-child(1) {
            animation-delay: -2s;
            animation-duration: 7s;
            fill: ${color};
            opacity: 0.5;
          }
          .parallax > use:nth-child(2) {
            animation-delay: -3s;
            animation-duration: 10s;
            fill: ${color};
            opacity: 0.6;
          }
          .parallax > use:nth-child(3) {
            animation-delay: -4s;
            animation-duration: 13s;
            fill: ${color};
            opacity: 0.7;
          }
          .parallax > use:nth-child(4) {
            animation-delay: -5s;
            animation-duration: 20s;
            fill: ${color};
          }

          @keyframes move-forever {
            0% {
              transform: translate3d(-90px, 0, 0);
            }
            100% {
              transform: translate3d(85px, 0, 0);
            }
          }
        `}
      </style>
    </section>
  )
}
