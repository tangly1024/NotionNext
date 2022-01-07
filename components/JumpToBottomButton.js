import BLOG from '@/blog.config'
import { useGlobal } from '@/lib/global'
import { faArrowDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import smoothscroll from 'smoothscroll-polyfill'

/**
 * 跳转到网页顶部
 * 当屏幕下滑500像素后会出现该控件
 * @param targetRef 关联高度的目标html标签
 * @param showPercent 是否显示百分比
 * @returns {JSX.Element}
 * @constructor
 */
const JumpToBottomButton = ({ showPercent = false }) => {
  if (!BLOG.widget?.showToBottom) {
    return <></>
  }

  const { locale } = useGlobal()
  const [show, switchShow] = useState(false)
  const [percent, changePercent] = useState(0)
  const scrollListener = () => {
    const targetRef = document.getElementById('wrapper')
    const clientHeight = targetRef?.clientHeight
    const scrollY = window.pageYOffset
    const fullHeight = clientHeight - window.outerHeight
    let per = parseFloat(((scrollY / fullHeight * 100)).toFixed(0))
    if (per > 100) per = 100
    const shouldShow = scrollY > 100 && per > 0
    if (shouldShow !== show) {
      switchShow(shouldShow)
    }
    changePercent(per)
  }

  function scrollToBottom () {
    const targetRef = document.getElementById('wrapper')
    window.scrollTo({ top: targetRef.clientHeight, behavior: 'smooth' })
  }

  useEffect(() => {
    smoothscroll.polyfill()

    document.addEventListener('scroll', scrollListener)
    return () => document.removeEventListener('scroll', scrollListener)
  }, [show])

  return (<div id='jump-to-top' className='right-1 fixed flex bottom-36 z-20'>
      <div onClick={() => scrollToBottom()}
        className={(show ? '' : 'hidden') + ' animate__fadeInRight duration-500 animate__animated animate__faster glassmorphism flex justify-center items-center w-8 h-8 cursor-pointer '}>
        <div className='dark:text-gray-200 transform hover:scale-150 text-xs duration-200' title={locale.POST.TOP} >
          <FontAwesomeIcon icon={faArrowDown} />
        </div>
          {showPercent && (<div className='w-10 text-xs dark:text-gray-200'>{percent}</div>)}
      </div>
    </div>)
}

export default JumpToBottomButton
