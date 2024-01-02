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

  if (!siteConfig('MATERY_WIDGET_TO_TOP', null, CONFIG)) {
    return <></>
  }

  return <div data-aos="fade-left"
        data-aos-duration="300"
        data-aos-anchor-placement="top-center"
        className={'justify-center items-center text-center'} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} >
        <i id="darkModeButton" title={locale.POST.TOP} className={`fas fa-arrow-up transform hover:scale-105 duration-200 text-white
        bg-indigo-700 w-10 h-10 rounded-full dark:bg-black cursor-pointer py-2.5`} />
    </div>
}

export default JumpToTopButton
