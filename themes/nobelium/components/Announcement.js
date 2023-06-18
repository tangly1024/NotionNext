import dynamic from 'next/dynamic'

const NotionPage = dynamic(() => import('@/components/NotionPage'))

const Announcement = ({ notice, className }) => {
  if (notice?.blockMap) {
    return <div className={className}>
            <section id='announcement-wrapper' className='mb-10'>
                {notice && (<div id="announcement-content">
                    <NotionPage post={notice} className='text-center ' />
                </div>)}
            </section>
        </div>
  } else {
    return null
  }
}
export default Announcement
