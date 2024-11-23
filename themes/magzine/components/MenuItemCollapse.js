import Collapse from '@/components/Collapse'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

/**
 * 折叠菜单
 * @param {*} param0
 * @returns
 */
export const MenuItemCollapse = props => {
  const { link } = props
  const [show, setShow] = useState(false)
  const hasSubMenu = link?.subMenus?.length > 0

  const [isOpen, setOpen] = useState(false)

  const router = useRouter()

  if (!link || !link.show) {
    return null
  }

  const selected = router.pathname === link.href || router.asPath === link.href

  const toggleShow = () => {
    setShow(!show)
  }

  const toggleOpenSubMenu = () => {
    setOpen(!isOpen)
  }

  // 路由切换时菜单收起
  useEffect(() => {
    setOpen(false)
  }, [router])

  return (
    <>
      <div
        className={
          (selected
            ? 'bg-gray-600 text-white hover:text-white'
            : 'hover:text-gray-600') +
          ' px-7 w-full text-left duration-200 dark:bg-hexo-black-gray dark:border-black'
        }
        onClick={toggleShow}>
        {!hasSubMenu && (
          <Link
            href={link?.href}
            target={link?.target}
            className='py-2 w-full my-auto items-center justify-between flex  '>
            <div>
              <div className={`${link.icon} text-center w-4 mr-4`} />
              {link.name}
            </div>
          </Link>
        )}

        {hasSubMenu && (
          <div
            onClick={hasSubMenu ? toggleOpenSubMenu : null}
            className='py-2 flex justify-between cursor-pointer  dark:text-gray-200 no-underline tracking-widest'>
            <div>
              <div className={`${link.icon} text-center w-4 mr-4`} />
              {link.name}
            </div>
            <div className='inline-flex items-center '>
              <i
                className={`px-2 fas fa-chevron-right transition-all duration-200 ${isOpen ? 'rotate-90' : ''}`}></i>
            </div>
          </div>
        )}
      </div>

      {/* 折叠子菜单 */}
      {hasSubMenu && (
        <Collapse isOpen={isOpen} onHeightChange={props.onHeightChange}>
          {link?.subMenus?.map(sLink => {
            return (
              <div
                key={sLink.id}
                className='
              not:last-child:border-b-0 border-b dark:border-gray-800 py-2 pl-12 cursor-pointer hover:bg-gray-100 dark:text-gray-200
              dark:bg-black text-left justify-start text-gray-600 bg-gray-50 dark:hover:bg-gray-900 tracking-widest transition-all duration-200'>
                <Link href={sLink.href} target={link?.target}>
                  <div>
                    <div
                      className={`${sLink.icon} text-center w-3 mr-3 text-xs`}
                    />
                    {sLink.title}
                  </div>
                </Link>
              </div>
            )
          })}
        </Collapse>
      )}
    </>
  )
}
