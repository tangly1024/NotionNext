import { siteConfig } from '@/lib/config'
import Link from 'next/link'
import MenuHierarchical from './MenuHierarchical'

/**
 * 网站顶部
 * @returns
 */
export const Header = props => {
  return (
    <>
      <header className='w-full px-8 h-20 z-20 flex lg:flex-row md:flex-col justify-center items-center'>
        {/* 左侧Logo */}
        <Link
          href='/'
          className='logo whitespace-nowrap text-2xl md:text-3xl font-bold text-gray-dark no-underline flex items-center'>
          {siteConfig('TITLE')}
        </Link>

        {/* 右侧使用一个三级菜单 */}
        <div className='md:w-auto text-center flex space-x-2'>
          <MenuHierarchical {...props} />
        </div>
      </header>
    </>
  )
}
