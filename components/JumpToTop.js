import React, { useEffect, useState } from 'react'
import throttle from 'lodash.throttle'
import { useLocale } from '@/lib/locale'

/**
 * 跳转到网页顶部
 * 当屏幕下滑500像素后会出现该控件
 * @returns {JSX.Element}
 * @constructor
 */
const JumpToTop = () => {
  const locale = useLocale()

  const [show, switchShow] = useState(false)
  useEffect(() => {
    const scrollListener = throttle(() => {
      // 处理是否显示回到顶部按钮
      const shouldShow = window.scrollY > 100
      if (shouldShow !== show) {
        switchShow(shouldShow)
      }
    }, 500)
    document.addEventListener('scroll', scrollListener)
    return () => document.removeEventListener('scroll', scrollListener)
  }, [show])

  return (
    <div
      className={(show ? 'animate__fadeInUp' : 'animate__fadeOutUp') + ' animate__animated animate__faster'}>
      <div
        className='border dark:border-gray-500 dark:bg-gray-600 bg-white cursor-pointer hover:shadow-2xl'
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <a className='dark:text-gray-200 fa fa-arrow-up p-4 transform hover:scale-150 duration-200' title={locale.POST.TOP}/>
      </div>
    </div>

  )
}

export default JumpToTop
