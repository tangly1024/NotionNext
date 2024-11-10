import { useState } from 'react'
import Link from 'next/link'
import Collapse from '@/components/Collapse'

export const MenuItemCollapse = ({ link, onHeightChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const hasSubMenu = link?.subMenus?.length > 0

  if (!link || !link.show) {
    return null
  }

  const toggleSubMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 dark:bg-gray-800">
      <div
        className="flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
        onClick={hasSubMenu ? toggleSubMenu : undefined}
      >
        {!hasSubMenu ? (
          <Link
            href={link?.href}
            target={link?.target}
            className="flex w-full items-center text-gray-700 no-underline transition-colors hover:text-primary dark:text-gray-200 dark:hover:text-primary-foreground"
          >
            {link?.icon && <i className={`${link.icon} mr-2`} aria-hidden="true" />}
            <span>{link?.name}</span>
          </Link>
        ) : (
          <>
            <span className="flex items-center text-gray-700 dark:text-gray-200">
              {link?.icon && <i className={`${link.icon} mr-2`} aria-hidden="true" />}
              {link?.name}
            </span>
            <i
              className={`fa fa-plus text-gray-400 transition-transform duration-200 ${
                isOpen ? 'rotate-45' : ''
              }`}
              aria-hidden="true"
            />
          </>
        )}
      </div>

      {hasSubMenu && (
        <Collapse isOpen={isOpen} onHeightChange={onHeightChange}>
          {link.subMenus.map((subLink, index) => (
            <Link
              key={index}
              href={subLink.href}
              target={subLink?.target}
              className="block border-t border-gray-100 bg-gray-50 px-6 py-3 text-sm text-gray-700 no-underline transition-colors hover:bg-gray-100 hover:text-primary dark:border-gray-800 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              {subLink?.icon && (
                <i className={`${subLink.icon} mr-2 w-4`} aria-hidden="true" />
              )}
              {subLink.title}
            </Link>
          ))}
        </Collapse>
      )}
    </div>
  )
}