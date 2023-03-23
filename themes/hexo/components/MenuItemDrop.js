import Link from 'next/link'
import { useState } from 'react'

export const MenuItemDrop = ({ link }) => {
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
        {hasSubMenu && <ul className={`${show ? 'visible opacity-100' : 'invisible opacity-0'} border-gray-100  bg-white  dark:bg-black dark:border-gray-800 transition-all duration-300 z-20 top-12 absolute block drop-shadow-lg `}>
            {link.subMenus.map(sLink => {
              return <li key={sLink.id} className='not:last-child:border-b-0 border-b text-blue-500 hover:bg-gray-50 dark:hover:bg-gray-900 tracking-widest transition-all duration-200 dark:border-gray-800  py-3 pr-6 pl-2'>
                    <Link href={sLink.to}>
                        <span className='text-xs font-extralight'>{sLink.title}</span>
                    </Link>
                </li>
            })}
        </ul>}

    </div>
}

// <Link
//   key={`${link.to}`}
//   title={link.to}
//   href={link.to}
//   target={link.to.indexOf('http') === 0 ? '_blank' : '_self'}
//   className={'py-1.5 my-1 px-3  text-base justify-center items-center cursor-pointer'}>

//   <div className='w-full flex text-sm items-center justify-center hover:scale-125 duration-200 transform'>
//     <i className={`${link.icon} mr-1`}/>
//     <div className='text-center'>{link.name}</div>
//   </div>
// </Link>

// return (
//     <Link
//       key={`${link.to}`}
//       title={link.to}
//       href={link.to}
//       className={'py-1.5 px-5 text-base justify-between hover:bg-indigo-400 hover:text-white hover:shadow-lg cursor-pointer font-light flex flex-nowrap items-center ' +
//         (selected ? 'bg-gray-200 text-black' : ' ')}>

//       <div className='my-auto items-center justify-center flex '>
//         <i className={`${link.icon} w-4 text-center`} />
//         <div className={'ml-4'}>{link.name}</div>
//       </div>
//       {link.slot}

//     </Link>
//   )
