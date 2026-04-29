import { useEffect, useState } from 'react'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import CONFIG from '../config'

const RightFloatArea = ({ post }) => {
  const [visible, setVisible] = useState(false)
  const { isDarkMode, toggleDarkMode } = useGlobal()

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 180)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <div className='fuwari-float-wrap fixed z-30 flex flex-col gap-2'>
      <button className='fuwari-float-btn' onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <i className='fas fa-angle-up' />
      </button>
      {post && siteConfig('FUWARI_WIDGET_TO_COMMENT', true, CONFIG) && (
        <button
          className='fuwari-float-btn'
          onClick={() => document.getElementById('comment')?.scrollIntoView({ behavior: 'smooth' })}>
          <i className='far fa-comment-dots' />
        </button>
      )}
      {siteConfig('FUWARI_WIDGET_DARK_MODE', true, CONFIG) && (
        <button className='fuwari-float-btn' onClick={toggleDarkMode}>
          {isDarkMode ? '☀' : '☾'}
        </button>
      )}
    </div>
  )
}

export default RightFloatArea

