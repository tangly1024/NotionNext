import { siteConfig } from '@/lib/config'
import Link from 'next/link'
import { MenuList } from './MenuList'

/**
 * 网站顶部
 * @returns
 */
export const Header = props => {
  return (
    <header className='w-full px-6 bg-white  dark:bg-black relative z-20'>
      <div className='container mx-auto max-w-4xl md:flex justify-between items-center'>
        <Link
          href='/'
          className='py-6 w-full text-center md:text-left md:w-auto text-gray-dark no-underline flex justify-center items-center'>
          {siteConfig('TITLE')}
        </Link>
        <div className='w-full md:w-auto text-center md:text-right'>
          {/* 右侧文字 */}
        </div>
      </div>

      {/* 菜单 */}
      <MenuList {...props} />
    </header>
  )
}
