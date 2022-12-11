import React from 'react'
import Image from 'next/image'

/**
 * 赞赏按钮
 * @returns {JSX.Element}
 * @constructor
 */
const RewardButton = () => {
  const openPopover = () => {
    document.getElementById('reward-qrcode').classList.remove('hidden')
  }
  const closePopover = () => {
    document.getElementById('reward-qrcode').classList.add('hidden')
  }
  return (
    <div className='justify-center'>
      <div onMouseEnter={openPopover} onMouseLeave={closePopover}
      className='bg-pink-500 py-2 w-36 mx-auto animate__jello text-white hover:bg-green-400 duration-200 transform hover:scale-110 px-3 rounded cursor-pointer'>
          <i className='mr-2 fas fa-qrcode' />
          <span>打赏一杯咖啡</span>
      </div>

      <div onMouseEnter={openPopover} onMouseLeave={closePopover} id='reward-qrcode' className='hidden flex space-x-10 animate__animated animate__fadeIn duration-200 my-5 px-5 mx-auto py-6 justify-center bg-white dark:bg-black dark:text-gray-200'>
           <div className='w-80'><Image width='auto' height='auto' layout='responsive' objectFit='fill' src='/reward_code_alipay.png' /></div>
           <div className='w-80'><Image width='auto' height='auto' layout='responsive' objectFit='fill' src='/reward_code_wechat.png' /></div>
      </div>
    </div>
  )
}
export default RewardButton
