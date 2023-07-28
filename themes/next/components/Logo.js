import Link from 'next/link'
import React from 'react'

const Logo = props => {
  const { siteInfo, className } = props
  return (
        <Link href='/' passHref legacyBehavior>
            <div className={'flex flex-col justify-center items-center cursor-pointer bg-black dark:bg-gray-800 space-y-3 font-bold ' + className}>
                <div data-aos="fade-down"
                    data-aos-duration="500"
                    data-aos-once="true"
                    data-aos-anchor-placement="top-bottom"
                    className='font-serif text-xl text-white'> {siteInfo?.title}</div>
                <div data-aos="fade-down"
                    data-aos-duration="500"
                    data-aos-delay="300"
                    data-aos-once="true"
                    data-aos-anchor-placement="top-bottom"
                    className='text-sm text-gray-300 font-light text-center'> {siteInfo?.description}</div>
            </div>
        </Link>
  )
}
export default Logo
