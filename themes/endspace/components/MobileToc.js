'use client'

import throttle from 'lodash.throttle'
import { uuidToId } from 'notion-utils'
import { useCallback, useEffect, useRef, useState } from 'react'
import ListCheck2Icon from 'remixicon-react/ListCheck2Icon'
import CloseFillIcon from 'remixicon-react/CloseFillIcon'

/**
 * MobileToc Component - Mobile Table of Contents
 * Floating button + popup panel
 */
const MobileToc = ({ toc }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState(null)
  const [progress, setProgress] = useState(0)
  const tRef = useRef(null)
  const tocIds = []

  // Listen to scroll events
  useEffect(() => {
    window.addEventListener('scroll', actionSectionScrollSpy)
    window.addEventListener('scroll', updateProgress)
    actionSectionScrollSpy()
    updateProgress()
    return () => {
      window.removeEventListener('scroll', actionSectionScrollSpy)
      window.removeEventListener('scroll', updateProgress)
    }
  }, [])

  // Update reading progress
  const updateProgress = () => {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const progress = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0
    setProgress(progress)
  }

  // Sync selected TOC item
  const throttleMs = 200
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
    }, throttleMs)
  )

  // Prevent scroll through
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Return null if no TOC
  if (!toc || toc.length < 1) {
    return null
  }

  const handleItemClick = (id) => {
    setIsOpen(false)
    // Delay scroll to ensure panel closes
    setTimeout(() => {
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }

  return (
    <>
      {/* Floating TOC Button - Mobile Only (Styled like Desktop) */}
      <button
        onClick={() => setIsOpen(true)}
         className="fixed right-4 bottom-24 z-40 md:hidden 
                   w-10 h-10 flex items-center justify-center shadow-md cursor-pointer border rounded-full 
                   bg-white text-gray-400 border-gray-200
                   hover:bg-[#FBFB46] hover:text-black hover:border-[#FBFB46] hover:shadow-lg hover:-translate-y-1
                   transition-all duration-300 group"
        title="Table of Contents"
      >
        {/* Show Percentage by default, Icon logic similar to desktop for consistency */}
        <div className="relative w-full h-full flex items-center justify-center">
            <span className="text-[10px] font-bold font-mono group-hover:hidden text-gray-400">{Math.round(progress)}%</span>
            <ListCheck2Icon size={20} stroke={2} className="hidden group-hover:block" />
        </div>
      </button>

      {/* Overlay */}
      <div 
        className={`fixed inset-0 z-50 md:hidden bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* TOC Panel - Slide up from bottom */}
      <div 
        className={`fixed left-0 right-0 bottom-0 z-50 md:hidden bg-[#f7f9fe] border-t border-[var(--endspace-border-base)] transition-transform duration-300 ease-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ maxHeight: '70vh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--endspace-border-base)] bg-white">
          <div className="flex items-center gap-3">
            <ListCheck2Icon size={16} className="text-[#FBFB46]" />
            <span className="text-sm font-mono font-bold text-black uppercase">TOC INDEX</span>
            <span className="text-xs font-mono text-gray-400">{toc.length} sections</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-black transition-colors"
          >
            <CloseFillIcon size={20} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-gray-100">
          <div 
            className="h-full bg-[#FBFB46] transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* TOC Items */}
        <div 
          ref={tRef}
          className="overflow-y-auto overflow-x-hidden py-3"
          style={{ maxHeight: 'calc(70vh - 80px)', scrollbarWidth: 'thin' }}
        >
          <nav className="px-4 space-y-1">
            {toc.map((tocItem, index) => {
              const id = uuidToId(tocItem.id)
              tocIds.push(id)
              const isActive = activeSection === id
              
              return (
                <button
                  key={id}
                  onClick={() => handleItemClick(id)}
                  className={`w-full text-left py-3 px-4 text-sm transition-all duration-200 border-l-2 ${
                    isActive 
                      ? 'border-[#FBFB46] text-black font-bold bg-[#FBFB46]/10' 
                      : 'border-transparent text-gray-500 hover:text-black hover:bg-white'
                  }`}
                  style={{ 
                    paddingLeft: `${16 + tocItem.indentLevel * 16}px`
                  }}
                >
                  <span className="line-clamp-2 leading-relaxed break-words">
                    {tocItem.text}
                  </span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[var(--endspace-border-base)] bg-[var(--endspace-bg-secondary)]">
          <div className="flex items-center justify-between text-xs font-mono text-[var(--endspace-text-muted)]">
            <span>{Math.round(progress)}% READ</span>
            <span>Tap to navigate</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default MobileToc
