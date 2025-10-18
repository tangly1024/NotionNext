// import { useGlobal } from '@/lib/global'
import dynamic from 'next/dynamic'

const NotionPage = dynamic(() => import('@/components/NotionPage'))

const Announcement = ({ notice, className }) => {
//   const { locale } = useGlobal()
  if (notice?.blockMap) {
    return <div className={className}>
        <section id='announcement-wrapper' className="dark:text-gray-300">
            {/* <div><i className='mr-2 fas fa-bullhorn' />{locale.COMMON.ANNOUNCEMENT}</div> */}
            {notice && (<div id="announcement-content">
            <NotionPage post={notice} />
        </div>)}
        </section>
    </div>
  } else {
    return <></>
  }
}
export default Announcement
