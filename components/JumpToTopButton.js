import React, { useEffect, useState } from 'react'
import { useGlobal } from '@/lib/global'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons'
let windowTop = 0

/**
 * 跳转到网页顶部
 * 当屏幕下滑500像素后会出现该控件
 * @param targetRef 关联高度的目标html标签
 * @param showPercent 是否显示百分比
 * @returns {JSX.Element}
 * @constructor
 */
const JumpToTopButton = ({ targetRef, showPercent = true }) => {
  const { locale } = useGlobal()
  const [show, switchShow] = useState(false)
  const [percent, changePercent] = useState(0)
  const scrollListener = () => {
    // 处理是否显示回到顶部按钮
    const clientHeight = targetRef ? (targetRef.current ? targetRef.current.clientHeight : 0) : 0
    const scrollY = window.pageYOffset
    const fullHeight = clientHeight - window.outerHeight
    let per = parseFloat(((scrollY / fullHeight * 100)).toFixed(0))
    if (per > 100) per = 100
    const shouldShow = scrollY > 100 && per > 0 && scrollY < windowTop
    windowTop = scrollY

    if (shouldShow !== show) {
      switchShow(shouldShow)
    }
    changePercent(per)
  }
  useEffect(() => {
    document.addEventListener('scroll', scrollListener)
    return () => document.removeEventListener('scroll', scrollListener)
  }, [show])

  return (<div id='jump-to-top' className='right-5 fixed flex bottom-36 duration-500 z-20'>
      <div onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={(show ? '' : 'hidden') + ' animate__fadeInRight rounded-full glassmorphism p-2 cursor-pointer animate__animated animate__faster shadow-card'}>
        <div className='text-center'>
          <div className='w-10 dark:text-gray-100 transform hover:scale-125 duration-200' title={locale.POST.TOP} >
            <FontAwesomeIcon icon={faArrowUp} />
          </div>
          {showPercent && (<div className='w-10 text-xs dark:text-gray-200'>{percent}</div>)}
        </div>
      </div>
    </div>)
}

export default JumpToTopButton
