import { useGlobal } from '@/lib/global'
import dynamic from 'next/dynamic'

const NotionPage = dynamic(() => import('@/components/NotionPage'))

const Announcement = ({ post, className }) => {
  const { locale } = useGlobal()
  if (!post) {
    return <></>
  }
  return <>
        <div className="text-sm pb-1 px-2 flex flex-nowrap justify-between">
            <div className="font-light text-gray-600  dark:text-gray-200">
                <i className="mr-2 fas fa-bullhorn" />{locale.COMMON.ANNOUNCEMENT}
            </div>
        </div>
        {post && (<div id="announcement-content">
            <NotionPage post={post} className='text-center ' />
        </div>)}
    </>
}
export default Announcement
