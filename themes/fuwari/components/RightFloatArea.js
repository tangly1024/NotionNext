import { useEffect, useState } from 'react'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import CONFIG from '../config'
import Toc from './Toc'

const RightFloatArea = ({ post }) => {
  const [visible, setVisible] = useState(false)
  const [showTocDrawer, setShowTocDrawer] = useState(false)
  const { isDarkMode, toggleDarkMode } = useGlobal()
  const hasToc = Boolean(post?.toc && post.toc.length > 1)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 180)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <>
      {showTocDrawer && hasToc && (
        <div className='fuwari-toc-mobile lg:hidden'>
          <div className='fuwari-toc-mask' onClick={() => setShowTocDrawer(false)} />
          <section className='fuwari-card fuwari-toc-panel p-4'>
            <div className='flex items-center justify-between mb-2'>
              <h3 className='text-sm font-semibold tracking-wide uppercase text-[var(--fuwari-muted)]'>
                目录
              </h3>
              <button
                type='button'
                className='fuwari-tool-btn'
                onClick={() => setShowTocDrawer(false)}>
                <i className='fas fa-times' />
              </button>
            </div>
            <Toc toc={post.toc} />
          </section>
        </div>
      )}
      <div className='fuwari-float-wrap fixed z-30 flex flex-col gap-2'>
        <button className='fuwari-float-btn' onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <i className='fas fa-angle-up' />
        </button>
        {hasToc && (
          <button
            className='fuwari-float-btn lg:hidden'
            onClick={() => setShowTocDrawer(true)}>
            <i className='fas fa-list-ul' />
          </button>
        )}
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
    </>
  )
}

export default RightFloatArea

