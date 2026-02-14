import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { useState } from 'react'

/**
 * 下拉菜单
 * @param {*} param0
 * @returns
 */
export const MenuItemDrop = ({ link }) => {
  const [show, changeShow] = useState(false)
  const hasSubMenu = link?.subMenus?.length > 0
  const selected = useRouter().asPath === link?.href

  if (!link || !link.show) {
    return null
  }

  return (
    <div
      onMouseOver={() => changeShow(true)}
      onMouseOut={() => changeShow(false)}
      className='h-full'>
      {!hasSubMenu && (
        <SmartLink
          href={link?.href}
          target={link?.target}
          className={`${selected && 'border-b-2 border-[#D2232A]'} h-full flex space-x-1 whitespace-nowrap items-center font-sans menu-link pl-2 pr-4  dark:text-gray-200 no-underline tracking-widest pb-1`}>
          {link?.icon && <i className={link?.icon} />} <div>{link?.name}</div>
          {/* {hasSubMenu && <i className='px-2 fa fa-angle-down'></i>} */}
        </SmartLink>
      )}

      {hasSubMenu && (
        <>
          <div className='h-full flex space-x-1 whitespace-nowrap items-center cursor-pointer font-sans menu-link pl-2 pr-4  dark:text-gray-200 no-underline tracking-widest pb-1'>
            {link?.icon && <i className={link?.icon} />} <div>{link?.name}</div>
            {/* <i className={`px-2 fa fa-angle-down duration-300  ${show ? 'rotate-180' : 'rotate-0'}`}></i> */}
          </div>
        </>
      )}

      {/* 子菜单 */}
      {hasSubMenu && (
        <ul
          style={{ backdropFilter: 'blur(3px)' }}
          className={`${show ? 'visible opacity-100 shadow-lg' : 'invisible opacity-0'} overflow-hidden bg-white transition-all duration-300 z-20 absolute block  `}>
          {link.subMenus.map((sLink, index) => {
            return (
              <li
                key={index}
                className='cursor-pointer hover:bg-red-300 text-gray-900 hover:text-black tracking-widest transition-all duration-200 dark:border-gray-800  py-1 pr-6 pl-3'>
                <SmartLink href={sLink.href} target={link?.target}>
                  <span className='text-sm text-nowrap font-extralight'>
                    {link?.icon && <i className={sLink?.icon}> &nbsp; </i>}
                    {sLink.title}
                  </span>
                </SmartLink>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
