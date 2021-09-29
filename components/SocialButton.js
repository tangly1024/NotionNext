import React from 'react'

const SocialButton = () => {
  return <>
    <div className='space-x-3 text-2xl text-gray-500 dark:text-gray-400'>
      <a className='fa fa-github' target='_blank' rel='noreferrer' title={'github'}
         href={'https://github.com/tangly1024'} />
      <a className='fa fa-twitter' target='_blank' rel='noreferrer' title={'twitter'}
         href={'https://twitter.com/troy1024_1'} />
      <a className='fa fa-telegram' href={'https://t.me/tangly_1024'} title={'telegram'} />
      <a className='fa fa-weibo' target='_blank' rel='noreferrer' title={'weibo'}
         href={'http://weibo.com/tangly1024'} />
    </div>
  </>
}
export default SocialButton
