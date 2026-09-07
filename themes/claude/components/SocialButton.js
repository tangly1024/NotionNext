import { siteConfig } from '@/lib/config'
import { handleEmailClick } from '@/lib/plugins/mailEncrypt'
import { useRef } from 'react'

/**
 * 社交联系方式 — Claude Docs 风格
 * 小图标水平行，含 padding 防止 hover 溢出
 */
const SocialButton = () => {
  const emailIcon = useRef(null)
  const CONTACT_EMAIL = siteConfig('CONTACT_EMAIL')

  return (
    <div className='claude-social-row flex-wrap'>
      {siteConfig('CONTACT_GITHUB') && (
        <a target='_blank' rel='noreferrer' title='GitHub' href={siteConfig('CONTACT_GITHUB')}>
          <i className='fab fa-github' />
        </a>
      )}
      {siteConfig('CONTACT_ORCID') && (
        <a target='_blank' rel='noreferrer' title='ORCID' href={siteConfig('CONTACT_ORCID')}>
          <i className='fab fa-orcid' />
        </a>
      )}
      {siteConfig('CONTACT_CSDN') && (
        <a target='_blank' rel='noreferrer' title='CSDN' href={siteConfig('CONTACT_CSDN')}>
          <i className='fab fa-csdn' />
        </a>
      )}
      {siteConfig('CONTACT_JUEJIN') && (
        <a target='_blank' rel='noreferrer' title='稀土掘金' href={siteConfig('CONTACT_JUEJIN')}>
          <i className='fab fa-juejin' />
        </a>
      )}
      {siteConfig('CONTACT_TWITTER') && (
        <a target='_blank' rel='noreferrer' title='Twitter' href={siteConfig('CONTACT_TWITTER')}>
          <i className='fab fa-twitter' />
        </a>
      )}
      {siteConfig('CONTACT_TELEGRAM') && (
        <a target='_blank' rel='noreferrer' title='Telegram' href={siteConfig('CONTACT_TELEGRAM')}>
          <i className='fab fa-telegram' />
        </a>
      )}
      {siteConfig('CONTACT_LINKEDIN') && (
        <a target='_blank' rel='noreferrer' title='LinkedIn' href={siteConfig('CONTACT_LINKEDIN')}>
          <i className='fab fa-linkedin' />
        </a>
      )}
      {siteConfig('CONTACT_WEIBO') && (
        <a target='_blank' rel='noreferrer' title='Weibo' href={siteConfig('CONTACT_WEIBO')}>
          <i className='fab fa-weibo' />
        </a>
      )}
      {siteConfig('CONTACT_INSTAGRAM') && (
        <a target='_blank' rel='noreferrer' title='Instagram' href={siteConfig('CONTACT_INSTAGRAM')}>
          <i className='fab fa-instagram' />
        </a>
      )}
      {CONTACT_EMAIL && (
        <a
          onClick={e => handleEmailClick(e, emailIcon, CONTACT_EMAIL)}
          title='Email'
          className='cursor-pointer'
          ref={emailIcon}>
          <i className='fas fa-envelope' />
        </a>
      )}
      {Boolean(siteConfig('ENABLE_RSS')) && (
        <a target='_blank' rel='noreferrer' title='RSS' href='/rss/feed.xml'>
          <i className='fas fa-rss' />
        </a>
      )}
      {siteConfig('CONTACT_BILIBILI') && (
        <a target='_blank' rel='noreferrer' title='Bilibili' href={siteConfig('CONTACT_BILIBILI')}>
          <i className='fab fa-bilibili' />
        </a>
      )}
      {siteConfig('CONTACT_YOUTUBE') && (
        <a target='_blank' rel='noreferrer' title='YouTube' href={siteConfig('CONTACT_YOUTUBE')}>
          <i className='fab fa-youtube' />
        </a>
      )}
      {siteConfig('CONTACT_THREADS') && (
        <a target='_blank' rel='noreferrer' title='Threads' href={siteConfig('CONTACT_THREADS')}>
          <i className='fab fa-threads' />
        </a>
      )}
    </div>
  )
}
export default SocialButton
