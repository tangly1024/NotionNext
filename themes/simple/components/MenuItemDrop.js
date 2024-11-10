import Link from 'next/link'
import { useState } from 'react'

export const MenuItemDrop = ({ link }) => {
  const [isOpen, setIsOpen] = useState(false)
  const hasSubMenu = link?.subMenus?.length > 0

  if (!link || !link.show) {
    return null
  }

  const handleMouseEnter = () => setIsOpen(true)
  const handleMouseLeave = () => setIsOpen(false)

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {!hasSubMenu ? (
        <Link
          href={link?.href}
          target={link?.target}
          className="menu-link inline-flex items-center px-4 py-2 text-sm text-gray-700 no-underline transition-colors hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400"
        >
          {link?.icon && <i className={`${link.icon} mr-2`} aria-hidden="true" />}
          {link?.name}
        </Link>
      ) : (
        <button
          className="menu-link inline-flex items-center px-4 py-2 text-sm text-gray-700 no-underline transition-colors hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {link?.icon && <i className={`${link.icon} mr-2`} aria-hidden="true" />}
          {link?.name}
          <i
            className={`fas fa-chevron-down ml-2 transition-transform duration-300 ${
              isOpen ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        </button>
      )}

      {hasSubMenu && (
        <ul
          className={`absolute left-0 z-20 mt-2 w-48 rounded-md border border-gray-200 bg-white py-2 shadow-lg transition-all duration-300 dark:border-gray-700 dark:bg-gray-800 ${
            isOpen
              ? 'visible translate-y-0 opacity-100'
              : 'invisible -translate-y-2 opacity-0'
          }`}
        >
          {link.subMenus.map((subLink, index) => (
            <li key={index}>
              <Link
                href={subLink.href}
                target={subLink?.target}
                className="block px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 hover:text-blue-600 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-blue-400"
              >
                {subLink?.icon && (
                  <i className={`${subLink.icon} mr-2`} aria-hidden="true" />
                )}
                {subLink.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}