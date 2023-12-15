import Collapse from '@/components/Collapse'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

/**
 * 折叠菜单
 * @param {*} param0
 * @returns
 */
export const MenuItemCollapse = (props) => {
  const { link } = props
  const [show, changeShow] = useState(false)
  const hasSubMenu = link?.subMenus?.length > 0

  const [isOpen, changeIsOpen] = useState(false)

  const router = useRouter()

  if (!link || !link.show) {
    return null
  }

  const selected = (router.pathname === link.to) || (router.asPath === link.to)

  const toggleShow = () => {
    changeShow(!show)
  }

  const toggleOpenSubMenu = () => {
    changeIsOpen(!isOpen)
  }

  return <>
        <div className={ 'text-black' + (selected ? 'text-white hover:text-white' : 'hover:text-gray-600') + ' px-7 w-full text-left duration-200 dark:border-black'} onClick={toggleShow} >

            {!hasSubMenu && <Link href={link?.to} target={link?.to?.indexOf('http') === 0 ? '_blank' : '_self'} className='py-2 w-full my-auto items-center justify-between flex  '>
                <div><div className={`${link.icon} text-center w-4 mr-4`} />{link.name}</div>
            </Link>}

            {hasSubMenu && <div onClick={hasSubMenu ? toggleOpenSubMenu : null}
                className="py-2 flex justify-between cursor-pointer  dark:text-gray-400 dark:hover:text-white font-bold  no-underline tracking-widest">
                <div><div className={`${link.icon} text-center w-4 mr-2`} />{link.name}</div>
                <div className='inline-flex items-center '><i className={`px-2 fas fa-chevron-right transition-all duration-200 ${isOpen ? 'rotate-90' : ''}`}></i></div>
            </div>}
        </div>

        {/* 折叠子菜单 */}
        {hasSubMenu && <Collapse isOpen={isOpen} onHeightChange={props.onHeightChange}>
            {link?.subMenus?.map((sLink, index) => {
              return <div key={index} className='
              py-2 px-14 cursor-pointer hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white font-bold 
              dark:bg-black text-left justify-start text-gray-600 bg-gray-50 bg-opacity-20 dark:hover:bg-gray-600 tracking-widest transition-all duration-200'>
                    {/* <Link href={sLink.to} target={link?.to?.indexOf('http') === 0 ? '_blank' : '_self'}> */}
                    <a href={`/#${sLink.title}`} target={'_self'}>
                        <div><div className={`${sLink?.icon ? sLink?.icon : 'fas fa-hashtag'} text-center w-3 mr-2 text-xs`} />{sLink.title}</div>
                    </a>
                </div>
            })}
        </Collapse>}
    </>
}
