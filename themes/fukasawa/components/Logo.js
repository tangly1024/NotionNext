import { siteConfig } from '@/lib/config'
import Link from 'next/link'

const Logo = props => {
  return (
    <section className='flex'>
      <Link
        href='/'
        className='logo hover:bg-black hover:text-white border-black border-2 duration-500 px-4 py-2 cursor-pointer dark:text-gray-300 dark:border-gray-300 font-black'>
        {siteConfig('TITLE')}
      </Link>
    </section>
  )
}

export default Logo
