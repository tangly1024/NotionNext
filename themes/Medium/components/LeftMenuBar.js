import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import React from 'react'

export default function LeftMenuBar () {
  return <div className='w-20  border-r hidden lg:block pt-12'>
    <section>
      <Link href='/'>
        <div className='text-center cursor-pointer  hover:text-black'>
          <FontAwesomeIcon icon={faHome} size='lg' color='gray' />
        </div>
      </Link>
    </section>
  </div>
}
