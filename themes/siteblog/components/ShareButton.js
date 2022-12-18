import React from 'react'
import ShareBar from './ShareBar'

/**
 * 悬浮在屏幕右下角,分享按钮
 * @returns {JSX.Element}
 * @constructor
 */
const ShareButton = ({ post }) => {
  const [popoverShow, setPopoverShow] = React.useState(false)
  const btnRef = React.createRef()

  const openPopover = () => {
    setPopoverShow(true)
  }
  const closePopover = () => {
    setPopoverShow(false)
  }
  return (
    <div className='my-2'
         onMouseEnter={() => { openPopover() }}
         onMouseLeave={() => { closePopover() }}>
        <div className={(popoverShow ? 'opacity-100' : 'opacity-0') + ' duration-200 ease-in-out font-normal'}>
          <ShareBar post={post}/>
        </div>
        <div ref={btnRef}
          className='z-20 border dark:border-gray-500 dark:bg-gray-600 bg-white cursor-pointer text-md hover:shadow-2xl shadow-lg'>
          <i className='fas fa-share-alt-square transform duration-200 hover:scale-150 dark:text-gray-200 p-4' title='share' />
        </div>
    </div>
  )
}

export default ShareButton
