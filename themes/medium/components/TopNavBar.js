import Link from 'next/link'
import { useRouter } from 'next/router'
import LogoBar from './LogoBar'
import React from 'react'
import Collapse from '@/components/Collapse'
import GroupMenu from './GroupMenu'
import { useGlobal } from '@/lib/global'
import CONFIG_MEDIUM from '../config_medium'

/**
 * 顶部导航栏 + 菜单
 * @param {} param0
 * @returns
 */
export default function TopNavBar(props) {
  const { className, customNav } = props
  const router = useRouter()
  const [isOpen, changeShow] = React.useState(false)

  const { locale } = useGlobal()

  const defaultLinks = [
    { icon: 'fas fa-th', name: locale.COMMON.CATEGORY, to: '/category', show: CONFIG_MEDIUM.MENU_CATEGORY },
    { icon: 'fas fa-tag', name: locale.COMMON.TAGS, to: '/tag', show: CONFIG_MEDIUM.MENU_TAG },
    { icon: 'fas fa-archive', name: locale.NAV.ARCHIVE, to: '/archive', show: CONFIG_MEDIUM.MENU_ARCHIVE },
    { icon: 'fas fa-search', name: locale.NAV.SEARCH, to: '/search', show: CONFIG_MEDIUM.MENU_SEARCH }
  ]

  const navs = defaultLinks.concat(customNav)

  const toggleMenuOpen = () => {
    changeShow(!isOpen)
  }

  return <div id='top-nav' className={'sticky top-0 lg:relative w-full z-40 ' + className}>
        {/* 折叠菜单 */}
        <Collapse type='vertical' isOpen={isOpen} className='md:hidden'>
            <div className='bg-white dark:bg-hexo-black-gray pt-1 py-2 px-5 lg:hidden '>
                <GroupMenu {...props} />
            </div>
        </Collapse>

        <div className='flex w-full h-12 shadow bg-white dark:bg-hexo-black-gray px-5 items-between'>

            {/* 图标Logo */}
            <LogoBar {...props} />

            {/* 右侧功能 */}
            <div className='mr-1 flex md:hidden justify-end items-center text-sm space-x-4 font-serif dark:text-gray-200'>
                <div onClick={toggleMenuOpen} className='cursor-pointer'>
                    {isOpen ? <i className='fas fa-times' /> : <i className='fas fa-bars' />}
                </div>
            </div>

            {/* 顶部菜单 */}
            <div className='hidden md:flex'>
                {navs && navs.map(link => {
                  if (link.show) {
                    const selected = (router.pathname === link.to) || (router.asPath === link.to)
                    return <Link key={`${link.id}-${link.to}`} title={link.to} href={link.to} >
                            <a target={link.to.indexOf('http') === 0 ? '_blank' : '_self'} className={'px-2 duration-300 text-sm justify-between dark:text-gray-300 hover:underline cursor-pointer flex flex-nowrap items-center ' +
                                (selected ? 'bg-green-600 text-white hover:text-white' : 'hover:text-green-600')} >
                                <div className='items-center justify-center flex '>
                                    <i className={link.icon} />
                                    <div className='ml-2 whitespace-nowrap'>{link.name}</div>
                                </div>
                                {link.slot}
                            </a>
                        </Link>
                  } else {
                    return null
                  }
                })}
            </div>
        </div>
    </div>
}
