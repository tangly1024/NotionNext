import React from 'react'
import throttle from 'lodash.throttle'
import { uuidToId } from 'notion-utils'

/**
 * 目录导航组件
 * @param toc
 * @returns {JSX.Element}
 * @constructor
 */
const Catalog = ({ toc }) => {
  // 无目录就直接返回空
  if (!toc || toc.length < 1) {
    return <></>
  }
  // 监听滚动事件
  React.useEffect(() => {
    window.addEventListener('scroll', actionSectionScrollSpy)
    actionSectionScrollSpy()
    return () => {
      window.removeEventListener('scroll', actionSectionScrollSpy)
    }
  }, [])

  // 同步选中目录事件
  const [activeSection, setActiveSection] = React.useState(null)
  const throttleMs = 100
  const actionSectionScrollSpy = React.useCallback(throttle(() => {
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
  }, throttleMs))

  return <div>
    <div className='w-full dark:text-gray-300 mb-2'><i className='mr-1 fas fa-stream' /> 目录</div>
    <nav className='font-sans overflow-y-auto scroll-hidden text-black'>
      {toc.map((tocItem) => {
        const id = uuidToId(tocItem.id)
        return (
          <a
            key={id}
            href={`#${id}`}
            className={`notion-table-of-contents-item duration-300 transform font-light dark:text-gray-300
            notion-table-of-contents-item-indent-level-${tocItem.indentLevel} `}
          >
                      <span
                        style={{
                          display: 'inline-block',
                          marginLeft: tocItem.indentLevel * 16
                        }}
                        className={`${activeSection === id && ' font-bold text-red-400 underline'}`}
                      >
                        {tocItem.text}
                      </span>
          </a>
        )
      })}
    </nav>
  </div>
}

export default Catalog
