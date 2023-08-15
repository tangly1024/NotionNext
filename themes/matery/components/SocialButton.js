import BLOG from '@/blog.config'
import React, { useState } from 'react'

/**
 * 社交联系方式按钮组 可折叠的组件
 * @returns {JSX.Element}
 * @constructor
 */
const SocialButton = () => {
  const [show, setShow] = useState(false)
  const toggleShow = () => {
    setShow(!show)
  }

  return <div className='flex flex-col transform hover:scale-105 duration-200 text-white text-center bg-indigo-700 rounded-full dark:bg-black cursor-pointer py-2.5'>
        {!show && <i onClick={toggleShow} className='transform hover:scale-125 duration-150 fas fa-user py-0.5' />}
        {show && <>
            {BLOG.CONTACT_GITHUB && <a target='_blank' rel='noreferrer' title={'github'} href={BLOG.CONTACT_GITHUB} >
                <i className='transform hover:scale-125 duration-150 fab fa-github ' />
            </a>}
            {BLOG.CONTACT_TWITTER && <a target='_blank' rel='noreferrer' title={'twitter'} href={BLOG.CONTACT_TWITTER} >
                <i className='transform hover:scale-125 duration-150 fab fa-twitter ' />
            </a>}
            {BLOG.CONTACT_TELEGRAM && <a target='_blank' rel='noreferrer' href={BLOG.CONTACT_TELEGRAM} title={'telegram'} >
                <i className='transform hover:scale-125 duration-150 fab fa-telegram ' />
            </a>}
            {BLOG.CONTACT_LINKEDIN && <a target='_blank' rel='noreferrer' href={BLOG.CONTACT_LINKEDIN} title={'linkIn'} >
                <i className='transform hover:scale-125 duration-150 fab fa-linkedin ' />
            </a>}
            {BLOG.CONTACT_WEIBO && <a target='_blank' rel='noreferrer' title={'weibo'} href={BLOG.CONTACT_WEIBO} >
                <i className='transform hover:scale-125 duration-150 fab fa-weibo ' />
            </a>}
            {BLOG.CONTACT_INSTAGRAM && <a target='_blank' rel='noreferrer' title={'instagram'} href={BLOG.CONTACT_INSTAGRAM} >
                <i className='transform hover:scale-125 duration-150 fab fa-instagram ' />
            </a>}
            {BLOG.CONTACT_EMAIL && <a target='_blank' rel='noreferrer' title={'email'} href={`mailto:${BLOG.CONTACT_EMAIL}`} >
                <i className='transform hover:scale-125 duration-150 fas fa-envelope ' />
            </a>}
            {JSON.parse(BLOG.ENABLE_RSS) && <a target='_blank' rel='noreferrer' title={'RSS'} href={'/feed'} >
                <i className='transform hover:scale-125 duration-150 fas fa-rss ' />
            </a>}
            {BLOG.CONTACT_BILIBILI && <a target='_blank' rel='noreferrer' title={'bilibili'} href={BLOG.CONTACT_BILIBILI} >
                <i className='fab fa-bilibili transform hover:scale-125 duration-150'/>
            </a>}
            {BLOG.CONTACT_YOUTUBE && <a target='_blank' rel='noreferrer' title={'youtube'} href={BLOG.CONTACT_YOUTUBE} >
                <i className='fab fa-youtube transform hover:scale-125 duration-150'/>
            </a>}
            <i onClick={toggleShow} className='transform hover:scale-125 duration-150 fas fa-close ' />

        </>}
    </div>
}
export default SocialButton
