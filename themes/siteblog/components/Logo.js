import Link from 'next/link'
import React from 'react'

const Logo = props => {
  const { siteInfo } = props
  return (
    <div id="top-wrapper" className="w-full flex items-center font-sans">
      <Link href="/">
        <a className="text-md md:text-xl dark:text-gray-200">
          {siteInfo?.title}
        </a>
      </Link>
    </div>
  )
}
export default Logo
