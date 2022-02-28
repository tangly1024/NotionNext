import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useGlobal } from '@/lib/global'
import CONFIG_HEXO from '../config_hexo'

const MenuButtonGroup = (props) => {
  const { postCount, customNav } = props
  const { locale } = useGlobal()
  const router = useRouter()
  const archiveSlot = <div className='bg-blue-300 dark:bg-blue-500 rounded-md text-gray-50 px-1 text-xs'>{postCount}</div>

  let links = [
    { id: 0, icon: 'fas fa-home', name: locale.NAV.INDEX, to: '/' || '/', show: true },
    { id: 1, icon: 'fas fa-th', name: locale.COMMON.CATEGORY, to: '/category', show: CONFIG_HEXO.MENU_CATEGORY },
    { id: 2, icon: 'fas fa-tag', name: locale.COMMON.TAGS, to: '/tag', show: CONFIG_HEXO.MENU_TAG },
    { id: 3, icon: 'fas fa-archive', name: locale.NAV.ARCHIVE, to: '/archive', slot: archiveSlot, show: CONFIG_HEXO.MENU_ARCHIVE },
    { id: 4, icon: 'fas fa-user', name: locale.NAV.ABOUT, to: '/about', show: CONFIG_HEXO.MENU_ABOUT }
  ]
  if (customNav) {
    links = links.concat(customNav)
  }
  return <nav id='nav' className='leading-8 text-gray-500 dark:text-gray-400 font-sans w-full'>
      {links.map(link => {
        if (link.show) {
          const selected = (router.pathname === link.to) || (router.asPath === link.to)
          return <Link key={`${link.id}-${link.to}`} title={link.to} href={link.to} >
          <a className={'py-1.5 my-1 px-5 duration-300 text-base justify-between hover:bg-blue-600 hover:text-white hover:shadow-lg cursor-pointer flex flex-nowrap items-center ' +
              (selected ? 'bg-blue-600 text-white' : ' ')} >
              <div className='my-auto items-center justify-center flex '>
                <i className={link.icon} />
                <div className={'ml-4'}>{link.name}</div>
              </div>
              {link.slot}
            </a>
          </Link>
        } else {
          return null
        }
      })}
    </nav>
}
export default MenuButtonGroup
