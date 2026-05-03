import { useState } from 'react'
import { SideBar } from './SideBar'
import { IconHistory, IconChevronRight } from '@tabler/icons-react'

/**
 * FloatingRecentLogs Component
 * Collapsible drawer for SideBar content (Recent Logs, Categories, Tags)
 */
const FloatingRecentLogs = (props) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div 
      className="fixed z-50 block"
      style={{
        right: '1rem',
        top: 'auto',
        bottom: '160px', // Stacked: TOC (100px) -> RecentLogs (160px)
      }}
    >
      {/* Floating Container */}
      <div 
        className={`transition-all duration-300 ease-out flex ${
          isExpanded 
            ? 'w-80' // Wider for sidebar content
            : 'w-10'
        }`}
      >
        {/* Toggle Button (Left of content when expanded, or standalone) */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center justify-center transition-all duration-300 shadow-md cursor-pointer border hover:-translate-y-1 hover:shadow-lg z-20 relative rounded-full ${
            isExpanded 
              ? 'w-10 h-10 bg-[#FBFB46] text-black border-[#FBFB46]' 
              : 'w-10 h-10 bg-white text-gray-400 border-gray-200 hover:bg-[#FBFB46] hover:text-black hover:border-[#FBFB46]'
          }`}
          title={isExpanded ? 'Collapse Sidebar' : 'Show Recent Logs'}
        >
          {isExpanded ? (
            <IconChevronRight size={20} stroke={2} />
          ) : (
            <IconHistory size={20} stroke={2} />
          )}
        </button>

        {/* Expanded Content Drawer */}
        <div 
            className={`transition-opacity duration-300 bg-[#f7f9fe] border border-[var(--endspace-border-base)] shadow-2xl overflow-hidden ${
                isExpanded ? 'opacity-100 visible w-full' : 'opacity-0 invisible w-0 border-0'
            }`}
             style={{
                maxHeight: 'calc(100vh - 140px)'
            }}
        >
          {isExpanded && (
             <div className="p-4 overflow-y-auto h-full" style={{ scrollbarWidth: 'thin' }}>
                <SideBar {...props} />
             </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FloatingRecentLogs
