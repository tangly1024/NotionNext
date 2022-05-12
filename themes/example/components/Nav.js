import { useGlobal } from '@/lib/global'
import Link from 'next/link'

/**
 * 菜单导航
 * @param {*} props
 * @returns
 */
export const Nav = (props) => {
  const { customNav } = props
  const { locale } = useGlobal()
  let links = [
    { icon: 'fas fa-search', name: locale.NAV.SEARCH, to: '/search' },
    { icon: 'fas fa-archive', name: locale.NAV.ARCHIVE, to: '/archive' },
    { icon: 'fas fa-folder', name: locale.COMMON.CATEGORY, to: '/category' },
    { icon: 'fas fa-tag', name: locale.COMMON.TAGS, to: '/tag' }
  ]

  if (customNav) {
    links = links.concat(customNav)
  }

  return <nav className="w-full bg-white md:pt-0 px-6 relative z-20 border-t border-b border-gray-light dark:border-hexo-black-gray dark:bg-black">
        <div className="container mx-auto max-w-4xl md:flex justify-between items-center text-sm md:text-md md:justify-start">
            <div className="w-full md:w-2/3 text-center md:text-left py-4 flex flex-wrap justify-center items-stretch md:justify-start md:items-start">
                {links.map(link => {
                  return link && <Link href={link.to} key={link.to}>
                        <a className="px-2 md:pl-0 md:mr-3 md:pr-3 text-gray-700 dark:text-gray-200 no-underline md:border-r border-gray-light">
                            {link.name}
                        </a>
                    </Link>
                })}
            </div>
            <div className="w-full md:w-1/3 text-center md:text-right">
                {/* <!-- extra links --> */}
            </div>
        </div>
    </nav>
}
