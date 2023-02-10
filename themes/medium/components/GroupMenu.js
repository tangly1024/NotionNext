import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useGlobal } from '@/lib/global'
import CONFIG_MEDIUM from '../config_medium'

function GroupMenu ({ customNav }) {
  const { locale } = useGlobal()
  const router = useRouter()

  let links = [
    // { name: locale.NAV.INDEX, to: '/' || '/', show: true },
    { name: locale.COMMON.CATEGORY, to: '/category', show: CONFIG_MEDIUM.MENU_CATEGORY },
    { name: locale.COMMON.TAGS, to: '/tag', show: CONFIG_MEDIUM.MENU_TAG },
    { name: locale.NAV.ARCHIVE, to: '/archive', show: CONFIG_MEDIUM.MENU_ARCHIVE }
    // { name: locale.NAV.SEARCH, to: '/search', show: CONFIG_MEDIUM.MENU_SEARCH }
  ]

  if (customNav) {
    links = links.concat(customNav)
  }

  return (
    <nav id='nav' className=' text-md'>
        {links.map(link => {
          if (link.show) {
            const selected = (router.pathname === link.to) || (router.asPath === link.to)
            return (
              <Link
                key={`${link.to}`}
                title={link.to}
                href={link.to}
                className={'py-0.5 duration-500 justify-between text-gray-500 dark:text-gray-300 hover:text-black hover:underline cursor-pointer flex flex-nowrap items-center ' +
                    (selected ? 'text-black' : ' ')}>

                <div className='my-auto items-center justify-center flex '>
                  <div className={ 'hover:text-black'}>{link.name}</div>
                </div>
                {link.slot}

              </Link>
            );
          } else {
            return null
          }
        })}
      </nav>
  );
}

export default GroupMenu
