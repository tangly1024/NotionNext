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
      onMouseOut={() => changeShow(false)}
      className="relative">
      {/* 不含子菜单 */}
      {!hasSubMenu && (
        <Link
          target={link?.target}
          href={link?.href}
          className={`inline-flex items-center px-4 py-1.5 mx-2 hover:bg-blue-500 hover:text-white rounded-full transition-all duration-200 font-bold ${show ? 'bg-blue-500 text-white' : ''
            }`}>
          {link?.icon && <i className={`${link?.icon} mr-2`} />}
          <span className="whitespace-nowrap">{link?.name}</span>
        </Link>
      )}
      {/* 含子菜单的按钮 */}
      {hasSubMenu && (
        <div className={`inline-flex items-center px-4 py-1.5 mx-2 cursor-pointer hover:bg-blue-500 hover:text-white rounded-full transition-all duration-200 font-bold ${show ? 'bg-blue-500 text-white' : ''
          }`}>
          {link?.icon && <i className={`${link?.icon} mr-2`} />}
          <span className="whitespace-nowrap">{link?.name}</span>
        </div>
      )}
      {/* 子菜单 */}
      {hasSubMenu && (
        <ul
          style={{ backdropFilter: 'blur(3px)' }}
          className={`${show ? 'visible opacity-100 top-10' : 'invisible opacity-0 top-14'
            } absolute left-1/2 transform -translate-x-1/2 flex flex-row bg-white dark:bg-[#1e1e1e] drop-shadow-lg rounded-full transition-all duration-300 z-20 border-2 border-blue-500 dark:border-blue-600 min-w-[250px]`}>
          {link.subMenus.map((sLink, index) => (
            <li
              key={index}
              className='flex-1 text-gray-900 dark:text-gray-100 transition-all duration-200 flex items-center justify-center'>
              <Link
                href={sLink.href}
                target={link?.target}
                className="px-4 py-1.5 mx-4 my-1.5 inline-flex items-center justify-center rounded-full hover:bg-blue-500 hover:text-white transition-all duration-200">
                {link?.icon && <i className={`${sLink?.icon} mr-2`} />}
                <span className="whitespace-nowrap font-bold">{sLink.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
