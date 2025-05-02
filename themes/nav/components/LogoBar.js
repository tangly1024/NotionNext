import Link from 'next/link'
import CONFIG from '../config'
import { siteConfig } from '@/lib/config'

/**
 * Logo区域
 * @param {*} props
 * @returns
 */
export default function LogoBar(props) {
  const { siteInfo } = props

  return (
        <div id='top-wrapper' className='w-full flex items-center'>
                <Link href='/' className='md:w-48 grid justify-items-center text-md md:text-xl dark:text-gray-200'>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={siteInfo?.icon?.replaceAll('width=400', 'width=280')}
                        height='44px' alt={siteConfig('AUTHOR') + ' - ' + siteConfig('NEXT_PUBLIC_BIO')} className='md:block transition-all hover:scale-110 duration-150' placeholderSrc='' />
                    {siteConfig('NAV_SHOW_TITLE_TEXT', null, CONFIG) && siteConfig('TITLE')}
                </Link>
        </div>
  )
}
