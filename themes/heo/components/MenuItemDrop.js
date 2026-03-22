import SmartLink from '@/components/SmartLink'
import { useState } from 'react'

export const MenuItemDrop = ({ link }) => {
  const [show, changeShow] = useState(false)
  const hasSubMenu = link?.subMenus?.length > 0

  if (!link || !link.show) {
    return null
  }

  // 判断是否是外部链接（以 http 或 https 开头）
  const isExternal = (url) => {
    return url?.startsWith('http') || url?.startsWith('//')
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => changeShow(true)}
      onMouseLeave={() => changeShow(false)}>
      {/* 不含子菜单 */}
      {!hasSubMenu && (
        <>
          {isExternal(link?.href) ? (
            // 外部链接 - 在新窗口打开
            <a
              href={link?.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full flex justify-center items-center px-3 py-1 no-underline tracking-widest hover:bg-gradient-to-r from-cyan-400/20 to-blue-500/20 dark:hover:from-transparent dark:hover:to-transparent dark:hover:bg-purple-900 hover:shadow-lg transform"
            >
              {link?.icon && <i className={link?.icon} />} {link?.name}
            </a>
          ) : (
            // 内部链接 - 使用 Next.js 的 Link 组件
            <SmartLink
              href={link?.href}
              className="rounded-full flex justify-center items-center px-3 py-1 no-underline tracking-widest hover:bg-gradient-to-r from-cyan-400/20 to-blue-500/20 dark:hover:from-transparent dark:hover:to-transparent dark:hover:bg-purple-900 hover:shadow-lg transform"
            >
              {link?.icon && <i className={link?.icon} />} {link?.name}
            </SmartLink>
          )}
        </>
      )}
      {/* 含子菜单的按钮 */}
      {hasSubMenu && (
        <>
          <div className="cursor-pointer rounded-full flex justify-center items-center px-3 py-1 no-underline tracking-widest relative hover:bg-gradient-to-r from-cyan-400/20 to-blue-500/20 dark:hover:from-transparent dark:hover:to-transparent dark:hover:bg-purple-900 hover:shadow-lg transform">
            {link?.icon && <i className={link?.icon} />} {link?.name}
            {/* 主菜单下方的安全区域 */}
            {show && (
              <div className='absolute w-full h-4 -bottom-4 left-0 bg-transparent z-30'></div>
            )}
          </div>
        </>
      )}
      {/* 子菜单 */}
      {hasSubMenu && (
        <ul
          className={`${show ? 'opacity-100 top-14 pointer-events-auto' : 'opacity-0 top-20 pointer-events-none'} shadow-md overflow-hidden rounded-3xl bg-white/95 ring-1 ring-black/5 ring-inset dark:bg-purple-900/95 dark:ring-purple-300/40 transition-all duration-300 ease-in-out z-20 absolute`}>
          {link.subMenus.map((sLink, index) => {
            return (
              <li
                key={index}
                className="cursor-pointer hover:bg-blue-600 dark:hover:bg-[#ec4899] hover:text-white text-gray-900 dark:text-gray-100  tracking-widest transition-all duration-200 py-1 pr-6 pl-3">
                {/* 区分内部和外部链接 */}
                {isExternal(sLink?.href) ? (
                  <a
                    href={sLink.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-nowrap font-normal"
                  >
                    {sLink?.icon && <i className={sLink?.icon}> &nbsp; </i>}
                    {sLink.title}
                  </a>
                ) : (
                  <SmartLink href={sLink.href} className="text-sm text-nowrap font-normal">
                    {sLink?.icon && <i className={sLink?.icon}> &nbsp; </i>}

                    {sLink.title}
                  </SmartLink>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}