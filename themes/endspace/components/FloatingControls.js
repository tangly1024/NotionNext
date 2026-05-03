import { useState, useEffect, useRef, useCallback } from 'react'
import throttle from 'lodash.throttle'
import { uuidToId } from 'notion-utils'
import { IconHistory, IconClock, IconListTree, IconArrowUp, IconX, IconChevronRight, IconMessage } from '@tabler/icons-react'
import { SideBar } from './SideBar'

/**
 * FloatingControls Component
 * Consolidates Recent Logs, TOC, and ScrollToTop into a single capsule widget.
 */
const FloatingControls = ({ toc, ...props }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState(null) // 'logs' | 'toc'
  const [percent, setPercent] = useState(0)
  const [activeSection, setActiveSection] = useState(null)
  
  // -- TOC Logic --
  useEffect(() => {
    window.addEventListener('scroll', updateProgress)
    window.addEventListener('scroll', actionSectionScrollSpy)
    return () => {
        window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('scroll', actionSectionScrollSpy)
    }
  }, [])

  const updateProgress = () => {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const p = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0
    setPercent(p)
  }

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
    }, 200),
    []
  )

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleDrawer = (tab) => {
    if (isOpen && activeTab === tab) {
      setIsOpen(false)
      setActiveTab(null)
    } else {
      setIsOpen(true)
      setActiveTab(tab)
    }
  }

  // Common Button Style (Double Circle)
  const ControlBtn = ({ icon: Icon, onClick, active, label, showPercent, iconClassName = "text-black", iconSize = 20 }) => (
    <button
      onClick={onClick}
      className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-1 cursor-pointer group shadow-lg transition-transform active:scale-95"
      aria-label={label}
      title={label}
    >
      <div 
        className={`w-full h-full rounded-full flex items-center justify-center transition-colors duration-200 ${
            active ? 'bg-[#FBFB46]' : 'bg-transparent group-hover:bg-[#FBFB46]'
        }`}
      >
        {showPercent ? (
            <div className="relative w-full h-full flex items-center justify-center">
                <span className={`text-[10px] font-bold font-mono ${active ? 'text-black hidden' : 'text-gray-600 group-hover:hidden'}`}>
                    {Math.round(percent)}%
                </span>
                <Icon size={iconSize} stroke={2} className={`${iconClassName} ${active ? 'block' : 'hidden group-hover:block'}`} />
            </div>
        ) : (
            <Icon size={iconSize} stroke={2} className={iconClassName} />
        )}
      </div>
    </button>
  )

  return (
    <>
      {/* Container: Fixed Bottom Right */
      /* Note: Parent must allow fixed child to escape if needed, but fixed-in-fixed usually works for viewport. */
      /* We use a fragment or simple div to hold the buttons, and put the drawer as a sibling or just rely on fixed positioning. */
      /* Actually, to ensure proper z-indexing, let's keep them siblings. */}
      
      {/* The Drawer (Mobile Sheet / Desktop Popover) */}
      <div
        className={`
            transition-all duration-300 ease-out bg-[#f7f9fe] border-[var(--endspace-border-base)] shadow-2xl overflow-hidden
            
            /* Mobile Styles: Bottom Sheet */
            fixed bottom-0 left-0 right-0 w-full rounded-t-2xl border-t z-40
            ${isOpen ? 'translate-y-0 opacity-100 visible' : 'translate-y-full opacity-0 invisible'}

            /* Desktop Styles: Floating Card (Left of buttons) */
            lg:fixed lg:bottom-8 lg:right-20 lg:left-auto lg:w-80 lg:rounded-xl lg:border lg:h-auto lg:max-h-[70vh]
            lg:max-w-[calc(100vw-2rem)]
            ${isOpen ? 'lg:translate-y-0 lg:opacity-100 lg:visible' : 'lg:translate-y-0 lg:translate-x-4 lg:opacity-0 lg:invisible'}
        `}
        style={{
            /* Mobile Height Limit */
            maxHeight: '70vh', 
        }}
      >
             {/* Header */}
             <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white shrinking-0">
                <h3 className="font-bold text-sm uppercase flex items-center gap-2 text-black">
                    {activeTab === 'toc' ? (
                        <>
                            <IconListTree size={16} className="text-black" />
                            <span>Table of Contents</span>
                        </>
                    ) : (
                        <>
                             <IconClock size={16} className="text-black" />
                             <span>Recent Logs</span>
                        </>
                    )}
                </h3>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-black">
                    <IconX size={18} />
                </button>
             </div>

             {/* Content Area */}
             <div 
                className="overflow-y-auto p-4 pb-24 lg:pb-4 flex-1" 
                style={{ scrollbarWidth: 'thin' }}
             >
                {activeTab === 'toc' && (
                    <nav className="space-y-1">
                        {toc && toc.map(t => {
                             const id = uuidToId(t.id)
                             const isActive = activeSection === id
                             return (
                                <a
                                  key={id}
                                  href={`#${id}`}
                                  className={`block py-1 text-xs transition-colors rounded px-2 -mx-2 ${isActive ? 'text-black font-bold bg-[#FBFB46]/10' : 'text-gray-500 hover:text-black hover:bg-white'}`}
                                  style={{ paddingLeft: `${(t.indentLevel || 0) * 12 + 8}px` }}
                                  onClick={() => {
                                      // Optional: Close on click for mobile?
                                      // setIsOpen(false) 
                                  }}
                                >
                                    {t.text}
                                </a>
                             )
                        })}
                    </nav>
                )}
                {activeTab === 'logs' && (
                    <SideBar {...props} showTitle={false} />
                )}
             </div>
      </div>

      {/* The Controls (Buttons) */}
      <div className="fixed right-4 bottom-8 z-50 flex flex-col items-end gap-2 pointer-events-none">
        {/* Capsule */}
        <div className="bg-gray-400/80 backdrop-blur-sm p-1.5 rounded-full shadow-lg flex flex-row lg:flex-col gap-3 pointer-events-auto">
             {/* LOGS */}
             <ControlBtn 
                icon={IconClock} 
                label="Recent Logs" 
                active={activeTab === 'logs'}
                onClick={() => toggleDrawer('logs')}
                iconClassName="text-black"
                iconSize={24}
             />

             {/* TOC - Only on Article Pages */}
             {toc && toc.length > 0 && (
                 <ControlBtn 
                    icon={IconListTree} 
                    label="Table of Contents" 
                    active={activeTab === 'toc'}
                    onClick={() => toggleDrawer('toc')}
                    showPercent={true}
                    iconClassName="text-gray-500"
                    iconSize={28}
                 />
             )}

             {/* Comments - Only on Article Pages (approximated by TOC presence) */}
             {toc && toc.length > 0 && (
                 <ControlBtn 
                    icon={IconMessage} 
                    label="Jump to Comments" 
                    onClick={() => {
                        const comments = document.getElementById('comments')
                        if (comments) {
                            comments.scrollIntoView({ behavior: 'smooth' })
                        }
                    }}
                 />
             )}

             {/* Scroll To Top */}
             <ControlBtn 
                icon={IconArrowUp} 
                label="Scroll To Top" 
                onClick={handleScrollToTop}
             />
        </div>
      </div>
    </>
  )
}

export default FloatingControls
