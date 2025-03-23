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
      className="h-full flex items-center relative"
      onMouseOver={() => changeShow(true)}
      onMouseOut={() => changeShow(false)}>
      {!hasSubMenu && (
        <Link
          href={link?.href}
          target={link?.target}
          className='h-full flex items-center px-3 text-sm text-gray-700 dark:text-gray-200 no-underline tracking-wide hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-200'>
          {link?.icon && (
            <span className='mr-1'>
              <i className={link.icon} />
            </span>
          )}
          {link?.name}
        </Link>
      )}

      {hasSubMenu && (
        <>
          <div className='h-full flex items-center cursor-pointer px-3 text-sm text-gray-700 dark:text-gray-200 no-underline tracking-wide hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-200'>
            {link?.icon && (
              <span className='mr-1'>
                <i className={link.icon} />
              </span>
            )}
            {link?.name}
            <i
              className={`ml-1 fas fa-chevron-down text-xs duration-300 transition-all ${show ? 'rotate-180' : ''}`}></i>
          </div>
        </>
      )}

      {/* 子菜单 */}
      {hasSubMenu && (
        <ul
          className={`${show ? 'visible opacity-100 top-10' : 'invisible opacity-0 top-8'} border border-gray-100 bg-white dark:bg-black dark:border-gray-800 transition-all duration-300 absolute left-0 block drop-shadow-lg`}>
          {link.subMenus.map((sLink, index) => {
            return (
              <li
                key={index}
                className='not:last-child:border-b-0 border-b text-blue-600 dark:text-blue-300 hover:bg-gray-50 dark:hover:bg-gray-900 tracking-wide transition-all duration-200 dark:border-gray-800 whitespace-nowrap text-sm'>
                <Link 
                  href={sLink.href} 
                  target={link?.target}
                  className='py-2 px-4 block'
                >
                  {sLink?.icon && <i className={sLink?.icon}> &nbsp; </i>}
                  {sLink.title}
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
