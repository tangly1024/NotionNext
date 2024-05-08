import Collapse from '@/components/Collapse'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

/**
 * 折叠菜单
 * @param {*} param0
 * @returns
 */
export const MenuItemCollapse = ({ link }) => {
  const [show, changeShow] = useState(false)
  const hasSubMenu = link?.subMenus?.length > 0
  const router = useRouter()

  const [isOpen, changeIsOpen] = useState(false)

  const toggleShow = () => {
    changeShow(!show)
  }

  const toggleOpenSubMenu = () => {
    changeIsOpen(!isOpen)
  }

  if (!link || !link.show) {
    return null
  }

  const selected = router.pathname === link.to || router.asPath === link.to

  return (
    <>
      <div
        onClick={toggleShow}
        className={
          'py-2 px-5 duration-300 text-base justify-between hover:bg-indigo-700 hover:text-white hover:shadow-lg cursor-pointer font-light flex flex-nowrap items-center ' +
          (selected
            ? 'bg-indigo-500 text-white '
            : ' text-black dark:text-white ')
        }>
        {!hasSubMenu && (
          <Link href={link?.to} target={link?.target}>
            <div className='my-auto items-center justify-between flex '>
              {link.icon && (
                <i className={`${link.icon} w-4 mr-6 text-center`} />
              )}
              <div>{link.name}</div>
            </div>
            {link.slot}
          </Link>
        )}

        {hasSubMenu && (
          <div
            onClick={hasSubMenu ? toggleOpenSubMenu : null}
            className='my-auto items-center w-full justify-between flex '>
            <div className=''>
              <i className={`${link.icon} w-4 mr-6 text-center`} />
              {link?.name}
            </div>
            <i
              className={`px-2 fas fa-chevron-left transition-all duration-200 ${isOpen ? '-rotate-90' : ''}`}></i>
          </div>
        )}
      </div>

      {/* 折叠子菜单 */}
      {hasSubMenu && (
        <Collapse isOpen={isOpen}>
          {link.subMenus.map((sLink, index) => {
            return (
              <div
                key={index}
                className='cursor-pointer whitespace-nowrap dark:text-gray-200  w-full font-extralight dark:bg-black text-left px-5 justify-start bg-gray-100  hover:bg-indigo-500 dark:hover:bg-indigo-500 hover:text-white tracking-widest transition-all duration-200 border-b dark:border-gray-800 py-3 pr-6'>
                <Link href={sLink.to} target={link?.target}>
                  <span className='text-sm'>
                    <i className={`${sLink.icon} w-4 mr-3 text-center`} />
                    {sLink.title}
                  </span>
                </Link>
              </div>
            )
          })}
        </Collapse>
      )}
    </>
  )
}
