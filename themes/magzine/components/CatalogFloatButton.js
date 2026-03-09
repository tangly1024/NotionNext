import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import CONFIG from '../config'

/**
 * 移动端点击召唤目录抽屉
 * 当屏幕下滑500像素后会出现该控件
 * @param props 父组件传入props
 * @returns {JSX.Element}
 * @constructor
 */
const CatalogFloatButton = props => {
  const { locale } = useGlobal()
  // 用此配置可以关闭
  if (!siteConfig('Magzine_WIDGET_TOC', true, CONFIG)) {
    return <></>
  }
  return (
    <div
      onClick={props.onClick}
      className='py-5 px-5 cursor-pointer transform duration-200 flex justify-center items-center w-7 h-7 text-center'
      title={locale.POST.TOP}>
      <i className='fas fa-list-ol' />
    </div>
  )
}

export default CatalogFloatButton
