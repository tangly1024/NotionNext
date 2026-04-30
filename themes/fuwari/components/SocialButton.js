import { siteConfig } from '@/lib/config'

const SocialButton = () => {
  const enableRSS = siteConfig('ENABLE_RSS')
  const links = [
    { key: 'CONTACT_TWITTER', icon: 'fab fa-twitter', label: 'Twitter' },
    { key: 'CONTACT_GITHUB', icon: 'fab fa-github', label: 'GitHub' },
    { key: 'CONTACT_TELEGRAM', icon: 'fab fa-telegram', label: 'Telegram' },
    { key: 'CONTACT_LINKEDIN', icon: 'fab fa-linkedin', label: 'LinkedIn' },
    { key: 'CONTACT_WEIBO', icon: 'fab fa-weibo', label: 'Weibo' },
    { key: 'CONTACT_INSTAGRAM', icon: 'fab fa-instagram', label: 'Instagram' },
    { key: 'CONTACT_BILIBILI', icon: 'iconfont icon-bilibili', label: 'Bilibili' },
    { key: 'CONTACT_YOUTUBE', icon: 'fab fa-youtube', label: 'YouTube' },
    { key: 'CONTACT_THREADS', icon: 'fab fa-threads', label: 'Threads' },
    { key: 'CONTACT_STEAM', icon: 'fab fa-steam', label: 'Steam' },
    { key: 'CONTACT_EMAIL', icon: 'fas fa-envelope', label: 'Email', isMail: true }
  ]

  const valid = links
    .map(item => ({ ...item, href: siteConfig(item.key) }))
    .filter(item => Boolean(item.href))

  const finalLinks = [...valid]
  if (enableRSS && !finalLinks.some(item => item.key === 'RSS_FEED')) {
    finalLinks.push({
      key: 'RSS_FEED',
      icon: 'fas fa-rss',
      label: 'RSS',
      href: '/rss/feed.xml'
    })
  }

  if (!finalLinks.length) return null

  return (
    <div className='flex items-center justify-center gap-2 flex-wrap'>
      {finalLinks.map(item => {
        const href = item.isMail ? `mailto:${item.href}` : item.href
        return (
          <a
            key={item.key}
            href={href}
            target={item.isMail ? undefined : '_blank'}
            rel={item.isMail ? undefined : 'noopener noreferrer'}
            aria-label={item.label}
            className='fuwari-social-btn'>
            <i className={item.icon} />
          </a>
        )
      })}
    </div>
  )
}

export default SocialButton

