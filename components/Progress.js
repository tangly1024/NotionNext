import React, { useEffect, useState } from 'react'
import throttle from 'lodash.throttle'

/**
 * 顶部页面阅读进度条
 * @returns {JSX.Element}
 * @constructor
 */
const Progress = ({ targetRef }) => {
  const [percent, changePercent] = useState(0)
  useEffect(() => {
    const scrollListener = throttle(() => {
      if (targetRef.current) {
        const fullHeight = targetRef.current.clientHeight
        const per = parseFloat(((window.scrollY / (fullHeight - 100) * 100)).toFixed(0))
        changePercent(per)
      }
      // console.log('滚动信息', window.scrollY, fullHeight, per)
    }, 1)
    document.addEventListener('scroll', scrollListener)
    return () => document.removeEventListener('scroll', scrollListener)
  }, [percent])

  return (<div className='h-1.5 fixed top-0 w-full shadow-2xl z-40'>
        <div className='h-1 bg-blue-500 fixed top-0 w-1 duration-200' style={{ width: `${percent}%` }}/>
      </div>)
}

export default Progress
