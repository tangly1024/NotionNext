import { siteConfig } from '@/lib/config'
import { useRef, useState } from 'react'
import { handleEmailClick } from '@/lib/plugins/mailEncrypt'

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

  const CONTACT_GITHUB = siteConfig('CONTACT_GITHUB')
  const CONTACT_TWITTER = siteConfig('CONTACT_TWITTER')
  const CONTACT_TELEGRAM = siteConfig('CONTACT_TELEGRAM')
  const CONTACT_LINKEDIN = siteConfig('CONTACT_LINKEDIN')
  const CONTACT_WEIBO = siteConfig('CONTACT_WEIBO')
  const CONTACT_INSTAGRAM = siteConfig('CONTACT_INSTAGRAM')
  const CONTACT_EMAIL = siteConfig('CONTACT_EMAIL')
  const ENABLE_RSS = siteConfig('ENABLE_RSS')
  const CONTACT_BILIBILI = siteConfig('CONTACT_BILIBILI')
  const CONTACT_YOUTUBE = siteConfig('CONTACT_YOUTUBE')

  const emailIcon = useRef(null)


  return (
    <div className='flex flex-col transform hover:scale-105 duration-200 text-white text-center bg-indigo-700 rounded-full dark:bg-black cursor-pointer py-2.5'>
      {!show && (
        <i
          onClick={toggleShow}
          className='transform hover:scale-125 duration-150 fas fa-user py-0.5'
        />
      )}
      {show && (
        <>
          {CONTACT_GITHUB && (
            <a
              target='_blank'
              rel='noreferrer'
              title={'github'}
              href={CONTACT_GITHUB}>
              <i className='transform hover:scale-125 duration-150 fab fa-github ' />
            </a>
          )}
          {CONTACT_TWITTER && (
            <a
              target='_blank'
              rel='noreferrer'
              title={'twitter'}
              href={CONTACT_TWITTER}>
              <i className='transform hover:scale-125 duration-150 fab fa-twitter ' />
            </a>
          )}
          {CONTACT_TELEGRAM && (
            <a
              target='_blank'
              rel='noreferrer'
              href={CONTACT_TELEGRAM}
              title={'telegram'}>
              <i className='transform hover:scale-125 duration-150 fab fa-telegram ' />
            </a>
          )}
          {CONTACT_LINKEDIN && (
            <a
              target='_blank'
              rel='noreferrer'
              href={CONTACT_LINKEDIN}
              title={'linkIn'}>
              <i className='transform hover:scale-125 duration-150 fab fa-linkedin ' />
            </a>
          )}
          {CONTACT_WEIBO && (
            <a
              target='_blank'
              rel='noreferrer'
              title={'weibo'}
              href={CONTACT_WEIBO}>
              <i className='transform hover:scale-125 duration-150 fab fa-weibo ' />
            </a>
          )}
          {CONTACT_INSTAGRAM && (
            <a
              target='_blank'
              rel='noreferrer'
              title={'instagram'}
              href={CONTACT_INSTAGRAM}>
              <i className='transform hover:scale-125 duration-150 fab fa-instagram ' />
            </a>
          )}
          {CONTACT_EMAIL && (
            <a
              onClick={e => handleEmailClick(e, emailIcon, CONTACT_EMAIL)}
              title='email'
              className='cursor-pointer'
              ref={emailIcon}>
              <i className='transform hover:scale-125 duration-150 fas fa-envelope ' />
            </a>
          )}
          {ENABLE_RSS && (
            <a
              target='_blank'
              rel='noreferrer'
              title={'RSS'}
              href={'/rss/feed.xml'}>
              <i className='transform hover:scale-125 duration-150 fas fa-rss ' />
            </a>
          )}
          {CONTACT_BILIBILI && (
            <a
              target='_blank'
              rel='noreferrer'
              title={'bilibili'}
              href={CONTACT_BILIBILI}>
              <i className='fab fa-bilibili transform hover:scale-125 duration-150' />
            </a>
          )}
          {CONTACT_YOUTUBE && (
            <a
              target='_blank'
              rel='noreferrer'
              title={'youtube'}
              href={CONTACT_YOUTUBE}>
              <i className='fab fa-youtube transform hover:scale-125 duration-150' />
            </a>
          )}
          <i
            onClick={toggleShow}
            className='transform hover:scale-125 duration-150 fas fa-close '
          />
        </>
      )}
    </div>
  )
}
export default SocialButton
