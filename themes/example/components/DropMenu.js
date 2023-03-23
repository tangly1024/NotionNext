import Link from 'next/link'
import { useState } from 'react'

export const DropMenu = ({ link }) => {
  const [show, changeShow] = useState(false)
  const hasSubMenu = link?.subMenus?.length > 0

  return <li className='cursor-pointer' onMouseOver={() => changeShow(true)} onMouseOut={() => changeShow(false)} >

        {!hasSubMenu &&
            <div className="rounded px-2 md:pl-0 md:mr-3 my-4 md:pr-3 text-gray-700 dark:text-gray-200 no-underline md:border-r border-gray-light">
                <Link href={link?.to} >
                    {link?.name}
                    {hasSubMenu && <i className='px-2 fa fa-angle-down'></i>}
                </Link>
            </div>
        }

        {hasSubMenu &&
            <div className='rounded px-2 md:pl-0 md:mr-3 my-4 md:pr-3 text-gray-700 dark:text-gray-200 no-underline md:border-r border-gray-light'>
                {link?.name}
                <i className='px-2 fa fa-angle-down'></i>
            </div>
        }

        {/* 子菜单 */}
        {hasSubMenu && <ul className={`${show ? 'visible opacity-100  top-12' : 'invisible opacity-0 top-0'} border-gray-100  bg-white  dark:bg-black dark:border-gray-800 transition-all duration-300 z-20 absolute block drop-shadow-lg `}>
            {link.subMenus.map(sLink => {
              return <li key={sLink.id} className='not:last-child:border-b-0 border-b text-gray-700 dark:text-gray-200  hover:bg-gray-50 dark:hover:bg-gray-900 tracking-widest transition-all duration-200  dark:border-gray-800 py-3 pr-6 pl-2'>
                    <Link href={sLink.to}>
                        <span className='text-xs font-extralight'>{sLink.title}</span>
                    </Link>
                </li>
            })}
        </ul>}

    </li>
}
