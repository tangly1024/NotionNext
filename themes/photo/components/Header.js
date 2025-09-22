import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import MenuHierarchical from './MenuHierarchical'

/**
 * 网站顶部
 * @returns
 */
export const Header = props => {
  return (
    <>
      <header className='w-full px-8 h-20 z-30 flex lg:flex-row md:flex-col justify-center items-center'>
        {/* 左侧Logo */}
        <SmartLink
          href='/'
          className='logo whitespace-nowrap text-2xl md:text-3xl text-gray-dark no-underline flex items-center'>
          {siteConfig('TITLE')}
        </SmartLink>

        {/* 右侧使用一个三级菜单 */}
        <div className='ml-6 mt-7'>
          <MenuHierarchical {...props} />
        </div>
      </header>
    </>
  )
}
