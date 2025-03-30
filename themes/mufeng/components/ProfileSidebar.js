import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import Link from 'next/link'
import CONFIG from '../config'
import SocialButton from './SocialButton'
import Header from './Header'
import Catalog from './Catalog'

/**
 * 侧边栏个人资料组件
 * @param {*} props
 * @returns
 */
export default function ProfileSidebar(props) {
  const { siteInfo, post } = props

  return (
    <div className='flex flex-col items-center w-full overflow-hidden'>
      {/* 个人资料部分 - 固定在顶部 */}
      <div className='sticky top-6 w-full'>
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
          
          <div className='text-xs mt-3 mb-6 text-gray-500 dark:text-gray-300 text-center px-2'>
            {siteConfig('DESCRIPTION')}
          </div>
        </div>
      </div>

      {/* 文章目录 - 固定在侧边栏合适位置 */}
      {post && post?.toc?.length > 0 && (
        <div className='sticky top-[250px] w-full mt-2 flex flex-col'>
          <div className='border-t dark:border-gray-700 w-full pt-4 mb-1'></div>
          <div className='bg-white dark:bg-black rounded-lg p-2 overflow-hidden'>
            <Catalog post={post} />
          </div>
          {/* 底部渐变遮罩，提示可以滚动 */}
          <div className='absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white dark:from-black to-transparent pointer-events-none'></div>
        </div>
      )}
    </div>
  )
} 