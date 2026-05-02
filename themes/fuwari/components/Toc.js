import throttle from 'lodash.throttle'
import { uuidToId } from 'notion-utils'
import { useCallback, useEffect, useRef, useState } from 'react'

const Toc = ({ toc }) => {
  const tRef = useRef(null)
  const [activeSection, setActiveSection] = useState(null)
  const tocIds = []

  const actionSectionScrollSpy = useCallback(
    throttle(() => {
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
        if (bbox.top - offset < 0) {
          currentSectionId = section.getAttribute('data-id')
          prevBBox = bbox
          continue
        }
        break
      }

      setActiveSection(currentSectionId)
      const index = tocIds.indexOf(currentSectionId) || 0
      tRef?.current?.scrollTo({ top: 28 * index, behavior: 'smooth' })
    }, 200),
    [activeSection, tocIds]
  )

  useEffect(() => {
    window.addEventListener('scroll', actionSectionScrollSpy)
    actionSectionScrollSpy()
    return () => {
      window.removeEventListener('scroll', actionSectionScrollSpy)
    }
  }, [actionSectionScrollSpy])

  if (!toc || toc.length < 1) return null

  return (
    <div className='px-3'>
      <div className='overflow-y-auto max-h-96 overscroll-none scroll-hidden' ref={tRef}>
        <nav className='h-full'>
          {toc.map(tocItem => {
            const id = uuidToId(tocItem.id)
            tocIds.push(id)
            return (
              <a
                key={id}
                href={`#${id}`}
                className='catalog-item block duration-200 py-1'>
                <span
                  style={{ display: 'inline-block', marginLeft: tocItem.indentLevel * 16 }}
                  className={`truncate ${activeSection === id ? 'font-semibold text-[var(--fuwari-primary)]' : ''}`}>
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

export default Toc

