import throttle from 'lodash.throttle'
import { uuidToId } from 'notion-utils'
import { useEffect, useRef, useState } from 'react'
import Progress from './Progress'

/**
 * 目录导航组件
 * @param toc
 * @returns {JSX.Element}
 * @constructor
 */
const Catalog = ({ post, toc, className }) => {
  const tocIds = []

  // 目录自动滚动
  const tRef = useRef(null)
  // 同步选中目录事件
  const [activeSection, setActiveSection] = useState(null)

  // 监听滚动事件
  useEffect(() => {
    if (toc && toc.length > 1) {
      actionSectionScrollSpy()
      window.addEventListener('scroll', actionSectionScrollSpy)
    }
    return () => {
      window.removeEventListener('scroll', actionSectionScrollSpy)
    }
  }, [])

  const throttleMs = 200
  const actionSectionScrollSpy = throttle(() => {
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
    tRef?.current?.scrollTo({ top: 28 * index, behavior: 'smooth' })
  }, throttleMs)

  // 无目录就直接返回空
  if (!toc || toc.length < 1) {
    return <></>
  }

  return (
    <div className={className}>
      <div className='w-full mt-2 mb-4'>
        {/* 阅读进度条 */}
        <Progress />
      </div>
      <div
        className='overflow-y-auto scroll-hidden lg:max-h-96 max-h-44'
        ref={tRef}>
        <nav className='h-full text-black'>
          {toc?.map(tocItem => {
            const id = uuidToId(tocItem.id)
            tocIds.push(id)
            return (
              <a
                key={id}
                href={`#${id}`}
                className={`${activeSection === id && 'dark:border-white border-gray-800 text-gray-800 font-bold'} hover:font-semibold border-l pl-4 block hover:text-gray-800 border-lduration-300 transform dark:text-gray-400 dark:border-gray-400
            notion-table-of-contents-item-indent-level-${tocItem.indentLevel} catalog-item `}>
                <span
                  style={{
                    display: 'inline-block',
                    marginLeft: tocItem.indentLevel * 16
                  }}
                  className={`truncate ${activeSection === id ? ' font-bold text-black dark:text-white underline' : ''}`}>
                  {tocItem.text}
                </span>
              </a>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

export default Catalog
