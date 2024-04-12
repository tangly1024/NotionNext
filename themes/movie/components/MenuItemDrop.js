import Link from 'next/link'
import { useState } from 'react'

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
          className='select-none menu-link pl-2 pr-4 no-underline tracking-widest pb-1'>
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
          className={`${show ? 'visible opacity-100 top-14' : 'invisible opacity-0 top-20'} drop-shadow-md overflow-hidden rounded-md text-black dark:text-white bg-white dark:bg-black transition-all duration-300 z-30 absolute block  `}>
          {link.subMenus.map((sLink, index) => {
            return (
              <li
                key={index}
                className='cursor-pointer text-start dark:bg-hexo-black-gray dark:hover:bg-gray-300 hover:bg-gray-300 hover:text-black tracking-widest transition-all duration-200 dark:border-gray-800  py-1 pr-6 pl-3'>
                <Link href={sLink.to} target={link?.target}>
                  <span className='text-sm'>
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
