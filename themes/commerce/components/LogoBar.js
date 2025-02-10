import Link from 'next/link'
// import { siteConfig } from '@/lib/config'
import LazyImage from '@/components/LazyImage';

/**
 * Logo图标
 * @param {*} props
 * @returns
 */
export default function LogoBar (props) {
  const { siteInfo } = props
  return (
    <div id='top-wrapper' className='w-full flex items-center'>
          <Link href='/' className='text-md md:text-xl dark:text-gray-200 r'>
            <LazyImage className='h-12 mr-3' src={siteInfo?.icon}/>
          </Link>
          {/* <div>{siteConfig('TITLE')}</div> */}
    </div>
  );
}
