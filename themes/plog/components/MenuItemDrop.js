import Link from 'next/link'
import { useState } from 'react'

export const MenuItemDrop = ({ link }) => {
  const [show, changeShow] = useState(false)
  if (!link || !link.show) {
    return null
  }

  const hasSubMenu = link?.subMenus?.length > 0

  return <li className='cursor-pointer py-2 px-3' onMouseEnter={() => changeShow(true)} onMouseLeave={() => changeShow(false)}>
            {!hasSubMenu &&
                <div className="block text-black dark:text-gray-50 nav" >
                    <Link href={link?.to} target={link?.to?.indexOf('http') === 0 ? '_blank' : '_self'} >
                        {link?.icon && <i className={link?.icon} />} {link?.name}
                    </Link>
                </div>
            }

            {hasSubMenu &&
                <div className='block text-black dark:text-gray-50 nav'>
                    {link?.icon && <i className={link?.icon} />} {link?.name}
                    <i className={`px-2 fas fa-chevron-down duration-500 transition-all ${show ? ' rotate-180' : ''}`}></i>
                </div>
            }

            {/* 子菜单 */}
            {hasSubMenu && <ul className={`${show ? 'visible opacity-100 bottom-16 ' : 'invisible opacity-0 bottom-14'} border-gray-100  bg-white rounded-lg overflow-hidden  dark:bg-black dark:border-gray-800 bg-opacity-60 transition-all duration-300 z-20 absolute block drop-shadow-lg `}>
                {link.subMenus.map((sLink, index) => {
                  return <li key={index} className='text-gray-700 dark:text-gray-200  hover:bg-gray-50 dark:hover:bg-gray-900 tracking-widest transition-all duration-200  dark:border-gray-800 py-3 pr-6 pl-3'>
                        <Link href={sLink.to} target={link?.to?.indexOf('http') === 0 ? '_blank' : '_self'}>
                            <span className='text-sm text-nowrap font-extralight'>{link?.icon && <i className={sLink?.icon} > &nbsp; </i>}{sLink.title}</span>
                        </Link>
                    </li>
                })}
            </ul>}

            </li>
}
