import LazyImage from '@/components/LazyImage'
import { useGitBookGlobal } from '@/themes/gitbook'
import Link from 'next/link'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

/**
 * Logo区域
 * @param {*} props
 * @returns
 */
export default function LogoBar(props) {
  const { siteInfo } = props
  const { pageNavVisible, changePageNavVisible } = useGitBookGlobal()

  const togglePageNavVisible = () => {
    changePageNavVisible(!pageNavVisible)
  }
  return (
        <div id='top-wrapper' className='w-full flex items-center'>
            <div onClick={togglePageNavVisible} className='cursor-pointer md:hidden text-xl pr-3 hover:scale-110 duration-150'>
                <i className={`fa-solid ${pageNavVisible ? 'fa-align-justify' : 'fa-indent'}`}></i>
            </div>
            <Link href={`/${siteConfig('GITBOOK_INDEX_PAGE', '', CONFIG)}`} className='flex text-md md:text-xl dark:text-gray-200'>
                <LazyImage src={siteInfo?.icon} width={24} height={24} alt={siteConfig('AUTHOR')} className='mr-2 hidden md:block' />
                {siteConfig('TITLE')}
            </Link>
        </div>
  )
}
