import Collapse from '@/components/Collapse'
import SmartLink from '@/components/SmartLink'
import { useState } from 'react'

/**
 * 折叠菜单
 * @param {*} param0
 * @returns
 */
export const MenuItemCollapse = ({ link }) => {
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
        className='select-none w-full p-3 bg-[#e8dff0] dark:bg-[#1e1e1e] border-none dark:border dark:border-gray-600 rounded-[1.45rem] text-left transition-all duration-200 shadow-[4px_4px_10px_rgba(0,0,0,0.08),-4px_-4px_10px_rgba(255,255,255,0.9),inset_2px_2px_4px_rgba(255,255,255,0.6),inset_-1px_-1px_3px_rgba(0,0,0,0.04)] dark:shadow-none'
        onClick={toggleShow}>
        {!hasSubMenu && (
          <SmartLink
            href={link?.href}
            target={link?.target}
            className='font-extralight  flex justify-between pl-2 pr-4 dark:text-gray-200 no-underline tracking-widest'>
            <span className=' transition-all items-center duration-200'>
              {link?.icon && <i className={link.icon + ' mr-4'} />}
              {link?.name}
            </span>
          </SmartLink>
        )}
        {hasSubMenu && (
          <div
            onClick={hasSubMenu ? toggleOpenSubMenu : null}
            className='font-extralight flex items-center justify-between pl-2 pr-4 cursor-pointer  dark:text-gray-200 no-underline tracking-widest'>
            <span className='transition-all items-center duration-200'>
              {link?.icon && <i className={link.icon + ' mr-4'} />}
              {link?.name}
            </span>
            <i
              className={`select-none px-2 fas fa-chevron-left transition-all duration-200 ${isOpen ? '-rotate-90' : ''} text-gray-400`}></i>
          </div>
        )}
      </div>

      {/* 折叠子菜单 */}
      {hasSubMenu && (
        <Collapse isOpen={isOpen} className='rounded-[1.45rem]'>
          <div className='mt-2 rounded-[1.45rem] bg-[#f5f0e8] p-2 shadow-[inset_3px_3px_7px_rgba(255,255,255,0.65),inset_-3px_-3px_7px_rgba(0,0,0,0.05)] dark:bg-hexo-black-gray dark:text-gray-200 dark:shadow-none'>
            {link.subMenus.map((sLink, index) => {
              return (
                <div
                  key={index}
                  className='mb-1 last:mb-0 rounded-[1.05rem] bg-transparent px-3 py-3 pr-6 text-left tracking-widest transition-all duration-200 hover:bg-[rgba(255,255,255,0.38)] dark:hover:bg-blue-500/10'>
                  <SmartLink href={sLink.href} target={link?.target}>
                    <span className='ml-4 whitespace-nowrap text-sm'>
                      {link?.icon && (<i className={sLink.icon + ' mr-2 opacity-80'} />)}{' '}
                      {sLink.title}
                    </span>
                  </SmartLink>
                </div>
              )
            })}
          </div>
        </Collapse>
      )}
    </>
  )
}
