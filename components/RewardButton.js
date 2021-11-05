import React from 'react'
import { createPopper } from '@popperjs/core'

/**
 * 赞赏按钮
 * @returns {JSX.Element}
 * @constructor
 */
const RewardButton = () => {
  const [popoverShow, setPopoverShow] = React.useState(false)
  const btnRef = React.createRef()
  const popoverRef = React.createRef()

  const openPopover = () => {
    createPopper(btnRef.current, popoverRef.current, {
      placement: 'top'
    })
    setPopoverShow(true)
  }
  const closePopover = () => {
    setPopoverShow(false)
  }
  return (
    <div
      onMouseEnter={() => {
        openPopover()
      }}
      onMouseLeave={() => {
        closePopover()
      }}>
      <div className='animate__jello animate__animated animate__faster'>
        <div
          ref={btnRef}
          className='bg-red-500 text-white hover:bg-green-400 hover:shadow-2xl duration-200 transform hover:scale-110 px-3 py-2 rounded cursor-pointer'>
            <span className='fa fa-qrcode mr-2' />
            <span>打赏</span>
        </div>
      </div>

      <div
        className={
          (popoverShow ? 'animate__animated animate__fadeIn ' : ' hidden ') +
          ' animate__faster transform block z-50 font-normal'
        }
        ref={popoverRef}
      >
        <div
          className='flex space-x-10 animate__animated animate__fadeIn hover:shadow-2xl duration-200 my-5 px-5 py-6 justify-center bg-white dark:bg-black dark:text-gray-200'>
         <div>
            <img className='md:w-72 m-auto' src='/reward_code_alipay.png' />
          </div>
          <div>
            <img className='md:w-72 m-auto' src='/reward_code_wechat.png' />
          </div>
        </div>
      </div>
    </div>
  )
}
export default RewardButton
