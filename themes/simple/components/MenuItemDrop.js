import Link from 'next/link'
import { useState } from 'react'

export const MenuItemDrop = ({ link }) => {
  const [show, changeShow] = useState(false)
  const hasSubMenu = link?.subMenus?.length > 0

  if (!link || !link.show) {
    return null
  }

  return <div onMouseOver={() => changeShow(true)} onMouseOut={() => changeShow(false)} >

        {!hasSubMenu &&
            <Link
                href={link?.to} target={link?.to?.indexOf('http') === 0 ? '_blank' : '_self'}
                className="font-sans menu-link pl-2 pr-4 text-gray-700 dark:text-gray-200 no-underline tracking-widest pb-1">
                <>{link?.icon && <span className='mr-2'><i className={link.icon} /></span>}{link?.name}
                    {hasSubMenu && <i className='px-2 fa fa-angle-down'></i>}</>
            </Link>}

        {hasSubMenu && <>
            <div className='cursor-pointer font-sans menu-link pl-2 pr-4 text-gray-700 dark:text-gray-200 no-underline tracking-widest pb-1'>
                {link?.icon && <span className='mr-2'><i className={link.icon} /></span>} {link?.name}
                <i className={`px-2 fas fa-chevron-down duration-500 transition-all ${show ? ' rotate-180' : ''}`}></i>
            </div>
        </>}

        {/* 子菜单 */}
        {hasSubMenu && <ul className={`${show ? 'visible opacity-100 top-12' : 'invisible opacity-0 top-10'} border-gray-100  bg-white  dark:bg-black dark:border-gray-800 transition-all duration-300 z-20 absolute block drop-shadow-lg `}>
            {link.subMenus.map(sLink => {
              return <li key={sLink.id} className='not:last-child:border-b-0 border-b text-blue-500 hover:bg-gray-50 dark:hover:bg-gray-900 tracking-widest transition-all duration-200 dark:border-gray-800  py-3 pr-6 pl-2'>
                    <Link href={sLink.to} target={link?.to?.indexOf('http') === 0 ? '_blank' : '_self'}>
                        <span className='text-sm text-nowrap font-extralight'>{sLink?.icon && <i className={sLink?.icon} > &nbsp; </i>}{sLink.title}</span>
                    </Link>
                </li>
            })}
        </ul>}

    </div>
}
