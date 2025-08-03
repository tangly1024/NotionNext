import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { useState } from 'react'

export const MenuItemDrop = ({ link }) => {
  const hasSubMenu = link?.subMenus?.length > 0
  const [show, changeShow] = useState(false)
  const router = useRouter()



  if (!link || !link.show) {
    return null
  }
  const selected = router.pathname === link.href || router.asPath === link.href


  return (
    <div className='menu-item'>
      {!hasSubMenu && (
        <SmartLink
          href={link?.href}
          target={link?.target}
          className='dark:hover:text-[var(--primary-color)] dark:hover:bg-white menu-link underline decoration-2 hover:no-underline hover:bg-[#2E405B] hover:text-white text-[var(--primary-color)]  dark:text-gray-200 tracking-widest pb-1 font-bold'>
          {link?.name}
        </SmartLink>
      )
      }


      {hasSubMenu && (
        <>
          <div
            onMouseOver={() => changeShow(true)}
            onMouseOut={() => changeShow(false)}
            className={
              'relative ' +
              (selected
                ? 'bg-green-600 text-white hover:text-white'
                : 'hover:text-green-600')
            }>
            <div>
              <span className='dark:hover:text-[var(--primary-color)] dark:hover:bg-white menu-link underline decoration-2 hover:no-underline hover:bg-[#2E405B] hover:text-white text-[var(--primary-color)]  dark:text-gray-200 tracking-widest pb-1 font-bold'>
                {link?.icon && <i className={link?.icon} />} {link?.name}
              </span>
              {hasSubMenu && (
                <i
                  className={`px-2 fas fa-chevron-right duration-500 transition-all ${show ? ' rotate-180' : ''}`}></i>
              )}
            </div>

            {/* 子菜單 */}
            <ul
              className={`${show ? 'visible opacity-100' : 'invisible opacity-0'} absolute glassmorphism md:left-28 md:top-0 top-6 w-full border-gray-100 transition-all duration-300 z-20 block`}>
              {link?.subMenus?.map((sLink, index) => {
                return (
                  <li
                    key={index}
                    className='dark:hover:bg-gray-900 tracking-widest transition-all duration-200 dark:border-gray-800 pb-3'>
                    <SmartLink href={sLink.href} target={link?.target}>
                      <span className='dark:hover:text-[var(--primary-color)] dark:hover:bg-white menu-link underline decoration-2 hover:no-underline hover:bg-[#2E405B] hover:text-white text-[var(--primary-color)]  dark:text-gray-200 tracking-widest pb-1 font-bold'>
                        {link?.icon && <i className={sLink?.icon}> &nbsp; </i>}
                        {sLink.title}
                      </span>
                    </SmartLink>
                  </li>
                )
              })}
            </ul>
          </div>

        </>
      )}

    </div>

  )
}
