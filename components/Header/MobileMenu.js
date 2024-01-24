'use client'

import React from 'react'
import { Dropdown } from 'flowbite-react'
import { Navs } from './constants'
import AgiButton from './AgiButton'

const MobileMenu = () => {
  return (
    <div className="md:hidden flex gap-4">
      <AgiButton />
      <Dropdown
        label=""
        dismissOnClick={false}
        className='z-50'
        renderTrigger={() => (
          <svg
            className="w-6 h-6 text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        )}
      >
        {Navs.map(item => {
          return (
            <Dropdown.Item key={item.href} href={item.href}>
              {item.name}
            </Dropdown.Item>
          )
        })}
      </Dropdown>
    </div>
  )
}

export default React.memo(MobileMenu)
