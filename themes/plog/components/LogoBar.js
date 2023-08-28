import BLOG from '@/blog.config'
import LazyImage from '@/components/LazyImage'
import Link from 'next/link'
import CONFIG from '../config'
import { SvgIcon } from './SvgIcon'

/**
 * logo文字栏
 * @param {*} props
 * @returns
 */
export default function LogoBar(props) {
  const { navBarTitle, siteInfo } = props

  return <div className="flex items-center">
    <Link href="/" aria-label={BLOG.title}>
        <div className="h-6 w-6">
            {CONFIG.NAV_NOTION_ICON
              ? <LazyImage src={siteInfo?.icon} className='rounded-full' width={24} height={24} alt={BLOG.AUTHOR} />
              : <SvgIcon />}
        </div>
    </Link>
    {navBarTitle
      ? (
            <Link href="/" aria-label={BLOG.title}>
                <p className="ml-2 font-medium text-gray-800 dark:text-gray-300 header-name">
                    {navBarTitle}
                </p>
            </Link>
        )
      : (
            <p className="ml-2 font-medium text-gray-800 dark:text-gray-300 header-name">
                <Link href="/" aria-label={BLOG.title}> {siteInfo?.title}</Link>
                {' '}<span className="font-normal text-sm text-gray-00 dark:text-gray-400">{siteInfo?.description}</span>
            </p>
        )}
</div>
}
