import React, { useEffect, useState } from 'react'
import { useGlobal } from '@/lib/global'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faListOl } from '@fortawesome/free-solid-svg-icons'

let windowTop = 0
/**
 * 点击召唤目录抽屉
 * 当屏幕下滑500像素后会出现该控件
 * @param props 父组件传入props
 * @returns {JSX.Element}
 * @constructor
 */
const TocDrawerButton = (props) => {
  const { locale } = useGlobal()
  const [show, switchShow] = useState(false)
  const scrollListener = () => {
    const scrollY = window.pageYOffset
    // const shouldShow = scrollY > 100 && scrollY < windowTop
    const shouldShow = scrollY > 100
    windowTop = scrollY

    if (shouldShow !== show) {
      switchShow(shouldShow)
    }
  }
  useEffect(() => {
    document.addEventListener('scroll', scrollListener)
    return () => document.removeEventListener('scroll', scrollListener)
  })

  return (
    <div id='toc-drawer-button' className='right-5 fixed bottom-60 duration-500 z-40'>
        <div onClick={props.onClick} className={(show ? 'animate__fadeInRight' : 'hidden') + ' py-3 px-3.5 animate__animated glassmorphism rounded-xl cursor-pointer shadow-card' }>
            <div className='dark:text-gray-200 text-center transform hover:scale-150 duration-200 text-xs' title={locale.POST.TOP} >
              <FontAwesomeIcon icon={faListOl} />
            </div>
        </div>
    </div>

  )
}

export default TocDrawerButton
