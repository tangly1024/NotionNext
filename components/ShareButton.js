import React from 'react'
import ShareBar from '@/components/ShareBar'

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
      <div className=' overflow-hidden '>
        <div
          className={
            (popoverShow ? ' block ' : ' hidden ') +
            ' duration-200 transform transition z-50 font-normal'
          }
        >
          <ShareBar post={post}/>
        </div>
        <div
          ref={btnRef}
          className='border dark:border-gray-600 dark:bg-black bg-white px-4 py-3 cursor-pointer text-md hover:bg-blue-500 transform duration-200 hover:text-white hover:shadow'>
          <div className='dark:text-gray-200 fa fa-share-alt' title='share' />
        </div>
      </div>
    </div>
  )
}

export default ShareButton
