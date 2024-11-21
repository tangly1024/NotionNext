import { siteConfig } from '@/lib/config'
import Link from 'next/link'
import CONFIG from '../config'

/**
 * 文字广告Banner
 * @param {*} props
 * @returns
 */
export default function BannerItem() {
  // 首屏信息栏按钮文字
  const banner = siteConfig('MAGZINE_HOME_BANNER_ENABLE', null, CONFIG)
  const button = siteConfig('MAGZINE_HOME_BUTTON', null, CONFIG)
  const text = siteConfig('MAGZINE_HOME_BUTTON_TEXT', null, CONFIG)
  const url = siteConfig('MAGZINE_HOME_BUTTON_URL', null, CONFIG)
  const title = siteConfig('MAGZINE_HOME_TITLE', null, CONFIG)
  const description = siteConfig('MAGZINE_HOME_DESCRIPTION', null, CONFIG)
  const tips = siteConfig('MAGZINE_HOME_TIPS', null, CONFIG)

  if (!banner) {
    return null
  }

  return (
    <div className='flex flex-col p-5 gap-y-5 dark items-center justify-between w-full bg-black text-white'>
      {/* 首屏导航按钮 */}
      <h2 className='text-2xl font-semibold'>{title}</h2>
      <h3 className='text-sm'>{description}</h3>
      {button && (
        <div className='mt-2 text-center px-6 py-3 font-semibold rounded-3xl text-black bg-[#7BE986] hover:bg-[#62BA6B]'>
          <Link href={url}>{text}</Link>
        </div>
      )}
      <span className='text-xs'>{tips}</span>
    </div>
  )
}
