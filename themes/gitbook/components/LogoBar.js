import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import Link from 'next/link'
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
      <Link
        href={`/${siteConfig('GITBOOK_INDEX_PAGE', '', CONFIG)}`}
        className='flex text-lg font-bold md:text-2xl dark:text-gray-200'>
        <LazyImage
          src={siteInfo?.icon}
          width={24}
          height={24}
          alt={siteConfig('AUTHOR')}
          className='mr-2 hidden md:block '
        />
        {siteInfo?.title || siteConfig('TITLE')}
      </Link>
    </div>
  )
}
