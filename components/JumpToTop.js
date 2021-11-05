import React, { useCallback, useEffect, useState } from 'react'
import throttle from 'lodash.throttle'
import { useGlobal } from '@/lib/global'

/**
 * 跳转到网页顶部
 * 当屏幕下滑500像素后会出现该控件
 * @param targetRef 关联高度的目标html标签
 * @param showPercent 是否显示百分比
 * @returns {JSX.Element}
 * @constructor
 */
const JumpToTop = ({ targetRef, showPercent = true }) => {
  const { locale } = useGlobal()
  const [show, switchShow] = useState(false)
  const [percent, changePercent] = useState(0)
  const scrollListener = () => {
    // 处理是否显示回到顶部按钮
    const clientHeight = targetRef ? (targetRef.current ? targetRef.current.clientHeight : 0) : 0
    const scrollY = window.pageYOffset
    const fullHeight = clientHeight - window.outerHeight
    const shouldShow = scrollY > 100
    if (shouldShow !== show) {
      switchShow(shouldShow)
    }
    let per = parseFloat(((scrollY / fullHeight * 100)).toFixed(0))
    if (per > 100) per = 100
    changePercent(per)
  }
  useEffect(() => {
    document.addEventListener('scroll', scrollListener)
    return () => document.removeEventListener('scroll', scrollListener)
  }, [show])

  return (
    <div id='jump-to-top' className='right-0 fixed flex bottom-24 mr-2.5 py-1 duration-500 z-20'>
      <div className='transform hover:scale-105 duration-200 '>
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{ boxShadow: 'rgba(41, 50, 60, 0.5) 0px 2px 16px', borderRadius: '28px' }}
          className={(show ? 'animate__fadeInUp' : 'animate__fadeOutUp') + ' bg-gray-700 px-2.5 py-2 cursor-pointer animate__animated animate__faster shadow-2xl'}>
          <div className='text-center'>
            <div className='w-10 text-xl text-gray-100' title={locale.POST.TOP} ><i className='fa fa-arrow-up'/> </div>
            {showPercent && (<div className='w-10 text-xs text-gray-100 dark:text-gray-200 text-center'>&nbsp;{percent}%</div>)}
          </div>
        </div>
      </div>
    </div>

  )
}

export default JumpToTop
