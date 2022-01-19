import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useGlobal } from '@/lib/global'
import CONFIG_FUKA from '../config_fuka'

function GroupMenu () {
  const { locale } = useGlobal()
  const router = useRouter()

  const links = [
    { id: 0, name: locale.NAV.INDEX, to: '/' || '/', show: true },
    { id: 1, name: locale.COMMON.CATEGORY, to: '/category', show: CONFIG_FUKA.MENU_CATEGORY },
    { id: 2, name: locale.COMMON.TAGS, to: '/tag', show: CONFIG_FUKA.MENU_TAG },
    { id: 3, name: locale.NAV.ARCHIVE, to: '/archive', show: CONFIG_FUKA.MENU_ARCHIVE },
    { id: 4, name: locale.NAV.ABOUT, to: '/about', show: CONFIG_FUKA.MENU_ABOUT }
  ]
  return <nav id='nav' className='font-sans text-sm'>
      {links.map(link => {
        if (link.show) {
          const selected = (router.pathname === link.to) || (router.asPath === link.to)
          return <Link key={`${link.id}-${link.to}`} title={link.to} href={link.to} >
          <a className={'py-0.5 duration-500 justify-between text-gray-500 hover:text-black cursor-pointer flex flex-nowrap items-center ' +
              (selected ? 'text-black' : ' ')} >
              <div className='my-auto items-center justify-center flex '>
                <div className={ 'text-gray-500 hover:text-black'}>{link.name}</div>
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

export default GroupMenu
