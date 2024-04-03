import { useGlobal } from '@/lib/global'
import CONFIG from '../config'
import { siteConfig } from '@/lib/config'

/**
 * 点击召唤目录抽屉
 * 当屏幕下滑500像素后会出现该控件
 * @param props 父组件传入props
 * @returns {JSX.Element}
 * @constructor
 */
const TocDrawerButton = (props) => {
  const { locale } = useGlobal()
  if (!siteConfig('HEXO_WIDGET_TOC', null, CONFIG)) {
    return <></>
  }
  return (<div onClick={props.onClick} className='cursor-pointer opacity-80 transform duration-200 hover:opacity-100 flex justify-center items-center w-8 h-7 text-center' title={locale.POST.TOP} >
    <i className='fas fa-list-ol text-md'/>
  </div>)
}

export default TocDrawerButton
