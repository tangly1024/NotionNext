import React from 'react'
import Image from 'next/image'
import Router from 'next/router'

/**
 * 赞赏按钮
 * @returns {JSX.Element}
 * @constructor
 */
const RewardaButton = () => {

  return (
    <div className='justify-center'>
      <div className='flex space-x-1 items-center transform hover:scale-105 duration-200 py-2 px-3' onClick={() => { Router.push('/reward') }}>
          <div className='dark:text-gray-200'>
          <i className='mr-2 fas fa-mug-hot' />
          </div>
      </div>

    </div>
  )
}
export default RewardaButton
