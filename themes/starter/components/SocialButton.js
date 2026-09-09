import { starterConfig } from '../config'
import { useRef } from 'react'
import { handleEmailClick } from '@/lib/plugins/mailEncrypt'

/**
 * 社交联系方式按钮组
 * @returns {JSX.Element}
 * @constructor
 */
const SocialButton = () => {
  const CONTACT_GITHUB = starterConfig('CONTACT_GITHUB')
  const CONTACT_ORCID = starterConfig('CONTACT_ORCID')
  const CONTACT_CSDN = starterConfig('CONTACT_CSDN')
  const CONTACT_JUEJIN = starterConfig('CONTACT_JUEJIN')
  const CONTACT_TWITTER = starterConfig('CONTACT_TWITTER')
  const CONTACT_TELEGRAM = starterConfig('CONTACT_TELEGRAM')
  const CONTACT_LINKEDIN = starterConfig('CONTACT_LINKEDIN')
  const CONTACT_WEIBO = starterConfig('CONTACT_WEIBO')
  const CONTACT_INSTAGRAM = starterConfig('CONTACT_INSTAGRAM')
  const CONTACT_EMAIL = starterConfig('CONTACT_EMAIL')
  const ENABLE_RSS = starterConfig('ENABLE_RSS')
  const CONTACT_BILIBILI = starterConfig('CONTACT_BILIBILI')
  const CONTACT_YOUTUBE = starterConfig('CONTACT_YOUTUBE')

  const emailIcon = useRef(null)

  return (
    <div className='w-52 justify-center flex-wrap flex my-2'>
      <div className='space-x-5 md:text-xl text-3xl text-gray-600 dark:text-gray-400 text-center'>
        {CONTACT_GITHUB && (
          <a
            target='_blank'
            rel='noreferrer'
            title={'github'}
            href={CONTACT_GITHUB}>
            <i className='fab fa-github transform hover:scale-125 duration-150' />
          </a>
        )}
        {CONTACT_ORCID && (
          <a
            target='_blank'
            rel='noreferrer'
            title={'ORCID'}
            href={CONTACT_ORCID}>
            <i className='fab fa-orcid transform hover:scale-125 duration-150' />
          </a>
        )}
        {CONTACT_CSDN && (
          <a
            target='_blank'
            rel='noreferrer'
            title={'CSDN'}
            href={CONTACT_CSDN}>
            <i className='fab fa-csdn transform hover:scale-125 duration-150' />
          </a>
        )}
        {CONTACT_JUEJIN && (
          <a
            target='_blank'
            rel='noreferrer'
            title={'稀土掘金'}
            href={CONTACT_JUEJIN}>
            <i className='fab fa-juejin transform hover:scale-125 duration-150' />
          </a>
        )}
        {CONTACT_TWITTER && (
          <a
            target='_blank'
            rel='noreferrer'
            title={'twitter'}
            href={CONTACT_TWITTER}>
            <i className='fab fa-twitter transform hover:scale-125 duration-150' />
          </a>
        )}
        {CONTACT_TELEGRAM && (
          <a
            target='_blank'
            rel='noreferrer'
            href={CONTACT_TELEGRAM}
            title={'telegram'}>
            <i className='fab fa-telegram transform hover:scale-125 duration-150' />
          </a>
        )}
        {CONTACT_LINKEDIN && (
          <a
            target='_blank'
            rel='noreferrer'
            href={CONTACT_LINKEDIN}
            title={'linkedIn'}>
            <i className='fab fa-linkedin transform hover:scale-125 duration-150' />
          </a>
        )}
        {CONTACT_WEIBO && (
          <a
            target='_blank'
            rel='noreferrer'
            title={'weibo'}
            href={CONTACT_WEIBO}>
            <i className='fab fa-weibo transform hover:scale-125 duration-150' />
          </a>
        )}
        {CONTACT_INSTAGRAM && (
          <a
            target='_blank'
            rel='noreferrer'
            title={'instagram'}
            href={CONTACT_INSTAGRAM}>
            <i className='fab fa-instagram transform hover:scale-125 duration-150' />
          </a>
        )}
        {CONTACT_EMAIL && (
          <a
            onClick={e => handleEmailClick(e, emailIcon, CONTACT_EMAIL)}
            title='email'
            className='cursor-pointer'
            ref={emailIcon}>
            <i className='fas fa-envelope transform hover:scale-125 duration-150' />
          </a>
        )}
        {ENABLE_RSS && (
          <a
            target='_blank'
            rel='noreferrer'
            title={'RSS'}
            href={'/rss/feed.xml'}>
            <i className='fas fa-rss transform hover:scale-125 duration-150' />
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
      </div>
    </div>
  )
}
export default SocialButton
