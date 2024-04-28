import { useGlobal } from '@/lib/global'
import CONFIG from '../config'
import { siteConfig } from '@/lib/config'

/**
 * 跳转到网页顶部
 * 当屏幕下滑500像素后会出现该控件
 * @param targetRef 关联高度的目标html标签
 * @param showPercent 是否显示百分比
 * @returns {JSX.Element}
 * @constructor
 */
const JumpToTopButton = ({ showPercent = true, percent }) => {
  const { locale } = useGlobal()
  if (!siteConfig('NEXT_WIDGET_TO_TOP', null, CONFIG)) {
    return <></>
  }
  return (<div className='flex space-x-1 items-center transform hover:scale-105 duration-200 py-2 px-3' onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} >
        <div className='dark:text-gray-200' title={locale.POST.TOP} >
          <i className='fa-arrow-up fas' />
        </div>
        {showPercent && (<div className='text-xs dark:text-gray-200 block lg:hidden'>{percent}%</div>)}
    </div>)
}

export default JumpToTopButton
