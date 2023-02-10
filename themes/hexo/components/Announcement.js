import dynamic from 'next/dynamic'

const NotionPage = dynamic(() => import('@/components/NotionPage'))

const Announcement = ({ post, className }) => {
  if (!post) {
    return <></>
  }
  return <div
        data-aos="fade-up"
        data-aos-duration="600"
        data-aos-easing="ease-in-out"
        data-aos-once="false"
        data-aos-anchor-placement="top-bottom"
        className={className}>
        <section id='announcement-wrapper' className="hover:shadow-md dark:text-gray-300 border dark:border-black rounded-xl px-2 py-4 bg-white dark:bg-hexo-black-gray">
            <div><i className='mr-2 fas fa-bullhorn' />公告</div>
            {post && (<div id="announcement-content">
            <NotionPage post={post} className='text-center ' />
        </div>)}
        </section>
    </div>
}
export default Announcement
