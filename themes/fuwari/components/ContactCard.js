import FlipCard from '@/components/FlipCard'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

const ContactCard = () => {
  if (!siteConfig('FUWARI_WIDGET_CONTACT', true, CONFIG)) return null

  const title =
    siteConfig('FUWARI_CONTACT_TITLE', 'Contact', CONFIG) || 'Contact'
  const desc =
    siteConfig(
      'FUWARI_CONTACT_DESCRIPTION',
      'Join the community and discuss ideas.',
      CONFIG
    ) || ''
  const url = siteConfig('FUWARI_CONTACT_URL', '', CONFIG)
  const text = siteConfig('FUWARI_CONTACT_TEXT', 'Get in touch', CONFIG)
  const useFlip = siteConfig('FUWARI_CONTACT_FLIP_CARD', true, CONFIG)
  const openInNewTab = /^https?:\/\//i.test(url)

  const jumpToContact = () => {
    if (!url) return
    if (openInNewTab) {
      window.open(url, '_blank', 'noopener,noreferrer')
      return
    }
    window.location.href = url
  }

  const frontContent = (
    <div className='fuwari-card p-5 h-full'>
      <h3 className='text-sm font-semibold mb-2 tracking-wide uppercase text-[var(--fuwari-muted)]'>
        {title}
      </h3>
      {desc && <p className='text-sm leading-6 text-[var(--fuwari-muted)] mb-3'>{desc}</p>}
      {url && <p className='fuwari-link text-sm font-medium'>{text} →</p>}
    </div>
  )

  const backContent = (
    <div className='fuwari-card p-5 h-full bg-[var(--fuwari-bg-soft)]'>
      <h4 className='text-base font-semibold mb-2'>
        {siteConfig('FUWARI_CONTACT_BACK_TITLE', 'Keep in touch', CONFIG)}
      </h4>
      <p className='text-sm text-[var(--fuwari-muted)] leading-6 mb-3'>
        {siteConfig(
          'FUWARI_CONTACT_BACK_DESCRIPTION',
          'Share your ideas, collaboration, and feedback anytime.',
          CONFIG
        )}
      </p>
      {url && (
        <p className='fuwari-link text-sm font-medium'>
          {siteConfig('FUWARI_CONTACT_BACK_TEXT', 'Open Contact', CONFIG)} →
        </p>
      )}
    </div>
  )

  if (!useFlip) {
    return (
      <section
        className={url ? 'cursor-pointer' : ''}
        onClick={jumpToContact}
        role={url ? 'link' : undefined}
        tabIndex={url ? 0 : undefined}
        onKeyDown={e => {
          if (url && (e.key === 'Enter' || e.key === ' ')) jumpToContact()
        }}>
        {frontContent}
      </section>
    )
  }

  return (
    <section
      className={`h-48 ${url ? 'cursor-pointer' : ''}`}
      onClick={jumpToContact}
      role={url ? 'link' : undefined}
      tabIndex={url ? 0 : undefined}
      onKeyDown={e => {
        if (url && (e.key === 'Enter' || e.key === ' ')) jumpToContact()
      }}>
      <FlipCard frontContent={frontContent} backContent={backContent} />
    </section>
  )
}

export default ContactCard

