import { useGlobal } from '@/lib/global'
import React from 'react'
import CONFIG_MATERY from '../config_matery'

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

  if (!CONFIG_MATERY.WIDGET_TO_TOP) {
    return <></>
  }
  return (<div className=' drop-shadow-md space-x-1 items-center justify-center transform hover:scale-105 duration-200 px-3 py-2 text-center text-white bg-indigo-700 dark:bg-hexo-black-gray rounded-full'
         onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} >
        <div title={locale.POST.TOP} ><i className='fas fa-arrow-up text-2xl rounded-full' /></div>
        {showPercent && (<div className='text-md hidden lg:block'>{percent}</div>)}
    </div>)
}

export default JumpToTopButton
