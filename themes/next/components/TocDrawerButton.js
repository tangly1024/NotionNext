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
  if (!siteConfig('NEXT_WIDGET_TOC', null, CONFIG)) {
    return <></>
  }
  if (props?.post?.toc?.length > 1) {
    return (
            <div onClick={props.onClick} className='py-2 px-3 cursor-pointer dark:text-gray-200 text-center transform hover:scale-150 duration-200 flex justify-center items-center' title={locale.POST.TOP} >
                <i className='fas fa-list-ol' />
            </div>
    )
  }
  return <></>
}

export default TocDrawerButton
