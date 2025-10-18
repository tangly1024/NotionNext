import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import CONFIG from '../config'

const MenuList = props => {
  const { postCount, customNav } = props
  const { locale } = useGlobal()
  const router = useRouter()
  const archiveSlot = (
    <div className='bg-gray-300 dark:bg-gray-500 rounded-md text-gray-50 px-1 text-xs'>
      {postCount}
    </div>
  )

  let links = [
    {
      icon: 'fas fa-home',
      name: locale.NAV.INDEX,
      href: '/' || '/',
      show: true
    },
    {
      icon: 'fas fa-th',
      name: locale.COMMON.CATEGORY,
      href: '/category',
      show: siteConfig('MATERY_MENU_CATEGORY', null, CONFIG)
    },
    {
      icon: 'fas fa-tag',
      name: locale.COMMON.TAGS,
      href: '/tag',
      show: siteConfig('MATERY_MENU_TAG', null, CONFIG)
    },
    {
      icon: 'fas fa-archive',
      name: locale.NAV.ARCHIVE,
      href: '/archive',
      slot: archiveSlot,
      show: siteConfig('MATERY_MENU_ARCHIVE', null, CONFIG)
    },
    {
      icon: 'fas fa-search',
      name: locale.NAV.SEARCH,
      href: '/search',
      show: siteConfig('MATERY_MENU_SEARCH', null, CONFIG)
    }
  ]
  if (customNav) {
    links = links.concat(customNav)
  }

  return (
    <nav id='nav' className='leading-8 text-gray-500 dark:text-gray-300 '>
      {links.map(link => {
        if (link && link.show) {
          const selected =
            router.pathname === link.href || router.asPath === link.href
          return (
            <SmartLink
              key={`${link.href}`}
              title={link.href}
              href={link.href}
              className={
                'py-1.5 px-5 text-base justify-between hover:bg-indigo-400 hover:text-white hover:shadow-lg cursor-pointer font-light flex flex-nowrap items-center ' +
                (selected ? 'bg-gray-200 text-black' : ' ')
              }>
              <div className='my-auto items-center justify-center flex '>
                <i className={`${link.icon} w-4 text-center`} />
                <div className={'ml-4'}>{link.name}</div>
              </div>
              {link.slot}
            </SmartLink>
          )
        } else {
          return null
        }
      })}
    </nav>
  )
}
export default MenuList
