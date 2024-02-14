import Link from 'next/link'
import { useState } from 'react'
import Collapse from './Collapse'

/**
 * 菜单
 * @param {} param0
 * @returns
 */
export const MenuItem = ({ link }) => {
  link.selected = true

  const [isOpen, changeIsOpen] = useState(link?.selected)

  const toggleOpenSubMenu = () => {
    changeIsOpen(!isOpen)
  }

  if (!link || !link.show) {
    return null
  }

  // #号加标题  快速跳转到指定锚点
  const isAnchor = link?.to === '#'
  const url = isAnchor ? `#${link.name}` : link.to

  return <>
        {/* 菜单 */}
        <div
            onClick={toggleOpenSubMenu}
            className='nav-menu dark:text-neutral-400 text-gray-500 hover:text-black dark:hover:text-white text-sm text-gray w-full items-center duration-300 pt-2 font-light select-none flex justify-between cursor-pointer' key={link?.to}>

            {link?.subMenus
              ? (<>
                    <span className='dark:text-neutral-400 dark:hover:text-white font-bold w-full display-block'>
                        <i className={`text-base ${link?.icon ? link?.icon : ''} mr-1`} />{link?.title}
                    </span>
                    <div className='inline-flex items-center select-none pointer-events-none '>
                        <i className={`${isOpen ? '-rotate-90' : ''} text-xs dark:text-neutral-500 text-gray-300 hover:text-black dark:hover:text-white-400 px-2 fas fa-chevron-left transition-all duration-200`}></i>
                    </div>
                </>)
              : (
                    <Link href={url} className='dark:text-neutral-400 dark:hover:text-white font-bold w-full display-block'>
                         <i className={`text-base ${link?.icon ? link?.icon : (isAnchor ? 'fas fa-hashtag' : '')} mr-1`} />{link?.title}
                    </Link>
                )

            }
        </div>

        {/* 子菜单按钮 */}
        {link?.subMenus && (
            <Collapse isOpen={isOpen} key='collapse'>
                {
                    link?.subMenus?.map((sLink, index) => {
                      // #号加标题  快速跳转到指定锚点
                      const sIsAnchor = sLink?.to === '#'
                      const sUrl = sIsAnchor ? `#${sLink.name}` : sLink.to
                      return <div key={index} className='nav-submenu'>
                        <Link href={sUrl}>
                            <span className='dark:text-neutral-400 text-gray-500 hover:text-black dark:hover:text-white text-xs font-bold'>
                                <i className={`text-xs mr-1 ${sLink?.icon ? sLink?.icon : (sIsAnchor ? 'fas fa-hashtag' : '')}`} />{sLink.title}</span>
                        </Link>
                    </div>
                    })
                }

            </Collapse>
        )}

    </>
}
