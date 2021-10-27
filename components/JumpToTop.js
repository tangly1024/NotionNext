import React, { useCallback, useEffect, useState } from 'react'
import throttle from 'lodash.throttle'
import { useLocale } from '@/lib/locale'

/**
 * 跳转到网页顶部
 * 当屏幕下滑500像素后会出现该控件
 * @param targetRef 关联高度的目标html标签
 * @param showPercent 是否显示百分比
 * @returns {JSX.Element}
 * @constructor
 */
const JumpToTop = ({ targetRef, showPercent = true }) => {
  const locale = useLocale()
  const [show, switchShow] = useState(false)
  const [percent, changePercent] = useState(0)
  const scrollListener = useCallback(throttle(() => {
    // 处理是否显示回到顶部按钮
    const clientHeight = targetRef ? (targetRef.current ? targetRef.current.clientHeight : 0) : 0
    const scrollY = window.pageYOffset
    const fullHeight = clientHeight - window.outerHeight
    const shouldShow = scrollY > 100
    console.log(clientHeight, scrollY, fullHeight, shouldShow)
    if (shouldShow !== show) {
      switchShow(shouldShow)
    }
    let per = parseFloat(((scrollY / fullHeight * 100)).toFixed(0))
    if (per > 100) per = 100
    changePercent(per)
  }, 100))
  useEffect(() => {
    document.addEventListener('scroll', scrollListener)
    return () => document.removeEventListener('scroll', scrollListener)
  }, [show])

  return (
    <div id='jump-to-top' className='right-0 space-x-2 fixed flex bottom-24 px-5 py-1 duration-500 z-20'>
      <div className='flex-wrap transform hover:scale-125 duration-200 '>
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{ backgroundColor: 'rgb(56, 144, 255)' }}
          className={(show ? 'animate__fadeInUp' : 'animate__fadeOutUp') + ' p-1 cursor-pointer rounded-full animate__animated animate__faster shadow-xl'}>
          <div className='text-center'>
            <div className='w-10 text-xl text-gray-100' title={locale.POST.TOP} ><i className='fa fa-arrow-up'/> </div>
            {showPercent && (<div className='w-10 text-xs text-gray-100 dark:text-gray-200 text-center'>{percent}%</div>)}
          </div>
        </div>
      </div>
    </div>

  )
}

export default JumpToTop
