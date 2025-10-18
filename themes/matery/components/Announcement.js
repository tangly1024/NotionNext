import { useGlobal } from '@/lib/global'
import dynamic from 'next/dynamic'

const NotionPage = dynamic(() => import('@/components/NotionPage'))

const Announcement = ({ notice }) => {
  const { locale } = useGlobal()
  if (!notice || Object.keys(notice).length === 0) {
    return <></>
  }
  return <div className="px-3 w-full">
        <div
            data-aos="zoom-in"
            data-aos-duration="500"
            data-aos-once="true"
            data-aos-anchor-placement="top-bottom"
            className="mb-4 p-2 overflow-auto shadow-md border dark:border-black rounded-xl bg-white dark:bg-hexo-black-gray">
            <div className="text-sm flex flex-nowrap justify-between">
                <div className="font-light text-gray-600  dark:text-gray-200">
                    <i className="mx-2 fas fa-bullhorn" />{locale.COMMON.ANNOUNCEMENT}
                </div>
            </div>
            {notice && (<div id="announcement-content">
                <NotionPage post={notice} className='text-center ' />
            </div>)}
        </div>
    </div>
}
export default Announcement
