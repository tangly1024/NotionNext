import { faGithub, faTelegram, faTwitter, faWeibo } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

/**
 * 社交联系方式按钮组
 * @returns {JSX.Element}
 * @constructor
 */
const SocialButton = () => {
  return <div className='w-52'>
    <div className='space-x-3 text-xl text-gray-600 dark:text-gray-400 px-6'>
      <a target='_blank' rel='noreferrer' title={'github'} href={'https://github.com/tangly1024'} >
        <FontAwesomeIcon icon={faGithub} className='transform hover:scale-125 duration-150'/>
      </a>
      <a target='_blank' rel='noreferrer' title={'twitter'} href={'https://twitter.com/troy1024_1'} >
        <FontAwesomeIcon icon={faTwitter} className='transform hover:scale-125 duration-150'/>
      </a>
      <a target='_blank' rel='noreferrer' href={'https://t.me/tangly_1024'} title={'telegram'} >
        <FontAwesomeIcon icon={faTelegram} className='transform hover:scale-125 duration-150'/>
      </a>
      <a target='_blank' rel='noreferrer' title={'weibo'} href={'https://weibo.com/tangly1024'} >
        <FontAwesomeIcon icon={faWeibo} className='transform hover:scale-125 duration-150'/>
      </a>
    </div>
  </div>
}
export default SocialButton
