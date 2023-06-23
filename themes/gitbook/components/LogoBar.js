import BLOG from '@/blog.config'
import Link from 'next/link'

export default function LogoBar(props) {
  const { siteInfo } = props
  return (
        <div id='top-wrapper' className='w-full flex items-center'>
            <Link href='/' className='flex text-md md:text-xl dark:text-gray-200'>
                {/*  eslint-disable-next-line @next/next/no-img-element */}
                <img src={siteInfo?.icon} width={24} height={24} alt={BLOG.AUTHOR} className='mr-2' /> {siteInfo?.title}
            </Link>
        </div>
  )
}
