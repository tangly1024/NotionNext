import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import Link from 'next/link'
import CONFIG from '../config'
import SocialButton from './SocialButton'
import DarkModeButton from '@/components/DarkModeButton'

export default function Header({ siteInfo }) {
  return (
    <header className="bg-white px-4 py-8 text-center dark:bg-gray-900 sm:px-6 lg:px-8 relative">
      <DarkModeButton className='absolute top-8 right-[6%]' />
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="inline-block">
          <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
            <div className="transform cursor-pointer transition duration-200 hover:rotate-45 hover:scale-110">
              <LazyImage
                priority={true}
                src={siteInfo?.icon}
                className="rounded-full"
                width={100}
                height={100}
                alt={siteConfig('AUTHOR')}
              />
            </div>

            <div className="flex flex-col justify-center">
              <h1 className="py-2 font-serif text-2xl text-gray-800 transition duration-200 hover:scale-105 dark:text-gray-100">
                {siteConfig('AUTHOR')}
              </h1>
              <p
                className="py-2 font-light text-gray-600 transition duration-200 hover:scale-105 dark:text-gray-300"
                dangerouslySetInnerHTML={{
                  __html: siteConfig('SIMPLE_LOGO_DESCRIPTION', null, CONFIG)
                }}
              />
            </div>
          </div>
        </Link>

        <div className="mt-6 flex justify-center">
          <SocialButton />
        </div>
        <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          {siteConfig('DESCRIPTION')}
        </p>
      </div>
    </header>
  )
}