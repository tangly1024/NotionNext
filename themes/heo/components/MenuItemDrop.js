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
          className={`hover:bg-blue-500 hover:text-white rounded-full flex justify-center items-center w-[70px] h-[35px] mx-5 no-underline tracking-widest transition-colors duration-200 font-bold ${show ? 'bg-blue-500 text-white' : ''
            }`}>
          {link?.icon && <i className={link?.icon} />} {link?.name}
        </Link>
      )}
      {/* 含子菜单的按钮 */}
      {hasSubMenu && (
        <div className={`cursor-pointer hover:bg-blue-500 hover:text-white rounded-full flex justify-center items-center w-[70px] h-[35px] mx-5 no-underline tracking-widest transition-colors duration-200 font-bold ${show ? 'bg-blue-500 text-white' : ''
          }`}>
          {link?.icon && <i className={link?.icon} />} {link?.name}
        </div>
      )}
      {/* 子菜单 */}
      {hasSubMenu && (
        <ul
          style={{ backdropFilter: 'blur(3px)' }}
          className={`${show ? 'visible opacity-100 top-10' : 'invisible opacity-0 top-14'
            } flex flex-row absolute left-1/2 transform -translate-x-1/2 drop-shadow-md overflow-hidden rounded-full bg-white dark:bg-[#1e1e1e] transition-all duration-300 z-20 whitespace-nowrap border border-gray-100`}>
          {link.subMenus.map((sLink, index) => (
            <li
              key={index}
              className='cursor-pointer hover:bg-blue-500 hover:text-white text-gray-900 dark:text-gray-100 tracking-widest transition-all duration-200 py-1 px-4'>
              <Link href={sLink.href} target={link?.target}>
                <span className='text-sm text-nowrap font-extralight'>
                  {link?.icon && <i className={sLink?.icon}> &nbsp; </i>}
                  {sLink.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
