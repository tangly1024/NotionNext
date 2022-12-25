import React from 'react'
import CONFIG_MATERY from '../config_matery'

/**
 * 跳转到评论区
 * @returns {JSX.Element}
 * @constructor
 */
const JumpToCommentButton = () => {
  if (!CONFIG_MATERY.WIDGET_TO_COMMENT) {
    return <></>
  }

  function navToComment() {
    if (document.getElementById('comment')) {
      window.scrollTo({ top: document.getElementById('comment').offsetTop, behavior: 'smooth' })
    }
  }

  return (<div
        onClick={navToComment}
        className='flex space-x-1 items-center justify-center cursor-pointer transform hover:scale-105 duration-200 w-7 h-7 text-center'>
        <i className='fas fa-comments text-xl text-white bg-indigo-700 py-3 px-2 rounded-full' />
    </div>)
}

export default JumpToCommentButton
