import Link from 'next/link'
import { useState } from 'react'

export const MenuItemDrop = ({ link }) => {
  const hasSubMenu = link?.subMenus?.length > 0

  if (!link || !link.show) {
    return null
  }

  return (
    <div className='menu-item'>
      <Link
        href={link?.href}
        target={link?.target}
        className=' menu-link underline decoration-2 hover:no-underline hover:bg-[#2E405B] hover:text-white text-[var(--primary-color)]  dark:text-gray-200 tracking-widest pb-1 font-bold'>
        {link?.name}
      </Link>
    </div>
  )
}
