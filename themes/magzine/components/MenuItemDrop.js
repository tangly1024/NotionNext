import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

export const MenuItemDrop = ({ link }) => {
  const [show, changeShow] = useState(false)
  //   const show = true
  //   const changeShow = () => {}
  const router = useRouter()

  if (!link || !link.show) {
    return null
  }
  const hasSubMenu = link?.subMenus?.length > 0
  const selected = router.pathname === link.href || router.asPath === link.href

  return (
    <li
      className='cursor-pointer list-none items-center h-full'
      onMouseOver={() => changeShow(true)}
      onMouseOut={() => changeShow(false)}>
      {hasSubMenu && (
        <div
          className={
            'px-2 h-full whitespace-nowrap duration-300 justify-between dark:text-gray-300 cursor-pointer flex flex-nowrap items-center ' +
            (selected
              ? 'bg-gray-600 text-white hover:text-white'
              : 'hover:text-gray-600')
          }>
          <div className='items-center flex'>
            {link?.icon && <i className={`${link?.icon} pr-2`} />} {link?.name}
            <i
              className={`px-1 fas fa-chevron-down duration-500 transition-all ${show ? ' rotate-180' : ''}`}></i>
          </div>
        </div>
      )}

      {!hasSubMenu && (
        <div
          className={
            'px-3 gap-x-1 h-full whitespace-nowrap duration-300 text-md justify-between dark:text-gray-300 cursor-pointer flex flex-nowrap items-center ' +
            (selected
              ? 'bg-gray-600 text-white hover:text-white'
              : 'hover:text-gray-600')
          }>
          <Link href={link?.href} target={link?.target}>
            {link?.icon && <i className={link?.icon} />} {link?.name}
          </Link>
        </div>
      )}

      {/* 子菜单 */}
      {hasSubMenu && (
        <ul
          className={`${show ? 'visible opacity-100 top-14' : 'invisible opacity-0 top-20'} p-1 absolute border bg-white dark:bg-black dark:border-gray-800 transition-all duration-150 z-20 block rounded-lg drop-shadow-lg`}>
          {link?.subMenus?.map(sLink => {
            return (
              <li
                key={sLink.id}
                className='py-3 pr-6 hover:bg-gray-100 dark:hover:bg-gray-900 dark:text-gray-200 tracking-widest transition-color duration-200 dark:border-gray-800 '>
                <Link href={sLink.href} target={link?.target}>
                  <span className='text-sm ml-2'>
                    {link?.icon && <i className={`${sLink?.icon} pr-2`}> </i>}
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
