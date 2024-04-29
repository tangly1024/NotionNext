import Link from 'next/link'
import { useState } from 'react'
/**
 * 菜单
 * 支持二级展开的菜单
 */
export const MenuItemDrop = ({ link }) => {
  const [show, changeShow] = useState(false)
  const hasSubMenu = link?.subMenus?.length > 0

  if (!link || !link.show) {
    return null
  }

  return (
    <div
      onMouseOver={() => changeShow(true)}
      onMouseOut={() => changeShow(false)}>
      {!hasSubMenu && (
        <Link
          href={link?.to}
          target={link?.target}
          className=' menu-link pl-2 pr-4  no-underline tracking-widest pb-1'>
          {link?.icon && <i className={link?.icon} />} {link?.name}
          {hasSubMenu && <i className='px-2 fa fa-angle-down'></i>}
        </Link>
      )}

      {hasSubMenu && (
        <>
          <div className='cursor-pointer  menu-link pl-2 pr-4  no-underline tracking-widest pb-1'>
            {link?.icon && <i className={link?.icon} />} {link?.name}
            <i
              className={`px-2 fa fa-angle-down duration-300  ${show ? 'rotate-180' : 'rotate-0'}`}></i>
          </div>
        </>
      )}

      {/* 子菜单 */}
      {hasSubMenu && (
        <ul
          style={{ backdropFilter: 'blur(3px)' }}
          className={`${show ? 'visible opacity-100 top-12' : 'invisible opacity-0 top-20'} drop-shadow-md overflow-hidden rounded-md bg-white transition-all duration-300 z-20 absolute block  `}>
          {link.subMenus.map((sLink, index) => {
            return (
              <li
                key={index}
                className='cursor-pointer hover:bg-indigo-500 text-gray-900 hover:text-white tracking-widest transition-all duration-200 dark:border-gray-800  py-1 pr-6 pl-3'>
                <Link href={sLink.to} target={link?.target}>
                  <span className='text-sm text-nowrap font-extralight'>
                    {link?.icon && <i className={sLink?.icon}> &nbsp; </i>}
                    {sLink.title}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
