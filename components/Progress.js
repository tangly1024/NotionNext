import React, { useCallback, useEffect, useState } from 'react'
import throttle from 'lodash.throttle'

/**
 * 顶部页面阅读进度条
 * @returns {JSX.Element}
 * @constructor
 */
const Progress = ({ targetRef }) => {
  const [percent, changePercent] = useState(0)
  const scrollListener = () => {
    if (targetRef.current) {
      const clientHeight = targetRef ? (targetRef.current.clientHeight) : 0
      const scrollY = window.pageYOffset
      const fullHeight = clientHeight - window.outerHeight
      let per = parseFloat(((scrollY / fullHeight * 100)).toFixed(0))
      if (per > 100) per = 100
      changePercent(per)
    }
  }

  useEffect(() => {
    document.addEventListener('scroll', scrollListener)
    return () => document.removeEventListener('scroll', scrollListener)
  }, [percent])

  return (<div className='h-1.5 fixed left-0 top-0 w-full shadow-2xl z-40'>
        <div className='h-1 bg-blue-500 fixed left-0 top-0 duration-200 rounded' style={{ width: `${percent}%` }}/>
      </div>)
}

export default Progress
