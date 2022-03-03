import CommonHead from '@/components/CommonHead'
import { useEffect, useState } from 'react'

import Footer from './components/Footer'
import JumpToTopButton from './components/JumpToTopButton'
import SideRight from './components/SideRight'
import TopNav from './components/TopNav'
import smoothscroll from 'smoothscroll-polyfill'

/**
 * 基础布局 采用左右两侧布局，移动端使用顶部导航栏
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const LayoutBase = (props) => {
  const { children, headerSlot, floatSlot, meta } = props
  const [show, switchShow] = useState(false)
  const [percent, changePercent] = useState(0) // 页面阅读百分比

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
  useEffect(() => {
    smoothscroll.polyfill()
    document.addEventListener('scroll', scrollListener)
    return () => document.removeEventListener('scroll', scrollListener)
  }, [show])

  return (<div className='bg-white dark:bg-gray-900'>
    <CommonHead meta={meta} />
    <TopNav {...props}/>

    {headerSlot}

    <main id='wrapper' className='flex w-full justify-center py-8 min-h-screen'>

      <div id='container-inner' className='pt-14 w-full mx-auto flex justify-between space-x-4 max-w-7xl'>
        <div className='flex-grow w-full'>{children}</div>
        <SideRight {...props}/>
      </div>

    </main>

     {/* 右下角悬浮 */}
     <div className='right-8 bottom-12 lg:right-2 fixed justify-end z-20 font-sans'>
        <div className={(show ? 'animate__animated ' : 'hidden') + ' animate__fadeInUp rounded-md glassmorphism justify-center duration-500  animate__faster flex space-x-2 items-center cursor-pointer '}>
          <JumpToTopButton percent={percent}/>
          {floatSlot}
        </div>
      </div>

    <Footer title={meta.title}/>

  </div>)
}

export default LayoutBase
