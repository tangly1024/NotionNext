import Link from 'next/link'
import { useState } from 'react'

export const DropMenu = ({ link }) => {
  const [show, changeShow] = useState(false)
  const hasSubMenu = link?.subMenus?.length > 0

  return <div className='my-4 mr-4'
            onMouseOver={() => changeShow(true)}
            onMouseOut={() => changeShow(false)}
            >
        <Link
            href={link?.to}

            className="menu-link pl-2 pr-4 text-gray-700 dark:text-gray-200 no-underline tracking-widest">
            {link?.name}
            {hasSubMenu && <i className='px-2 fa fa-angle-down'></i>}
        </Link>

        {hasSubMenu && <ul className={`${show ? 'visible opacity-100' : 'invisible opacity-0'} transition-all duration-300 z-20 top-12 absolute block border border-gray-100 bg-white drop-shadow-lg `}>
            {link.subMenus.map(sLink => {
              return <li key={sLink.id} className=' text-blue-400 hover:bg-gray-50 tracking-widest transition-all duration-200 border-b py-3 pr-6 pl-2'>
                <Link href={sLink.to}>
                <span className='text-xs'>{sLink.title}</span>
                </Link>
            </li>
            })}
        </ul>}
    </div>
}
