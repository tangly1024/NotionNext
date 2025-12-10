import styles from './AISummary.module.css'
import { useEffect, useState } from 'react'
import { useGlobal } from '@/lib/global'

const AISummary = ({ aiSummary }) => {
  const { locale } = useGlobal()
  const [summary, setSummary] = useState(aiSummary)

  useEffect(() => {
    showAiSummaryAnimation(aiSummary, setSummary)
  }, [])

  return (
    aiSummary && (
      <div className={styles['post-ai']}>
        <div className={styles['ai-container']}>
          <div className={styles['ai-header']}>
            <div className={styles['ai-icon']}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                width='24'
                height='24'>
                <path
                  fill='#ffffff'
                  d='M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z'
                />
              </svg>
            </div>
            <div className={styles['ai-title']}>{locale.AI_SUMMARY.NAME}</div>
            <div className={styles['ai-tag']}>GPT</div>
          </div>
          <div className={styles['ai-content']}>
            <div className={styles['ai-explanation']}>
              {summary}
              {summary !== aiSummary && (
                <span className={styles['blinking-cursor']}></span>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  )
}

const showAiSummaryAnimation = (rawSummary, setSummary) => {
  if (!rawSummary) return
  let currentIndex = 0
  const typingDelay = 20
  const punctuationDelayMultiplier = 6
  let animationRunning = true
  let lastUpdateTime = performance.now()
  const animate = () => {
    if (currentIndex < rawSummary.length && animationRunning) {
      const currentTime = performance.now()
      const timeDiff = currentTime - lastUpdateTime

      const letter = rawSummary.slice(currentIndex, currentIndex + 1)
      const isPunctuation = /[，。！、？,.!?]/.test(letter)
      const delay = isPunctuation
        ? typingDelay * punctuationDelayMultiplier
        : typingDelay

      if (timeDiff >= delay) {
        setSummary(rawSummary.slice(0, currentIndex + 1))
        lastUpdateTime = currentTime
        currentIndex++

        if (currentIndex < rawSummary.length) {
          setSummary(rawSummary.slice(0, currentIndex))
        } else {
          setSummary(rawSummary)
          observer.disconnect()
        }
      }
      requestAnimationFrame(animate)
    }
  }
  animate(rawSummary)
  const observer = new IntersectionObserver(
    entries => {
      animationRunning = entries[0].isIntersecting
      if (animationRunning && currentIndex === 0) {
        setTimeout(() => {
          requestAnimationFrame(animate)
        }, 200)
      }
    },
    { threshold: 0 }
  )
  let post_ai = document.querySelector('.post-ai')
  if (post_ai) {
    observer.observe(post_ai)
  }
}

export default AISummary
