import { useGlobal } from '@/lib/global'
import dynamic from 'next/dynamic'

const NotionPage = dynamic(() => import('@/components/NotionPage'))

/**
 * 公告模块（单篇 Notion 页）
 */
const Announcement = ({ post, className }) => {
  const { locale } = useGlobal()
  if (!post || Object.keys(post).length === 0) {
    return <></>
  }
  return (
    <aside
      className={`tl-card mb-6 w-full overflow-hidden ${className || ''}`}>
      <h3 className='border-b border-[var(--tl-border)] bg-[var(--tl-bg)] px-4 py-3 text-sm text-[var(--tl-text)]'>
        <i className='mr-2 fas fa-bullhorn' />
        {post?.title || locale.COMMON.ANNOUNCEMENT}
      </h3>

      {post && (
        <div id='announcement-content' className='px-2 py-3 text-left'>
          <NotionPage post={post} className='text-center' />
        </div>
      )}
    </aside>
  )
}
export default Announcement
