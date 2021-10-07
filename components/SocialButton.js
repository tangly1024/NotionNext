import React from 'react'

const SocialButton = () => {
  return <>
    <div className='space-x-3 text-2xl text-gray-500 dark:text-gray-400'>
      <a target='_blank' rel='noreferrer' title={'github'}
          href={'https://github.com/tangly1024'} >
        <div className='fa fa-github transform hover:scale-125 duration-150'/>
      </a>
      <a target='_blank' rel='noreferrer' title={'twitter'}
         href={'https://twitter.com/troy1024_1'} >
        <div className='fa fa-twitter transform hover:scale-125 duration-150'/>
      </a>
      <a href={'https://t.me/tangly_1024'} title={'telegram'} >
        <div className='fa fa-telegram transform hover:scale-125 duration-150'/>
      </a>
      <a target='_blank' rel='noreferrer' title={'weibo'}
         href={'https://weibo.com/tangly1024'} >
        <div className='fa fa-weibo transform hover:scale-125 duration-150'/>
      </a>
    </div>
  </>
}
export default SocialButton
