import { useRef, useState } from 'react'
import Link from 'next/link'
import BLOG from '@/blog.config'
import { useGlobal } from '@/lib/global'
import CONFIG from '../config'
import { SvgIcon } from './SvgIcon'
import { MenuItemDrop } from './MenuItemDrop'
import Collapse from '@/components/Collapse'
import { MenuItemCollapse } from './MenuItemCollapse'
import LazyImage from '@/components/LazyImage'

const Header = props => {
  const { fullWidth, siteInfo } = props

  const title = siteInfo?.title

  return <div className='md:hidden fixed top-0 w-full z-20'>
        <div id="sticky-nav"
            className={`sticky-nav m-auto w-full h-6 flex flex-row justify-between items-center mb-2 md:mb-12 py-8  glassmorphism ${!fullWidth ? 'max-w-3xl px-4' : 'px-4 md:px-24'
                }`} >
                <Link href="/" aria-label={BLOG.title} className="flex items-center">
                    <>
                        <div className="h-6 w-6">
                            {/* <SvgIcon/> */}
                            {CONFIG.NAV_NOTION_ICON
                              ? <LazyImage src={siteInfo?.icon} width={24} height={24} alt={BLOG.AUTHOR} />
                              : <SvgIcon />}

                        </div>
                        <p className="ml-2 font-medium text-gray-800 dark:text-gray-300 header-name">
                            {title}  {/* ,{' '}<span className="font-normal">{siteInfo?.description}</span> */}
                        </p>
                    </>
                </Link>

            <NavBar {...props} />
        </div>
    </div>
}

const NavBar = props => {
  const { customMenu, customNav } = props
  const [isOpen, changeOpen] = useState(false)
  const toggleOpen = () => {
    changeOpen(!isOpen)
  }
  const collapseRef = useRef(null)

  const { locale } = useGlobal()
  let links = [
    { id: 2, name: locale.NAV.RSS, to: '/feed', show: BLOG.ENABLE_RSS && CONFIG.MENU_RSS, target: '_blank' },
    { icon: 'fas fa-search', name: locale.NAV.SEARCH, to: '/search', show: CONFIG.MENU_SEARCH },
    { icon: 'fas fa-archive', name: locale.NAV.ARCHIVE, to: '/archive', show: CONFIG.MENU_ARCHIVE },
    { icon: 'fas fa-folder', name: locale.COMMON.CATEGORY, to: '/category', show: CONFIG.MENU_CATEGORY },
    { icon: 'fas fa-tag', name: locale.COMMON.TAGS, to: '/tag', show: CONFIG.MENU_TAG }
  ]
  if (customNav) {
    links = links.concat(customNav)
  }

  // 如果 开启自定义菜单，则覆盖Page生成的菜单
  if (BLOG.CUSTOM_MENU) {
    links = customMenu
  }

  if (!links || links.length === 0) {
    return null
  }

  return (
        <div className="flex-shrink-0">
            <ul className=" hidden md:flex flex-row">
                {links?.map(link => <MenuItemDrop key={link?.id} link={link} />)}
            </ul>
            <div className='md:hidden'><i onClick={toggleOpen} className='fas fa-bars cursor-pointer px-5 block md:hidden'></i>
                <Collapse collapseRef={collapseRef} isOpen={isOpen} type='vertical' className='fixed top-16 right-6'>
                    <div className='dark:border-black bg-white dark:bg-black rounded border p-2 text-sm'>
                        {links?.map(link => <MenuItemCollapse key={link?.id} link={link} onHeightChange={(param) => collapseRef.current?.updateCollapseHeight(param)} />)}
                    </div>
                </Collapse>
            </div>
        </div>
  )
}

export default Header
