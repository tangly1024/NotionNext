import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

/**
 * 网站顶部
 * @returns
 */
export default function Header(props) {
  return (
    <header className='w-full text-center bg-white dark:bg-black relative z-10 border-b border-gray-100 dark:border-gray-800'>
      <div className='max-w-3xl mx-auto'>
        <div className='py-2'>
          <div className='text-lg font-bold dark:text-white'>
            {siteConfig('TITLE')}
          </div>
        </div>
      </div>
    </header>
  )
}
