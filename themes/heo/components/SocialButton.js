import { siteConfig } from '@/lib/config'
import { useRef } from 'react'
import { handleEmailClick } from '@/lib/plugins/mailEncrypt'

/**
 * 社交联系方式按钮组
 * @returns {JSX.Element}
 * @constructor
 */
const SocialButton = () => {
  const CONTACT_GITHUB = siteConfig('CONTACT_GITHUB')
  const CONTACT_ORCID = siteConfig('CONTACT_ORCID')
  const CONTACT_CSDN = siteConfig('CONTACT_CSDN')
  const CONTACT_JUEJIN = siteConfig('CONTACT_JUEJIN')
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
  const iconClass =
    'transform hover:scale-125 duration-150 dark:hover:text-[var(--heo-color-accent)] hover:text-[var(--heo-color-primary)]'

  return (
    <div className='w-full justify-center flex-wrap flex'>
      <div className='space-x-12 text-3xl text-gray-600 dark:text-gray-300 '>
        {CONTACT_GITHUB && (
          <a
            target='_blank'
            rel='noreferrer'
            title={'github'}
            href={CONTACT_GITHUB}>
            <i className={`${iconClass} fab fa-github`} />
          </a>
        )}
        {CONTACT_ORCID && (
          <a
            target='_blank'
            rel='noreferrer'
            title={'ORCID'}
            href={CONTACT_ORCID}>
            <i className={`${iconClass} fab fa-orcid`} />
          </a>
        )}
        {CONTACT_CSDN && (
          <a
            target='_blank'
            rel='noreferrer'
            title={'CSDN'}
            href={CONTACT_CSDN}>
            <i className={`${iconClass} fab fa-csdn`} />
          </a>
        )}
        {CONTACT_JUEJIN && (
          <a
            target='_blank'
            rel='noreferrer'
            title={'稀土掘金'}
            href={CONTACT_JUEJIN}>
            <i className={`${iconClass} fab fa-juejin`} />
          </a>
        )}
        {CONTACT_TWITTER && (
          <a
            target='_blank'
            rel='noreferrer'
            title={'twitter'}
            href={CONTACT_TWITTER}>
            <i className={`${iconClass} fab fa-twitter`} />
          </a>
        )}
        {CONTACT_TELEGRAM && (
          <a
            target='_blank'
            rel='noreferrer'
            href={CONTACT_TELEGRAM}
            title={'telegram'}>
            <i className={`${iconClass} fab fa-telegram`} />
          </a>
        )}
        {CONTACT_LINKEDIN && (
          <a
            target='_blank'
            rel='noreferrer'
            href={CONTACT_LINKEDIN}
            title={'linkIn'}>
            <i className={`${iconClass} fab fa-linkedin`} />
          </a>
        )}
        {CONTACT_WEIBO && (
          <a
            target='_blank'
            rel='noreferrer'
            title={'weibo'}
            href={CONTACT_WEIBO}>
            <i className={`${iconClass} fab fa-weibo`} />
          </a>
        )}
        {CONTACT_INSTAGRAM && (
          <a
            target='_blank'
            rel='noreferrer'
            title={'instagram'}
            href={CONTACT_INSTAGRAM}>
            <i className={`${iconClass} fab fa-instagram`} />
          </a>
        )}
        {CONTACT_EMAIL && (
          <a
            onClick={e => handleEmailClick(e, emailIcon, CONTACT_EMAIL)}
            title='email'
            className='cursor-pointer'
            ref={emailIcon}>
            <i className={`${iconClass} fas fa-envelope`} />
          </a>
        )}
        {ENABLE_RSS && (
          <a
            target='_blank'
            rel='noreferrer'
            title={'RSS'}
            href={'/rss/feed.xml'}>
            <i className={`${iconClass} fas fa-rss`} />
          </a>
        )}
        {CONTACT_BILIBILI && (
          <a
            target='_blank'
            rel='noreferrer'
            title={'bilibili'}
            href={CONTACT_BILIBILI}>
            <i className={`${iconClass} fab fa-bilibili`} />
          </a>
        )}
        {CONTACT_YOUTUBE && (
          <a
            target='_blank'
            rel='noreferrer'
            title={'youtube'}
            href={CONTACT_YOUTUBE}>
            <i className={`${iconClass} fab fa-youtube`} />
          </a>
        )}
      </div>
    </div>
  )
}
export default SocialButton
