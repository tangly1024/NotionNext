import { siteConfig } from '@/lib/config'
import Link from 'next/link'

const Logo = props => {
  return (
    <Link href='/' passHref legacyBehavior>
      {/* <div className='flex flex-col justify-center items-center cursor-pointer space-y-3'> */}
        <div className='font-medium text-lg px-4 rounded cursor-pointer transform duration-200'> {siteConfig('TITLE') }</div>
      {/* </div> */}
    </Link>
  )
}
export default Logo
