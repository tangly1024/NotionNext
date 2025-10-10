import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import BannerItem from './BannerItem'

/**
 * 全宽
 * @param {*} props
 * @returns
 */
export default function BannerFullWidth() {
  const { siteInfo } = useGlobal()
  const banner = siteConfig('MAGZINE_HOME_BANNER_ENABLE')
  if (!banner) {
    return null
  }
  return (
    <div className='w-full flex lg:flex-row flex-col justify-between lg:h-96 bg-black'>
      <LazyImage
        alt={siteInfo?.title}
        src={siteInfo?.pageCover}
        className={`banner-cover w-full lg:h-96 object-cover object-center `}
      />

      <div className='w-full flex items-center justify-center'>
        <BannerItem />
      </div>
    </div>
  )
}
