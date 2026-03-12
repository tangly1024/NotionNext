import { useGlobal } from '@/lib/global'
import throttle from 'lodash.throttle'
import { uuidToId } from 'notion-utils'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

/**
 * 目录导航组件
 * @param toc
 * @returns {JSX.Element}
 * @constructor
 */
const Catalog = ({ toc }) => {
  const { locale } = useGlobal()

  // 目录自动滚动
  const tRef = useRef(null)

  // 当前激活目录
  const [activeSection, setActiveSection] = useState(null)
  const activeSectionRef = useRef(null)

  useEffect(() => {
    activeSectionRef.current = activeSection
  }, [activeSection])

  const scrollTocToActive = useCallback(sectionId => {
    const container = tRef.current
    if (!container || !sectionId) return

    const currentTocItem = container.querySelector(
      `[data-toc-id="${sectionId}"]`
    )
    if (!currentTocItem) return

    const containerRect = container.getBoundingClientRect()
    const itemRect = currentTocItem.getBoundingClientRect()

    const nextTop =
      container.scrollTop + (itemRect.top - containerRect.top) - 8

    container.scrollTo({
      top: Math.max(0, nextTop),
      behavior: 'auto'
    })
  }, [])

  // 监听滚动事件
  const actionSectionScrollSpy = useMemo(
    () =>
      throttle(() => {
        const sections = document.getElementsByClassName('notion-h')
        let prevBBox = null
        let currentSectionId = activeSectionRef.current

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

          break
        }

        if (!currentSectionId) return

        // 只有变更时才更新，避免重复滚动
        if (activeSectionRef.current !== currentSectionId) {
          activeSectionRef.current = currentSectionId
          setActiveSection(currentSectionId)
          scrollTocToActive(currentSectionId)
        }
      }, 200),
    [scrollTocToActive]
  )

  useEffect(() => {
    window.addEventListener('scroll', actionSectionScrollSpy, { passive: true })
    actionSectionScrollSpy()

    return () => {
      window.removeEventListener('scroll', actionSectionScrollSpy)
      actionSectionScrollSpy.cancel()
    }
  }, [actionSectionScrollSpy])

  // 无目录就直接返回空
  if (!toc || toc.length < 1) {
    return null
  }

  return (
    <div className='px-3 py-1 dark:text-white text-black'>
      <div className='w-full'>
        <i className='mr-1 fas fa-stream' />
        {locale.COMMON.TABLE_OF_CONTENTS}
      </div>
      <div
        className='overflow-y-auto max-h-36 lg:max-h-96 overscroll-none scroll-hidden'
        ref={tRef}>
        <nav className='h-full'>
          {toc.map(tocItem => {
            const id = uuidToId(tocItem.id)
            const selected = activeSection === id
            return (
              <a
                key={id}
                data-toc-id={id}
                href={`#${id}`}
                className={`notion-table-of-contents-item block my-1 rounded-2xl transition-all duration-300 border ${
                  selected
                    ? 'bg-[#ebf4ff] border-[#60a5fa] shadow-[0_8px_16px_rgba(59,130,246,0.1)] dark:bg-[#9a34123d] dark:border-[#f59e0b52] dark:shadow-[0_8px_16px_rgba(120,53,15,0.15)]'
                    : 'bg-transparent border-transparent hover:bg-[#ebf4ff] hover:border-[#93c5fd] hover:shadow-[0_6px_12px_rgba(59,130,246,0.08)] dark:hover:bg-[#9a34122e] dark:hover:border-[#f59e0b3d]'
                }`}>
                <span
                  style={{
                    display: 'inline-block',
                    marginLeft: tocItem.indentLevel * 16
                  }}
                  className={`truncate block ${
                    selected
                      ? 'font-bold text-indigo-600 dark:text-[#ffc848]'
                      : 'dark:text-gray-200 hover:text-indigo-600 dark:hover:text-[#ffc848]'
                  }`}>
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
