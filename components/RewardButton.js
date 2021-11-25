import React from 'react'

/**
 * 赞赏按钮
 * @returns {JSX.Element}
 * @constructor
 */
const   RewardButton = () => {
  const [popoverShow, setPopoverShow] = React.useState(false)
  const btnRef = React.createRef()

  const openPopover = () => {
    setPopoverShow(true)
  }
  const closePopover = () => {
    setPopoverShow(false)
  }
  return (
    <div onMouseEnter={openPopover} onMouseLeave={closePopover}>
      <div className='bg-red-500 w-36 mx-auto animate__jello text-white hover:bg-green-400 duration-200 transform hover:scale-110 px-3 py-2 rounded cursor-pointer'>
          <span className='fa fa-qrcode mr-2' />
          <span>打赏一杯咖啡</span>
      </div>

      <div className={ `${(popoverShow ? ' block ' : ' hidden ')} transform block z-50 font-normal`}>
        <div
          className='flex space-x-10 animate__animated animate__fadeIn duration-200 my-5 px-5 py-6 justify-center bg-white dark:bg-black dark:text-gray-200'>
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
