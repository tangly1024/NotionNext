import BLOG from '@/blog.config'
import LazyImage from '@/components/LazyImage'
import { useNavGlobal } from '@/themes/nav'
import Link from 'next/link'
import CONFIG from '../config'

/**
 * Logo区域
 * @param {*} props
 * @returns
 */
export default function LogoBar(props) {
  const { siteInfo } = props
  const { pageNavVisible, changePageNavVisible } = useNavGlobal()
  // const logo = siteInfo?.icon?.replaceAll("width=400", "width=280")

  const togglePageNavVisible = () => {
    changePageNavVisible(!pageNavVisible)
  }
  return (
        <div id='top-wrapper' className='w-full flex items-center'>
            {/* <div onClick={togglePageNavVisible} className='cursor-pointer md:hidden text-xl pr-3 hover:scale-110 duration-150'>
                <i className={`fa-solid ${pageNavVisible ? 'fa-align-justify' : 'fa-indent'}`}></i>
            </div> */}
            <div className='md:w-48'>
              <a href='/' className='grid justify-items-center text-md md:text-xl dark:text-gray-200'>
                  <LazyImage src={siteInfo?.icon?.replaceAll("width=400", "width=280")} height='44px' alt={BLOG.AUTHOR + ' - ' + BLOG.NEXT_PUBLIC_BIO} className='md:block' placeholderSrc=''/>
                  {CONFIG.SHOW_TITLE_TEXT && siteInfo?.title}
              </a>
            </div>
        </div>
  )
}
