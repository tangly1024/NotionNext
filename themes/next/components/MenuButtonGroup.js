import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useGlobal } from '@/lib/global'
import CONFIG_NEXT from '../config_next'

const MenuButtonGroup = (props) => {
  const { postCount, customNav } = props
  const { locale } = useGlobal()
  const router = useRouter()
  const archiveSlot = <div className='bg-gray-300 dark:bg-gray-500 rounded-md text-gray-50 px-1 text-xs'>{postCount}</div>

  const defaultLinks = [
    { icon: 'fas fa-home', name: locale.NAV.INDEX, to: '/' || '/', show: true },
    { icon: 'fas fa-th', name: locale.COMMON.CATEGORY, to: '/category', show: CONFIG_NEXT.MENU_CATEGORY },
    { icon: 'fas fa-tag', name: locale.COMMON.TAGS, to: '/tag', show: CONFIG_NEXT.MENU_TAG },
    { icon: 'fas fa-archive', name: locale.NAV.ARCHIVE, to: '/archive', slot: archiveSlot, show: CONFIG_NEXT.MENU_ARCHIVE }
  ]
  let links = [].concat(defaultLinks)
  if (customNav) {
    links = defaultLinks.concat(customNav)
  }

  return (
    <nav id='nav' className='leading-8 text-gray-500 dark:text-gray-400 font-sans'>
        {links.map(link => {
          if (link && link.show) {
            const selected = (router.pathname === link.to) || (router.asPath === link.to)
            return (
              <Link
                key={link.to}
                title={link.to}
                href={link.to}
                target={link.to.indexOf('http') === 0 ? '_blank' : '_self'}
                className={'py-1.5 px-5 duration-300 text-base justify-between hover:bg-gray-700 hover:text-white hover:shadow-lg cursor-pointer font-light flex flex-nowrap items-center ' +
                    (selected ? 'bg-gray-200 text-black' : ' ')}>

                <div className='my-auto items-center justify-center flex '>
                  <i className={`${link.icon} w-4 text-center`} />
                  <div className={'ml-4'}>{link.name}</div>
                </div>
                {link.slot}

              </Link>
            )
          } else {
            return <></>
          }
        })}
      </nav>
  )
}
export default MenuButtonGroup
