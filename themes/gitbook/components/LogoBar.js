import Link from 'next/link'

export default function LogoBar (props) {
  const { siteInfo } = props
  return (
    <div id='top-wrapper' className='w-full flex items-center '>
          <Link href='/' className='text-md md:text-xl dark:text-gray-200'>
            {siteInfo?.title}
          </Link>
    </div>
  );
}
