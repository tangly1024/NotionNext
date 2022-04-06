import React, { useEffect } from 'react'
import CONFIG_HEXO from '../config_hexo'
let wrapperTop = 0

/**
 * 跳转到评论区
 * @returns {JSX.Element}
 * @constructor
 */
const JumpToCommentButton = () => {
  if (!CONFIG_HEXO.WIDGET_TO_COMMENT) {
    return <></>
  }

  function updateHeaderHeight() {
    setTimeout(() => {
      if (window) {
        const wrapperElement = document.getElementById('comment')
        wrapperTop = wrapperElement?.offsetTop
      }
    }, 500)
  }
  function navToComment() {
    window.scrollTo({ top: wrapperTop, behavior: 'smooth' })
    // 兼容性不好
    // const commentElement = document.getElementById('comment')
    // if (commentElement) {
    // commentElement?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
  }

  useEffect(() => {
    updateHeaderHeight()
  })

  return (<div className='flex space-x-1 items-center justify-center transform hover:scale-105 duration-200 w-7 h-7 text-center' onClick={navToComment} >
    <i className='fas fa-comment text-xs' />
  </div>)
}

export default JumpToCommentButton
