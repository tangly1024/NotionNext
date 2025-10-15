import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'

/**
 * Logo区域
 * @param {*} props
 * @returns
 */
export default function LogoBar(props) {
  const { siteInfo } = props
  return (
    <div id='logo-wrapper' className='w-full flex items-center mr-2'>
      <SmartLink
        href={`/${siteConfig('GITBOOK_INDEX_PAGE', '', CONFIG)}`}
        className='flex text-lg font-bold md:text-2xl dark:text-gray-200 items-center'>
        <LazyImage
          src={siteInfo?.icon}
          width={24}
          height={24}
          alt={siteConfig('AUTHOR')}
          className='mr-2 hidden md:block '
        />
        {siteInfo?.title || siteConfig('TITLE')}
      </SmartLink>
    </div>
  )
}
