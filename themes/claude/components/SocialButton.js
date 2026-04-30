import { siteConfig } from '@/lib/config'

/**
 * 社交联系方式 — Claude Docs 风格
 * 小图标水平行，含 padding 防止 hover 溢出
 */
const SocialButton = () => {
  return (
    <div className='claude-social-row flex-wrap'>
      {siteConfig('CONTACT_GITHUB') && (
        <a target='_blank' rel='noreferrer' title='GitHub' href={siteConfig('CONTACT_GITHUB')}>
          <i className='fab fa-github' />
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
      {siteConfig('CONTACT_EMAIL') && (
        <a target='_blank' rel='noreferrer' title='Email' href={`mailto:${siteConfig('CONTACT_EMAIL')}`}>
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
