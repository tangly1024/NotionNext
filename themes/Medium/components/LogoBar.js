import BLOG from '@/blog.config'
import { useGlobal } from '@/lib/global'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'

export default function LogoBar () {
  const { locale } = useGlobal()

  return <div id='top-wrapper' className='w-full flex justify-center font-sans'>
        <div className='flex mx-auto w-full items-center space-x-3 py-6 px-5'>
            <Link href='/'>
                 <a className='text-3xl'>{BLOG.TITLE}</a>
            </Link>
            <Link href='/about'>
                <a className='text-gray-600'>{locale.NAV.ABOUT}</a>
            </Link>
            {BLOG.CONTACT_EMAIL && <Link href={`mailto:${BLOG.CONTACT_EMAIL}`} passHref>
                <div className='bg-black px-2 py-1 rounded-full'>
                <FontAwesomeIcon className='cursor-pointer text-white' icon={faEnvelope}/>
                </div>
            </Link>}
        </div>
    </div>
}
