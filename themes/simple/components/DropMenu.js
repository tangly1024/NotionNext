import Link from 'next/link'
import { useState } from 'react'

export const DropMenu = ({ link }) => {
  const [show, changeShow] = useState(false)
  const hasSubMenu = link?.subMenus?.length > 0

  return <div onMouseOver={() => changeShow(true)} onMouseOut={() => changeShow(false)} >

        {!hasSubMenu &&
            <Link
                href={link?.to}
                className="font-sans menu-link pl-2 pr-4 text-gray-700 dark:text-gray-200 no-underline tracking-widest pb-1">
                {link?.name}
                {hasSubMenu && <i className='px-2 fa fa-angle-down'></i>}
            </Link>}

        {hasSubMenu && <>
            <div className='cursor-pointer font-sans menu-link pl-2 pr-4 text-gray-700 dark:text-gray-200 no-underline tracking-widest pb-1'>
                {link?.name}
                <i className='px-2 fa fa-angle-down'></i>
            </div>
        </>}

        {/* 子菜单 */}
        {hasSubMenu && <ul className={`${show ? 'visible opacity-100' : 'invisible opacity-0'} border-gray-100  bg-white  dark:bg-black dark:border-gray-800 transition-all duration-300 z-20 top-12 absolute block border drop-shadow-lg `}>
            {link.subMenus.map(sLink => {
              return <li key={sLink.id} className=' text-blue-500 hover:bg-gray-50 dark:hover:bg-gray-900 tracking-widest transition-all duration-200 border-b dark:border-gray-800  py-3 pr-6 pl-2'>
                    <Link href={sLink.to}>
                        <span className='text-xs font-extralight'>{sLink.title}</span>
                    </Link>
                </li>
            })}
        </ul>}

    </div>
}
