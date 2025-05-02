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
      <div className='select-none w-full text-left' onClick={toggleShow}>
        {!hasSubMenu && (
          <Link
            href={link?.href}
            target={link?.target}
            className='flex justify-between no-underline tracking-widest'>
            <span className=' transition-all items-center duration-200'>
              {link?.icon && <i className={link.icon + ' mr-4'} />}
              {link?.name}
            </span>
          </Link>
        )}
        {hasSubMenu && (
          <div
            onClick={hasSubMenu ? toggleOpenSubMenu : null}
            className='flex items-center justify-between cursor-pointer  no-underline tracking-widest'>
            <span className='transition-all items-center duration-200'>
              {link?.icon && <i className={link.icon + ' mr-4'} />}
              {link?.name}
            </span>
            <i
              className={`select-none px-2 fas fa-chevron-left transition-all duration-200 ${isOpen ? '-rotate-90' : ''} `}></i>
          </div>
        )}
      </div>

      {/* 折叠子菜单 */}
      {hasSubMenu && (
        <Collapse
          isOpen={isOpen}
          onHeightChange={props.onHeightChange}
          className='rounded-xl'>
          {link.subMenus.map((sLink, index) => {
            return (
              <div
                key={index}
                className='dark:text-gray-200 text-left px-3 justify-start py-1 tracking-widest transition-all duration-200 pr-6'>
                <Link href={sLink.href} target={link?.target}>
                  <span className='ml-4 whitespace-nowrap'>
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
