import { useEffect, useRef, useState } from 'react'
import throttle from 'lodash.throttle'
import { uuidToId } from 'notion-utils'
import { useGlobal } from '@/lib/global'

/**
 * 目录导航组件
 * @param toc
 * @returns {JSX.Element}
 * @constructor
 */
const Catalog = ({ toc }) => {
  const { locale } = useGlobal()

  // 同步选中目录事件
  const [activeSection, setActiveSection] = useState(null)

  // 监听滚动事件
  useEffect(() => {
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
      const index = toc?.findIndex(obj => uuidToId(obj.id) === currentSectionId)
      tRef?.current?.scrollTo({ top: 28 * index, behavior: 'smooth' })
    }, throttleMs)

    actionSectionScrollSpy()
    window.addEventListener('scroll', actionSectionScrollSpy)
    return () => {
      window.removeEventListener('scroll', actionSectionScrollSpy)
    }
  }, [toc])

  // 目录自动滚动
  const tRef = useRef(null)
  // 无目录就直接返回空
  if (!toc || toc?.length < 1) {
    return <></>
  }
  return <div id='catalog' className='flex-1 flex-col flex overflow-hidden'>
    <div className='w-full dark:text-gray-300 mb-2'><i className='mr-1 fas fa-stream' />{locale.COMMON.TABLE_OF_CONTENTS}</div>
    <nav ref={tRef} className='flex-1 overflow-auto  overscroll-none scroll-hidden   text-black mb-6'>
      {toc.map((tocItem) => {
        const id = uuidToId(tocItem.id)
        return (
          <a
            key={id}
            href={`#${id}`}
            className={`notion-table-of-contents-item duration-300 transform font-light dark:text-gray-300
              notion-table-of-contents-item-indent-level-${tocItem.indentLevel} `}
          >
            <span style={{ display: 'inline-block', marginLeft: tocItem.indentLevel * 16 }}
              className={`${activeSection === id && ' font-bold text-red-400 underline'}`}
              title={tocItem.text}
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
