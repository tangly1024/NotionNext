import Link from 'next/link'
import { useState } from 'react'

export const MenuItemDrop = ({ link }) => {
  const [show, changeShow] = useState(false)
  if (!link || !link.show) {
    return null
  }

  const hasSubMenu = link?.subMenus?.length > 0

  return (
    <li>
      <div
        className='cursor-pointer relative'
        onMouseOver={() => changeShow(true)}
        onMouseOut={() => changeShow(false)}>
        {!hasSubMenu && (
          <div className='dark:text-gray-50 nav hover:scale-105 transition-transform duration-200'>
            <Link
              href={link?.to}
              className='flex flex-nowrap'
              target={link?.to?.indexOf('http') === 0 ? '_blank' : '_self'}>
              <div className='w-6 mr-2 text-center'>
                {link?.icon && <i className={link?.icon} />}
              </div>
              {link?.name}
            </Link>
          </div>
        )}

        {hasSubMenu && (
          <div className='dark:text-gray-50 nav'>
            {link?.icon && <i className={`${link?.icon} w-6 text-center`} />}{' '}
            {link?.name}
            <i
              className={`absolute right-0 top-0 px-2 h-full flex items-center fas fa-chevron-left duration-500 transition-all ${show ? ' rotate-180' : ''} `}></i>
          </div>
        )}

        {/* 子菜单 */}
        {hasSubMenu && (
          <ul
            className={`${show ? 'visible opacity-100 -left-5 ml-40' : 'invisible opacity-0 -left-4 '} rounded shadow-md z-30 -mt-2 py-2 px-4 absolute top-0 hover:scale-105 transition-all duration-200 border-gray-100  bg-white  dark:bg-black`}>
            {link.subMenus.map((sLink, index) => {
              return (
                <div
                  key={index}
                  className='text-gray-700 dark:text-gray-200  tracking-widest transition-all duration-200 '>
                  <Link
                    href={sLink.to}
                    target={
                      link?.to?.indexOf('http') === 0 ? '_blank' : '_self'
                    }>
                    <span className='text-sm text-nowrap font-extralight'>
                      {link?.icon && <i className={sLink?.icon}> &nbsp; </i>}
                      {sLink.title}
                    </span>
                  </Link>
                </div>
              )
            })}
          </ul>
        )}
      </div>
    </li>
  )
}
