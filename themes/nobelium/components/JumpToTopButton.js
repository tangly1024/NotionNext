import { useGlobal } from '@/lib/global'
import React from 'react'

/**
 * 跳转到网页顶部
 * 当屏幕下滑500像素后会出现该控件
 * @param targetRef 关联高度的目标html标签
 * @param showPercent 是否显示百分比
 * @returns {JSX.Element}
 * @constructor
 */
const JumpToTopButton = () => {
  const { locale } = useGlobal()
  return <div title={locale.POST.TOP} className='cursor-pointer p-2 text-center' onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    ><i className='fas fa-angle-up text-2xl' />
    </div>
}

export default JumpToTopButton
