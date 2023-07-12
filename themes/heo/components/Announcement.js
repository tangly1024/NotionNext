import dynamic from 'next/dynamic'

const NotionPage = dynamic(() => import('@/components/NotionPage'))

const Announcement = ({ post, className }) => {
  if (post?.blockMap) {
    return <div >
            {post && (
                <div id="announcement-content">
                    <NotionPage post={post} />
                </div>
            )}
        </div>
  } else {
    return <></>
  }
}
export default Announcement
