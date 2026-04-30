import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useRouter } from 'next/router'

const HIDDEN = -1

function buildPages(currentPage, totalPage) {
  const pages = []
  const ADJ = 2
  let left = Math.max(1, currentPage - ADJ)
  let right = Math.min(totalPage, currentPage + ADJ)

  while (right - left < ADJ * 2 && (left > 1 || right < totalPage)) {
    if (left > 1) left--
    else if (right < totalPage) right++
    else break
  }

  if (left > 1) pages.push(1)
  if (left > 2) pages.push(HIDDEN)
  for (let i = left; i <= right; i++) pages.push(i)
  if (right < totalPage - 1) pages.push(HIDDEN)
  if (right < totalPage) pages.push(totalPage)

  return pages
}

const Pagination = ({ page = 1, postCount = 0 }) => {
  const router = useRouter()
  const POSTS_PER_PAGE = parseInt(siteConfig('POSTS_PER_PAGE', 12), 10)
  const totalPage = Math.ceil((postCount || 0) / POSTS_PER_PAGE)
  const currentPage = parseInt(page, 10) || 1

  if (!totalPage || totalPage <= 1) return null

  const pagePrefix = router.asPath
    .split('?')[0]
    .replace(/\/page\/[1-9]\d*/, '')
    .replace(/\/$/, '')

  const pages = buildPages(currentPage, totalPage)
  const prevHref = currentPage <= 2 ? `${pagePrefix || ''}/` : `${pagePrefix}/page/${currentPage - 1}`
  const nextHref = `${pagePrefix}/page/${currentPage + 1}`

  return (
    <div className='fuwari-pagination mt-8 mb-4 flex items-center justify-center gap-3'>
      <SmartLink
        href={currentPage > 1 ? prevHref : '#'}
        aria-label='Previous Page'
        className={`fuwari-page-btn ${currentPage > 1 ? '' : 'fuwari-page-btn-disabled'}`}>
        <i className='fas fa-chevron-left' />
      </SmartLink>

      <div className='fuwari-page-box flex items-center gap-1'>
        {pages.map((p, idx) => {
          if (p === HIDDEN) {
            return (
              <span key={`h-${idx}`} className='fuwari-page-ellipsis'>
                <i className='fas fa-ellipsis-h' />
              </span>
            )
          }

          return (
            <SmartLink
              key={`p-${p}`}
              href={p === 1 ? `${pagePrefix || ''}/` : `${pagePrefix}/page/${p}`}
              className={`fuwari-page-num ${p === currentPage ? 'fuwari-page-num-active' : ''}`}>
              {p}
            </SmartLink>
          )
        })}
      </div>

      <SmartLink
        href={currentPage < totalPage ? nextHref : '#'}
        aria-label='Next Page'
        className={`fuwari-page-btn ${currentPage < totalPage ? '' : 'fuwari-page-btn-disabled'}`}>
        <i className='fas fa-chevron-right' />
      </SmartLink>
    </div>
  )
}

export default Pagination

