import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useGlobal } from '@/lib/global'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArchive, faHome, faInfoCircle } from '@fortawesome/free-solid-svg-icons'

const MenuButtonGroup = ({ allowCollapse = false }) => {
  const { locale } = useGlobal()
  const router = useRouter()
  const links = [
    { id: 0, icon: faHome, name: locale.NAV.INDEX, to: '/' || '/', show: true },
    { id: 1, icon: faArchive, name: locale.NAV.ARCHIVE, to: '/archive', show: true },
    { id: 2, icon: faInfoCircle, name: locale.NAV.ABOUT, to: '/article/about', show: true }
    // { id: 7, icon: 'faGithub', name: 'Github', to: 'https://github.com/tangly1024', show: true },
    // { id: 5, icon: 'faWeibo', name: '微博', to: 'https://weibo.com/tangly1024', show: true },
    // { id: 4, icon: 'faEnvelope', name: locale.NAV.MAIL, to: 'mailto:tlyong1992@hotmail.com', show: true }
    // { id: 2, icon: 'faRssSquare', name: locale.NAV.RSS, to: '/feed', show: true },
    // { id: 3, icon: 'faCompass', name: '发现', to: 'https://search.tangly1024.com/', show: true }
    // { id: 6, icon: 'faMapMarker', name: 'Fuzhou', to: '#', show: true },
    // { id: 8, icon: 'faTwitter', name: 'Twitter', to: 'https://twitter.com/troy1024_1', show: true },
    // { id: 9, icon: 'faTelegram', name: 'Telegram', to: 'https://t.me/tangly_1024', show: true }
  ]
  return <nav id='nav'>
    <div className='leading-8 text-gray-500 dark:text-gray-400'>
      {links.map(link => {
        if (link.show) {
          const selected = (router.pathname === link.to) || (router.asPath === link.to)
          return <Link key={link.id + link.icon} title={link.to} href={link.to} >
            <a className={'py-2 px-5 text-lg hover:bg-blue-400 hover:text-white cursor-pointer duration-100 flex flex-nowrap align-middle ' +
              (selected ? 'bg-blue-500 text-white ' : ' ')} >
              <div className='my-auto w-5 justify-center flex'>
                <FontAwesomeIcon icon={link.icon} />
              </div>
              <div className={'ml-4 w-32'}>{link.name}</div>
            </a>
          </Link>
        } else {
          return <></>
        }
      })}
    </div>
  </nav>
}
export default MenuButtonGroup
