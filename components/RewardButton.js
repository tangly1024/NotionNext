import React from 'react'

/**
 * 赞赏按钮
 * @returns {JSX.Element}
 * @constructor
 */
const RewardButton = () => {
  const openPopover = () => {
    if (window) {
      document.getElementById('reward-qrcode').classList.remove('hidden')
    }
  }
  const closePopover = () => {
    if (window) {
      document.getElementById('reward-qrcode').classList.add('hidden')
    }
  }
  return (
    <div onMouseEnter={openPopover} onMouseLeave={closePopover} className='justify-center py-10'>
      <div className='bg-red-500 w-36 mx-auto animate__jello text-white hover:bg-green-400 duration-200 transform hover:scale-110 px-3 py-2 rounded cursor-pointer'>
          <span className='fa fa-qrcode mr-2' />
          <span>打赏一杯咖啡</span>
      </div>

      <div id='reward-qrcode' className='hidden flex space-x-10 animate__animated animate__fadeIn duration-200 my-5 px-5 mx-auto py-6 justify-center bg-white dark:bg-black dark:text-gray-200'>
           <img className='md:w-72' src='/reward_code_alipay.png' />
           <img className='md:w-72' src='/reward_code_wechat.png' />
      </div>
    </div>
  )
}
export default RewardButton
