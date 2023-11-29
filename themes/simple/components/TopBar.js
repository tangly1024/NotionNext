import CONFIG from '../config'
import { siteConfig } from '@/lib/config'

/**
 * 网站顶部 提示栏
 * @returns
 */
export const TopBar = (props) => {
  if (siteConfig('SIMPLE_TOP_BAR_CONTENT', null, CONFIG)) {
    return <header className="flex justify-center items-center bg-black dark:bg-hexo-black-gray">
       <div id='top-bar-inner' className='max-w-9/10 w-full z-20'>
       <div className='text-xs text-center float-left text-white z-50 leading-5 py-2.5' dangerouslySetInnerHTML={{ __html: siteConfig('SIMPLE_TOP_BAR_CONTENT', null, CONFIG) }}/>
       </div>
    </header>
  }
  return <></>
}
