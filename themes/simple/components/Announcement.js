import dynamic from 'next/dynamic'

const NotionPage = dynamic(() => import('@/components/NotionPage'))

const Announcement = ({ post, className }) => {
  if (!post) {
    return <></>
  }
  return <>{post && (<div id="announcement-content" className='px-3'>
        <NotionPage post={post} />
    </div>)} </>
}
export default Announcement
