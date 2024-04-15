import { AdSlot } from '@/components/plugins/GoogleAdsense'
import Live2D from '@/components/plugins/Live2D'
import WWAds from '@/components/plugins/WWAds'
import Announcement from './Announcement'
import Catalog from './Catalog'

/**
 * 侧边栏
 * @param {*} props
 * @returns
 */
export default function SideBar(props) {
  const { notice } = props
  return (
    <>
      <Catalog {...props} />

      <Live2D />

      <Announcement post={notice} />

      <AdSlot />
      <WWAds orientation='vertical' className='w-full' />
    </>
  )
}
