import dynamic from 'next/dynamic'

const NotionPage = dynamic(() => import('@/components/NotionPage'))

const Announcement = ({ post, className }) => {
  if (!post) {
    return <></>
  }
  return <>{post && (<div id="announcement-content">
        <NotionPage post={post} className='text-center ' />
    </div>)} </>
}
export default Announcement
