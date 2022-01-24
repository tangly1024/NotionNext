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
  return <div className='w-full justify-center flex-wrap flex'>
    <div className='space-x-3 text-xl text-gray-600 dark:text-gray-400 '>
      {BLOG.CONTACT_GITHUB && <a target='_blank' rel='noreferrer' title={'github'} href={BLOG.CONTACT_GITHUB} >
        <FontAwesomeIcon icon={faGithub} className='transform hover:scale-125 duration-150'/>
      </a>}
      {BLOG.CONTACT_TWITTER && <a target='_blank' rel='noreferrer' title={'twitter'} href={BLOG.CONTACT_TWITTER} >
        <FontAwesomeIcon icon={faTwitter} className='transform hover:scale-125 duration-150'/>
      </a>}
      {BLOG.CONTACT_TELEGRAM && <a target='_blank' rel='noreferrer' href={BLOG.CONTACT_TELEGRAM} title={'telegram'} >
        <FontAwesomeIcon icon={faTelegram} className='transform hover:scale-125 duration-150'/>
      </a>}
      {BLOG.CONTACT_WEIBO && <a target='_blank' rel='noreferrer' title={'weibo'} href={BLOG.CONTACT_WEIBO} >
        <FontAwesomeIcon icon={faWeibo} className='transform hover:scale-125 duration-150'/>
      </a>}
      {BLOG.CONTACT_EMAIL && <a target='_blank' rel='noreferrer' title={'email'} href={`mailto:${BLOG.CONTACT_EMAIL}`} >
        <FontAwesomeIcon icon={faEnvelope} className='transform hover:scale-125 duration-150'/>
      </a>}
      <a target='_blank' rel='noreferrer' title={'RSS'} href={'/feed'} >
        <FontAwesomeIcon icon={faRss} className='transform hover:scale-125 duration-150'/>
      </a>
    </div>
  </div>
}
export default SocialButton
