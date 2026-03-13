import Link from 'next/link'
import { useState } from 'react'

export const MenuItemDrop = ({ link }) => {
  const [show, changeShow] = useState(false)
  const hasSubMenu = link?.subMenus?.length > 0
  const href = link?.href
  const hasHref = typeof href === 'string' && href.length > 0

  if (!link || !link.show) {
    return null
  }

  return (
    <div
      onMouseOver={() => changeShow(true)}
      onMouseOut={() => changeShow(false)}>
      {/* 不含子菜单 */}
      {!hasSubMenu && (
        <>
          {hasHref ? (
            <Link
              target={link?.target}
              href={href}
              className=' hover:bg-black hover:bg-opacity-10 rounded-2xl flex justify-center items-center px-3 py-1 no-underline tracking-widest'>
              {link?.icon && <i className={link?.icon} />} {link?.name}
            </Link>
          ) : (
            <span className='rounded-2xl flex justify-center items-center px-3 py-1 tracking-widest opacity-70 cursor-default'>
              {link?.icon && <i className={link?.icon} />} {link?.name}
            </span>
          )}
        </>
      )}
      {/* 含子菜单的按钮 */}
      {hasSubMenu && (
        <>
          <div className='cursor-pointer  hover:bg-black hover:bg-opacity-10 rounded-2xl flex justify-center items-center px-3 py-1 no-underline tracking-widest'>
            {link?.icon && <i className={link?.icon} />} {link?.name}
          </div>
        </>
      )}
      {/* 子菜单 */}
      {hasSubMenu && (
        <ul
          style={{ backdropFilter: 'blur(3px)' }}
          className={`${show ? 'visible opacity-100 top-14' : 'invisible opacity-0 top-20'} drop-shadow-md overflow-hidden rounded-xl bg-white dark:bg-[#1e1e1e] transition-all duration-300 z-20 absolute`}>
          {link.subMenus.map((sLink, index) => {
            const subHref = sLink?.href
            const hasSubHref =
              typeof subHref === 'string' && subHref.length > 0
            return (
              <li
                key={index}
                className='cursor-pointer hover:bg-blue-600 dark:hover:bg-yellow-600 hover:text-white text-gray-900 dark:text-gray-100  tracking-widest transition-all duration-200 py-1 pr-6 pl-3'>
                {hasSubHref ? (
                  <Link href={subHref} target={link?.target}>
                    <span className='text-sm text-nowrap font-normal'>
                      {link?.icon && <i className={sLink?.icon}> &nbsp; </i>}
                      {sLink.title}
                    </span>
                  </Link>
                ) : (
                  <span className='text-sm text-nowrap font-normal opacity-70 cursor-default'>
                    {link?.icon && <i className={sLink?.icon}> &nbsp; </i>}
                    {sLink.title}
                  </span>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
