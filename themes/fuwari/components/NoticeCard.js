import { siteConfig } from '@/lib/config'
import Announcement from './Announcement'
import CONFIG from '../config'

const NoticeCard = ({ notice }) => {
  if (!siteConfig('FUWARI_WIDGET_NOTICE', true, CONFIG)) return null
  return <Announcement post={notice} className='p-5 mb-4' />
}

export default NoticeCard

