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
    const scrollY = window.pageYOffset
    const fullHeight = targetRef.current.clientHeight - window.outerHeight
    const shouldShow = scrollY > 100
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
    <div
      className={(show ? 'animate__fade InUp' : 'animate__fadeOutUp') + ' animate__animated animate__faster'}>
      <div
        className='border dark:border-gray-500 dark:bg-gray-600 bg-white cursor-pointer hover:shadow-2xl'
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        {showPercent && (
          <div className='absolute bg-white dark:text-gray-200 dark:bg-gray-600 z-20 hover:opacity-0 w-11 py-3 text-center'>
            {percent}%
          </div>
        )}
        <a className='dark:text-gray-200 fa fa-arrow-up p-4 transform hover:scale-150 duration-200'
           title={locale.POST.TOP} />
      </div>
    </div>

  )
}

export default JumpToTop
