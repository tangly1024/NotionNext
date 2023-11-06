import { siteConfig } from '@/lib/config'
import Link from 'next/link'

const Logo = props => {
  return (
    <Link href='/' passHref legacyBehavior>
      <div className='flex flex-col justify-center items-center cursor-pointer space-y-3'>
        <div className=' text-lg p-1.5 rounded dark:border-white hover:scale-110 transform duration-200'> {siteConfig('TITLE') }</div>
      </div>
    </Link>
  )
}
export default Logo
