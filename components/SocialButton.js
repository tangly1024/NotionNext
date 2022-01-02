import BLOG from '@/blog.config'
import { faGithub, faTelegram, faTwitter, faWeibo } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope, faRss } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

/**
 * 社交联系方式按钮组
 * @returns {JSX.Element}
 * @constructor
 */
const SocialButton = () => {
  return <div className='w-52 justify-center flex'>
    <div className='space-x-3 text-xl text-gray-600 dark:text-gray-400 px-6'>
      {BLOG.socialLink.github && <a target='_blank' rel='noreferrer' title={'github'} href={BLOG.socialLink.github} >
        <FontAwesomeIcon icon={faGithub} className='transform hover:scale-125 duration-150'/>
      </a>}
      {BLOG.socialLink.twitter && <a target='_blank' rel='noreferrer' title={'twitter'} href={BLOG.socialLink.twitter} >
        <FontAwesomeIcon icon={faTwitter} className='transform hover:scale-125 duration-150'/>
      </a>}
      {BLOG.socialLink.telegram && <a target='_blank' rel='noreferrer' href={BLOG.socialLink.telegram} title={'telegram'} >
        <FontAwesomeIcon icon={faTelegram} className='transform hover:scale-125 duration-150'/>
      </a>}
      {BLOG.socialLink.weibo && <a target='_blank' rel='noreferrer' title={'weibo'} href={BLOG.socialLink.weibo} >
        <FontAwesomeIcon icon={faWeibo} className='transform hover:scale-125 duration-150'/>
      </a>}
      {BLOG.email && <a target='_blank' rel='noreferrer' title={'email'} href={`mailto:${BLOG.email}`} >
        <FontAwesomeIcon icon={faEnvelope} className='transform hover:scale-125 duration-150'/>
      </a>}
      <a target='_blank' rel='noreferrer' title={'RSS'} href={'/feed'} >
        <FontAwesomeIcon icon={faRss} className='transform hover:scale-125 duration-150'/>
      </a>
    </div>
  </div>
}
export default SocialButton
