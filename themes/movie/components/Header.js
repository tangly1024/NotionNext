import Link from 'next/link'
import { siteConfig } from '@/lib/config'
import { MenuListTop } from './MenuListTop'

/**
 * 网站顶部
 * @returns
 */
export const Header = props => {
  return (
    <header className="w-full px-6 relative z-10">
      <div className="mx-auto md:flex justify-between items-center">
        <Link
          href="/"
          className="py-6 w-full text-3xl font-bold text-center md:text-left md:w-auto text-gray-dark no-underline flex justify-center items-center"
        >
          {siteConfig('TITLE')}
        </Link>
        <div className="w-full md:w-auto text-center md:text-right">
          {/* 右侧文字 */}
          <MenuListTop {...props} />
        </div>
      </div>
    </header>
  )
}
