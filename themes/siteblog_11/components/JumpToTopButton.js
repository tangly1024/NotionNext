import { useGlobal } from '@/lib/global'
import React from 'react'
import CONFIG_MEDIUM from '../config_medium'

/**
 * 跳转到网页顶部
 * 当屏幕下滑500像素后会出现该控件
 * @param targetRef 关联高度的目标html标签
 * @param showPercent 是否显示百分比
 * @returns {JSX.Element}
 * @constructor
 */
const JumpToTopButton = ({ showPercent = false, percent, className }) => {
  if (!CONFIG_MEDIUM.WIDGET_TO_TOP) {
    return <></>
  }
  const { locale } = useGlobal()
  return (<div className={'flex space-x-1 items-center cursor-pointer w-full justify-center ' + className } onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} >
        <div title={locale.POST.TOP} >
          <i className='fas fa-arrow-up'/>
        </div>
        {showPercent && (<div className='text-xs dark:text-gray-200 block lg:hidden'>{percent}%</div>)}
    </div>)
}

export default JumpToTopButton
