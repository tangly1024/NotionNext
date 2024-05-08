import Link from 'next/link'
import { useState } from 'react'

/**
 * 支持下拉二级的菜单
 * @param {*} param0
 * @returns
 */
export const MenuItemDrop = ({ link }) => {
  const [show, changeShow] = useState(false)
  const hasSubMenu = link?.subMenus?.length > 0

  return (
    <li
      className='cursor-pointer'
      onMouseOver={() => changeShow(true)}
      onMouseOut={() => changeShow(false)}>
      {!hasSubMenu && (
        <div className='rounded px-2 md:pl-0 md:mr-3 my-4 md:pr-3 text-gray-700 dark:text-gray-200 no-underline md:border-r border-gray-light'>
          <Link href={link?.to} target={link?.target}>
            {link?.icon && <i className={link?.icon} />} {link?.name}
            {hasSubMenu && <i className='px-2 fa fa-angle-down'></i>}
          </Link>
        </div>
      )}

      {hasSubMenu && (
        <div className='rounded px-2 md:pl-0 md:mr-3 my-4 md:pr-3 text-gray-700 dark:text-gray-200 no-underline md:border-r border-gray-light'>
          {link?.icon && <i className={link?.icon} />} {link?.name}
          <i
            className={`px-2 fas fa-chevron-down duration-500 transition-all ${show ? ' rotate-180' : ''}`}></i>
        </div>
      )}

      {/* 子菜单 */}
      {hasSubMenu && (
        <ul
          className={`${show ? 'visible opacity-100  top-12' : 'invisible opacity-0 top-10'} border-gray-100  bg-white  dark:bg-black dark:border-gray-800 transition-all duration-300 z-20 absolute block drop-shadow-lg `}>
          {link.subMenus.map((sLink, index) => {
            return (
              <li
                key={index}
                className='not:last-child:border-b-0 border-b text-gray-700 dark:text-gray-200  hover:bg-gray-50 dark:hover:bg-gray-900 tracking-widest transition-all duration-200  dark:border-gray-800 py-3 pr-6 pl-3'>
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
    </li>
  )
}
