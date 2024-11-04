import dynamic from 'next/dynamic'

const NotionPage = dynamic(() => import('@/components/NotionPage'))
/**
 * 公告
 * @param {*} param0
 * @returns
 */
const Announcement = ({ notice, className }) => {
  if (!notice || Object.keys(notice).length === 0) {
    return <></>
  }
  return (
    <aside className={className}>
      {notice && (
        <div id='announcement-content'>
          <NotionPage post={notice} className='text-center ' />
        </div>
      )}
    </aside>
  )
}
export default Announcement
