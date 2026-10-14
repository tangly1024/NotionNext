import { useCallback, useEffect, useRef, useState } from 'react'
import Catalog from './Catalog'

/** 移动端悬浮目录按钮 */
export default function FloatTocButton({ post, lock }) {
  const [tocVisible, changeTocVisible] = useState(false)
  const buttonRef = useRef(null)
  const hasToc = Boolean(post && !lock && post.toc?.length)
  const closeToc = useCallback(() => {
    changeTocVisible(false)
    buttonRef.current?.focus()
  }, [])

  useEffect(() => {
    changeTocVisible(false)
  }, [post?.id, hasToc])

  useEffect(() => {
    if (!tocVisible) return
    const onKeyDown = event => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeToc()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [tocVisible, closeToc])

  if (!hasToc) return null

  return (
    <div className='fixed lg:hidden right-4 bottom-24'>
      <button
        ref={buttonRef}
        type='button'
        id='toc-button'
        aria-label='文章目录'
        aria-expanded={tocVisible}
        aria-controls='heo-floating-toc'
        onClick={() => (tocVisible ? closeToc() : changeTocVisible(true))}
        className='w-11 h-11 select-none hover:scale-110 transform duration-200 text-black dark:text-gray-200 rounded-full bg-white drop-shadow-lg flex justify-center items-center dark:bg-hexo-black-gray py-2 px-2'
      >
        <i aria-hidden='true' className='fa-list-ol cursor-pointer fas' />
      </button>

      {/* 保留退场动画，同时立即从键盘导航和辅助技术中移除关闭的目录。 */}
      <div
        id='heo-floating-toc'
        aria-hidden={!tocVisible}
        inert={tocVisible ? undefined : ''}
        style={{
          visibility: tocVisible ? 'visible' : 'hidden',
          transitionDelay: tocVisible ? '0s, 0s, 0s' : '0s, 0s, 200ms'
        }}
        className={`${tocVisible ? 'shadow-card translate-x-0 opacity-100' : 'translate-x-72 opacity-0 pointer-events-none'} z-40 w-60 transition-[opacity,transform,visibility] duration-200 motion-reduce:transition-none fixed right-4 bottom-12 rounded-xl py-2 bg-white dark:bg-gray-900`}
      >
        <div className='dark:text-gray-400 text-gray-600'>
          <Catalog toc={post.toc} />
        </div>
      </div>

      {tocVisible && (
        <div
          id='right-drawer-background'
          aria-hidden='true'
          className='fixed inset-0 z-30'
          onClick={closeToc}
        />
      )}
    </div>
  )
}
