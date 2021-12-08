import React, { useCallback } from 'react'
import throttle from 'lodash.throttle'
import { uuidToId } from 'notion-utils'
// import { cs } from 'react-notion-x'

/**
 * 目录导航组件
 * @param toc
 * @returns {JSX.Element}
 * @constructor
 */
const Toc = ({ toc }) => {
  // 无目录就直接返回空
  if (!toc || toc.length < 1) return <></>

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
  }, throttleMs))

  return <>
    <nav className=' dark:text-gray-400 dark:bg-gray-900 overflow-y-auto scroll-hidden p-2'>
      {toc.map((tocItem) => {
        const id = uuidToId(tocItem.id)
        return (
          <a
            key={id}
            href={`#${id}`}
            className={`notion-table-of-contents-item px-5 duration-300 transform font-light
            notion-table-of-contents-item-indent-level-${tocItem.indentLevel} 
            ${activeSection === id && ' font-bold text-blue-400 dark:text-white'}`}
          >
                      <span
                        style={{
                          display: 'inline-block',
                          marginLeft: tocItem.indentLevel * 16
                        }}
                      >
                        {tocItem.text}
                      </span>
          </a>
        )
      })}
    </nav>
  </>
}

export default Toc
