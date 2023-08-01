import { useCallback, useEffect, useState } from 'react'
import throttle from 'lodash.throttle'
import { uuidToId } from 'notion-utils'
import { isBrowser } from '@/lib/utils'

/**
 * 目录导航组件
 * @param toc
 * @returns {JSX.Element}
 * @constructor
 */
const Catalog = ({ post }) => {
  const tocIds = []
  const toc = post?.toc
  // 同步选中目录事件
  const [activeSection, setActiveSection] = useState(null)

  // 监听滚动事件
  useEffect(() => {
    window.addEventListener('scroll', actionSectionScrollSpy)
    actionSectionScrollSpy()
    return () => {
      window.removeEventListener('scroll', actionSectionScrollSpy)
    }
  }, [post])

  const throttleMs = 200
  const actionSectionScrollSpy = useCallback(throttle(() => {
    const sections = document.getElementsByClassName('notion-h')
    let prevBBox = null
    let currentSectionId = activeSection
    for (let i = 0; i < sections.length; ++i) {
      const section = sections[i]
      if (!section || !(section instanceof Element)) continue
      if (!currentSectionId) {
        currentSectionId = section.getAttribute('data-id')
      }
      const bbox = section.getBoundingClientRect()
      const prevHeight = prevBBox ? bbox.top - prevBBox.bottom : 0
      const offset = Math.max(150, prevHeight / 4)
      // GetBoundingClientRect returns values relative to viewport
      if (bbox.top - offset < 0) {
        currentSectionId = section.getAttribute('data-id')
        prevBBox = bbox
        continue
      }
      // No need to continue loop, if last element has been detected
      break
    }
    setActiveSection(currentSectionId)
    const index = tocIds.indexOf(currentSectionId) || 0
    if (isBrowser && tocIds?.length > 0) {
      for (const tocWrapper of document?.getElementsByClassName('toc-wrapper')) {
        tocWrapper?.scrollTo({ top: 28 * index, behavior: 'smooth' })
      }
    }
  }, throttleMs))

  // 无目录就直接返回空
  if (!toc || toc.length < 1) {
    return null
  }

  return <>
    <div id='toc-wrapper' className='toc-wrapper overflow-y-auto max-h-96 overscroll-none scroll-hidden'>
      <nav className='h-full  text-black'>
        {toc.map((tocItem) => {
          const id = uuidToId(tocItem.id)
          tocIds.push(id)
          return (
            <a
              key={id}
              href={`#${id}`}
              className={`notion-table-of-contents-item duration-300 transform font-light dark:text-gray-300
              notion-table-of-contents-item-indent-level-${tocItem.indentLevel} `}
            >
              <span style={{ display: 'inline-block', marginLeft: tocItem.indentLevel * 16 }}
                className={`${activeSection === id && ' font-bold text-gray-500 underline'}`}
              >
                {tocItem.text}
              </span>
            </a>
          )
        })}
      </nav>
    </div>
  </>
}

export default Catalog
