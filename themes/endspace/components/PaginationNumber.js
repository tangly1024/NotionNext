import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { IconChevronsLeft, IconChevronLeft, IconChevronRight, IconChevronsRight } from '@tabler/icons-react'

/**
 * PaginationNumber Component - Endspace Theme Industrial Style
 * Pagination navigation component
 */
const PaginationNumber = ({ page, totalPage }) => {
  const router = useRouter()
  const currentPage = +page
  const showPrev = currentPage > 1
  const showNext = currentPage < totalPage
  const pagePrefix = router.asPath
    .split('?')[0]
    .replace(/\/page\/[1-9]\d*/, '')
    .replace(/\/$/, '')
    .replace('.html', '')

  const DoubleCircleBtn = ({ href, disabled, icon: Icon, label }) => {
    if (disabled) {
      return (
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center p-1 cursor-not-allowed opacity-50">
           <div className="w-full h-full rounded-full flex items-center justify-center bg-transparent">
             <Icon size={16} stroke={2} className="text-white/50" />
           </div>
        </div>
      )
    }
    return (
      <SmartLink href={href} legacyBehavior passHref>
        <a className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-1 cursor-pointer group shadow-lg transition-transform active:scale-95" aria-label={label}>
          <div className="w-full h-full rounded-full flex items-center justify-center bg-transparent group-hover:bg-[#FBFB46] transition-colors duration-200">
            <Icon size={16} stroke={2} className="text-black" />
          </div>
        </a>
      </SmartLink>
    )
  }

  return (
    <div className="mt-12 py-6 flex flex-col items-center">
      {/* Dark Pill Container */}
      <div className="bg-[#2a2a2a] rounded-full p-1.5 flex items-center gap-3 shadow-2xl">
        
        {/* First Page */}
        <DoubleCircleBtn 
          href={{ pathname: `${pagePrefix}/`, query: router.query.s ? { s: router.query.s } : {} }}
          disabled={currentPage === 1}
          icon={IconChevronsLeft}
          label="First Page"
        />

        {/* Prev Page */}
        <DoubleCircleBtn 
          href={{ 
            pathname: currentPage - 1 === 1 ? `${pagePrefix}/` : `${pagePrefix}/page/${currentPage - 1}`,
            query: router.query.s ? { s: router.query.s } : {}
          }}
          disabled={!showPrev}
          icon={IconChevronLeft}
          label="Previous Page"
        />

        {/* Text Display */}
        <div className="font-mono text-white text-lg tracking-widest min-w-[60px] text-center select-none">
          {currentPage}/{totalPage}
        </div>

        {/* Next Page */}
        <DoubleCircleBtn 
          href={{ pathname: `${pagePrefix}/page/${currentPage + 1}`, query: router.query.s ? { s: router.query.s } : {} }}
          disabled={!showNext}
          icon={IconChevronRight}
          label="Next Page"
        />

        {/* Last Page */}
        <DoubleCircleBtn 
          href={{ pathname: `${pagePrefix}/page/${totalPage}`, query: router.query.s ? { s: router.query.s } : {} }}
          disabled={currentPage === totalPage}
          icon={IconChevronsRight}
          label="Last Page"
        />

      </div>
    </div>
  )
}

// Helper functions like generatePages are no longer needed for this specific layout
// but we keep the export default.

export default PaginationNumber
