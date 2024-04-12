import Collapse from '@/components/Collapse'
import Link from 'next/link'
import { useState } from 'react'

/**
 * 折叠菜单
 * @param {*} param0
 * @returns
 */
export const MenuItemCollapse = props => {
  const { link } = props
  const [show, changeShow] = useState(false)
  const hasSubMenu = link?.subMenus?.length > 0

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

  return (
    <>
      <div
        className='w-full px-8 py-3 text-left dark:bg-hexo-black-gray'
        onClick={toggleShow}>
        {!hasSubMenu && (
          <Link
            href={link?.to}
            target={link?.target}
            className='hover:text-[#D2232A] font-extralight flex justify-between pl-2 pr-4 dark:text-gray-200 no-underline tracking-widest pb-1'>
            <span className=' transition-all items-center duration-200'>
              {link?.icon && <i className={link.icon + ' mr-4'} />}
              {link?.name}
            </span>
          </Link>
        )}
        {hasSubMenu && (
          <div
            onClick={hasSubMenu ? toggleOpenSubMenu : null}
            className='hover:text-[#D2232A]  font-extralight flex items-center justify-between pl-2 pr-4 cursor-pointer  dark:text-gray-200 no-underline tracking-widest pb-1'>
            <span className='transition-all items-center duration-200'>
              {link?.icon && <i className={link.icon + ' mr-4'} />}
              {link?.name}
            </span>
            <i
              className={`px-2 fas fa-chevron-left transition-all duration-200 ${isOpen ? '-rotate-90' : ''} text-gray-400`}></i>
          </div>
        )}
      </div>

      {/* 折叠子菜单 */}
      {hasSubMenu && (
        <Collapse isOpen={isOpen} onHeightChange={props.onHeightChange}>
          {link.subMenus.map((sLink, index) => {
            return (
              <div
                key={index}
                className='dark:bg-black dark:text-gray-200 text-left px-10 justify-start bg-gray-50 hover:bg-gray-50 dark:hover:bg-gray-900 tracking-widest transition-all duration-200  py-3 pr-6'>
                <Link href={sLink.to} target={link?.target}>
                  <span className='text-sm ml-4 whitespace-nowrap'>
                    {link?.icon && <i className={sLink.icon + ' mr-2'} />}{' '}
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
