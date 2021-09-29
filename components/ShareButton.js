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
        <div className={(popoverShow ? 'opacity-100' : 'opacity-0') + ' duration-200 ease-in-out transform font-normal'}>
          <ShareBar post={post}/>
        </div>
        <div ref={btnRef}
          className='border dark:border-gray-500 dark:bg-gray-600 bg-white px-4 py-3 cursor-pointer text-md transform duration-200'>
          <div className='dark:text-gray-200 fa fa-share-alt' title='share' />
        </div>
    </div>
  )
}

export default ShareButton
