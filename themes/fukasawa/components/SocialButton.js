import BLOG from '@/blog.config'
import React from 'react'

/**
 * 社交联系方式按钮组
 * @returns {JSX.Element}
 * @constructor
 */
const SocialButton = () => {
  return <div className='w-52 flex-wrap flex'>
    <div className='space-x-3 text-lg text-gray-500 dark:text-gray-400'>
      {BLOG.CONTACT_GITHUB && <a target='_blank' rel='noreferrer' title={'github'} href={BLOG.CONTACT_GITHUB} >
        <i className='fab fa-github transform hover:scale-125 duration-150'/>
      </a>}
      {BLOG.CONTACT_TWITTER && <a target='_blank' rel='noreferrer' title={'twitter'} href={BLOG.CONTACT_TWITTER} >
        <i className='fab fa-twitter transform hover:scale-125 duration-150'/>
      </a>}
      {BLOG.CONTACT_TELEGRAM && <a target='_blank' rel='noreferrer' href={BLOG.CONTACT_TELEGRAM} title={'telegram'} >
        <i className='fab fa-telegram transform hover:scale-125 duration-150'/>
      </a>}
      {BLOG.CONTACT_LINKEDIN && <a target='_blank' rel='noreferrer' href={BLOG.CONTACT_LINKEDIN} title={'linkedIn'} >
        <i className='fab fa-linkedin transform hover:scale-125 duration-150'/>
      </a>}
      {BLOG.CONTACT_WEIBO && <a target='_blank' rel='noreferrer' title={'weibo'} href={BLOG.CONTACT_WEIBO} >
        <i className='fab fa-weibo transform hover:scale-125 duration-150'/>
      </a>}
      {BLOG.CONTACT_INSTAGRAM && <a target='_blank' rel='noreferrer' title={'instagram'} href={BLOG.CONTACT_INSTAGRAM} >
        <i className='fab fa-instagram transform hover:scale-125 duration-150'/>
      </a>}
      {BLOG.CONTACT_EMAIL && <a target='_blank' rel='noreferrer' title={'email'} href={`mailto:${BLOG.CONTACT_EMAIL}`} >
        <i className='fas fa-envelope transform hover:scale-125 duration-150'/>
      </a>}
      {JSON.parse(BLOG.ENABLE_RSS) && <a target='_blank' rel='noreferrer' title={'RSS'} href={'/feed'} >
        <i className='fas fa-rss transform hover:scale-125 duration-150'/>
      </a>}
      {BLOG.CONTACT_BILIBILI && <a target='_blank' rel='noreferrer' title={'bilibili'} href={BLOG.CONTACT_BILIBILI} >
        <i className='fab fa-bilibili transform hover:scale-125 duration-150'/>
      </a>}
      {BLOG.CONTACT_YOUTUBE && <a target='_blank' rel='noreferrer' title={'youtube'} href={BLOG.CONTACT_YOUTUBE} >
        <i className='fab fa-youtube transform hover:scale-125 duration-150'/>
      </a>}
    </div>
  </div>
}
export default SocialButton
