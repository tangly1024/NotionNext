import Link from 'next/link'

export default function LogoBar (props) {
  const { siteInfo } = props
  return <div id='top-wrapper' className='w-full flex items-center font-sans'>
        <Link href='/'>
          <a className='text-md md:text-xl dark:text-gray-200'>{siteInfo?.title}</a>
        </Link>
  </div>
}
