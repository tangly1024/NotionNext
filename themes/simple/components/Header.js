import Link from 'next/link'
import CONFIG_SIMPLE from '../config_simple'

/**
 * 网站顶部
 * @returns
 */
export const Header = (props) => {
  const { siteInfo } = props

  return (
      <header className="text-center justify-between items-center px-6 bg-white h-80 dark:bg-black relative z-10">
            <div className="float-none inline-block py-12">
              <Link href='/'>
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className='max-h-48 hover:opacity-60 duration-200 transition-all cursor-pointer' src={CONFIG_SIMPLE.LOGO_IMG}/>
              </Link>
              <div className='text-xs text-gray-600 dark:text-gray-300'>{siteInfo?.description}</div>
            </div>
        </header>
  )
}
