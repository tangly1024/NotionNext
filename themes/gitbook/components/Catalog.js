import { isBrowser } from '@/lib/utils'
import throttle from 'lodash.throttle'
import { uuidToId } from 'notion-utils'
import { useCallback, useEffect, useState } from 'react'

/**
 * 目录导航组件
 * @param toc
 * @returns {JSX.Element}
 * @constructor
 */
const Catalog = ({ post }) => {
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
  const actionSectionScrollSpy = useCallback(
    throttle(() => {
      const sections = document.getElementsByClassName('notion-h')
      let prevBBox = null
      let currentSectionId = null
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
      const tocIds = post?.toc?.map(t => uuidToId(t.id)) || []
      const index = tocIds.indexOf(currentSectionId) || 0
      if (isBrowser && tocIds?.length > 0) {
        for (const tocWrapper of document?.getElementsByClassName(
          'toc-wrapper'
        )) {
          tocWrapper?.scrollTo({ top: 28 * index, behavior: 'smooth' })
        }
      }
    }, throttleMs)
  )

  // 无目录就直接返回空
  if (!toc || toc?.length < 1) {
    return <></>
  }

  return (
    <>
      {/* <div className='w-full hidden md:block'>
        <i className='mr-1 fas fa-stream' />{locale.COMMON.TABLE_OF_CONTENTS}
        </div> */}

      <div
        id='toc-wrapper'
        className='toc-wrapper overflow-y-auto my-2 max-h-80 overscroll-none scroll-hidden'>
        <nav className='h-full text-black'>
          {toc?.map(tocItem => {
            const id = uuidToId(tocItem.id)
            return (
              <a
                key={id}
                href={`#${id}`}
                //  notion-table-of-contents-item
                className={`${activeSection === id && 'border-green-500 text-green-500 font-bold'} border-l pl-4 block hover:text-green-500 border-lduration-300 transform font-light dark:text-gray-300
              notion-table-of-contents-item-indent-level-${tocItem.indentLevel} catalog-item `}>
                <span
                  style={{
                    display: 'inline-block',
                    marginLeft: tocItem.indentLevel * 16
                  }}
                  className={`truncate`}>
                  {tocItem.text}
                </span>
              </a>
            )
          })}
        </nav>
      </div>
    </>
  )
}

export default Catalog
