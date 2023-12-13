import BLOG from '@/blog.config'
import LazyImage from '@/components/LazyImage'
import Link from 'next/link'
import CONFIG from '../config'
import SocialButton from './SocialButton'
// import CONFIG from '../config_simple'

/**
 * 网站顶部
 * @returns
 */
export const Header = (props) => {
  const { siteInfo } = props
  const avatar = siteInfo?.icon || BLOG.AVATAR

  return (
        <header className="text-center justify-between items-center px-6 bg-white h-80 dark:bg-black relative z-10">
            <div className="float-none inline-block py-12">
                <Link href='/'>
                    {/* 可使用一张单图作为logo */}
                    <div className='flex space-x-6'>
                        <div className='hover:rotate-45 hover:scale-125 transform duration-200 cursor-pointer'>
                            <LazyImage src={avatar} className='rounded-full' width={130} height={130} alt={BLOG.AUTHOR} />
                        </div>

                        <div className='flex-col flex justify-center'>
                            <div className='text-2xl font-serif dark:text-white py-2 hover:scale-105 transform duration-200'>{BLOG.AUTHOR}</div>
                            <div className='font-light dark:text-white py-2 hover:scale-105 transform duration-200 text-center' dangerouslySetInnerHTML={{ __html: CONFIG.LOGO_DESCRIPTION }} />
                        </div>
                    </div>
                </Link>

                <div className='flex justify-center'>
                <SocialButton />
                </div>
                <div className='text-xs mt-4 text-gray-500 dark:text-gray-300'>{siteInfo?.description}</div>
            </div>
        </header>
  )
}
