import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import Link from 'next/link'
import CONFIG from '../config'
import SocialButton from './SocialButton'
import Header from './Header'

/**
 * 侧边栏个人资料组件
 * @param {*} props
 * @returns
 */
export default function ProfileSidebar(props) {
  const { siteInfo } = props

  return (
    <div className='sticky top-6 flex flex-col items-center'>
      <Header />
      <div className='pt-4'>
        <Link href='/'>
          <div className='hover:rotate-45 hover:scale-110 transform duration-200 cursor-pointer flex justify-center'>
            <LazyImage
              priority={true}
              src={siteInfo?.icon}
              className='rounded-full'
              width={80}
              height={80}
              alt={siteConfig('AUTHOR')}
            />
          </div>
        </Link>

        <div className='flex flex-col items-center mt-3'>
          <div className='text-lg font-serif dark:text-white py-1 hover:scale-105 transform duration-200 text-center'>
            {siteConfig('AUTHOR')}
          </div>
          <div
            className='font-light dark:text-white py-1 hover:scale-105 transform duration-200 text-center text-xs'
            dangerouslySetInnerHTML={{
              __html: siteConfig('SIMPLE_LOGO_DESCRIPTION', null, CONFIG)
            }}
          />
        </div>

        <div className='flex justify-center mt-2'>
          <SocialButton />
        </div>
        
        <div className='text-xs mt-3 text-gray-500 dark:text-gray-300 text-center px-2'>
          {siteConfig('DESCRIPTION')}
        </div>
      </div>
    </div>
  )
} 