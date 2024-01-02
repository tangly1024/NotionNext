import CONFIG from '../config'
import { siteConfig } from '@/lib/config'

/**
 * 网站顶部 提示栏
 * @returns
 */
export default function TopBar (props) {
  const content = siteConfig('SIMPLE_TOP_BAR_CONTENT', null, CONFIG)

  if (content) {
    return <header className="flex justify-center items-center bg-black dark:bg-hexo-black-gray">
       <div id='top-bar-inner' className='max-w-9/10 w-full z-20'>
       <div className='text-xs text-center float-left text-white z-50 leading-5 py-2.5' dangerouslySetInnerHTML={{ __html: content }}/>
       </div>
    </header>
  }
  return <></>
}
