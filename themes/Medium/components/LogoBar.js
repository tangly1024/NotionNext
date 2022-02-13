import BLOG from '@/blog.config'
import Link from 'next/link'

export default function LogoBar () {
  // const { locale } = useGlobal()

  return <div id='top-wrapper' className='w-full flex justify-center font-sans'>
    <div className='flex mx-auto w-full  justify-between '>
      <div className='space-x-3 flex items-center'>
        <Link href='/'>
          <a className='text-2xl'>{BLOG.TITLE}</a>
        </Link>
        {/* <Link href='/about'> */}
        {/*  <a className='text-gray-600'>{locale.NAV.ABOUT}</a> */}
        {/* </Link> */}
      </div>
      {/* {BLOG.CONTACT_EMAIL && <Link href={`mailto:${BLOG.CONTACT_EMAIL}`} passHref> */}
      {/*  <div className='bg-black px-2 py-1 rounded-full'> */}
      {/*    <FontAwesomeIcon className='cursor-pointer text-white' icon={faEnvelope} /> */}
      {/*  </div> */}
      {/* </Link>} */}
    </div>
  </div>
}
