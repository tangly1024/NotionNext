import { ArrowSmallRight } from '@/components/HeroIcons'
import { siteConfig } from '@/lib/config'
import { getLocaleConfig } from '@/lib/locale-config'
import { subscribeToNewsletter } from '@/lib/plugins/mailchimp'
import { trackCtaClick } from '@/lib/plugins/tracking'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { useState } from 'react'
import CONFIG from '../config'

export default function HomeCta() {
  const router = useRouter()
  const { locale } = router
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  if (!siteConfig('HEO_HOME_CTA_ENABLE', false, CONFIG)) {
    return null
  }

  const eyebrow = getLocaleConfig(
    siteConfig('HEO_HOME_CTA_EYEBROW', null, CONFIG),
    locale
  )
  const title = getLocaleConfig(
    siteConfig('HEO_HOME_CTA_TITLE', null, CONFIG),
    locale
  )
  const description = getLocaleConfig(
    siteConfig('HEO_HOME_CTA_DESCRIPTION', null, CONFIG),
    locale
  )
  const placeholder = getLocaleConfig(
    siteConfig('HEO_HOME_CTA_PLACEHOLDER', null, CONFIG),
    locale
  )
  const buttonText = getLocaleConfig(
    siteConfig('HEO_HOME_CTA_BUTTON_TEXT', null, CONFIG),
    locale
  )
  const successMessage = getLocaleConfig(
    siteConfig('HEO_HOME_CTA_SUCCESS', null, CONFIG),
    locale
  )
  const fallbackMessage = getLocaleConfig(
    siteConfig('HEO_HOME_CTA_ERROR', null, CONFIG),
    locale
  )
  const secondaryText = getLocaleConfig(
    siteConfig('HEO_HOME_CTA_SECONDARY_TEXT', null, CONFIG),
    locale
  )
  const secondaryUrl = getLocaleConfig(
    siteConfig('HEO_HOME_CTA_SECONDARY_URL', null, CONFIG),
    locale
  )
  const note = getLocaleConfig(
    siteConfig('HEO_HOME_CTA_NOTE', null, CONFIG),
    locale
  )

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email || status === 'loading' || status === 'success') {
      return
    }

    setStatus('loading')
    setMessage('')
    trackCtaClick({
      location: 'heo_home_cta',
      label: 'subscribe_submit'
    })

    try {
      const response = await subscribeToNewsletter({
        email,
        locale: locale || 'zh-CN',
        source: 'heo_home_cta',
        pageUrl:
          typeof window !== 'undefined' ? window.location.href : '',
        referrer:
          typeof document !== 'undefined' ? document.referrer : ''
      })
      if (response?.status !== 'success') {
        throw new Error(response?.message || 'Subscription failed')
      }
      setStatus('success')
      setMessage(
        response?.user_notified === false &&
          response?.stored_in_notion === true
          ? `${successMessage}（已记录，确认邮件暂未发送）`
          : successMessage
      )
      setEmail('')
    } catch (error) {
      setStatus('error')
      setMessage(error?.message || fallbackMessage)
    }
  }

  function handleFormSubmit(e) {
    void handleSubmit(e)
  }

  return (
    <section className='px-5 mt-2 mb-8'>
      <div className='max-w-[86rem] mx-auto'>
        <div className='relative overflow-hidden rounded-[28px] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.28),_transparent_28%),linear-gradient(135deg,_#0f172a,_#1e293b_48%,_#0f766e)] px-6 py-7 shadow-[0_20px_80px_rgba(15,23,42,0.18)] dark:border-slate-700 sm:px-8 lg:px-10 lg:py-8'>
          <div className='absolute inset-y-0 right-0 hidden w-64 translate-x-16 rounded-full bg-cyan-300/10 blur-3xl lg:block' />
          <div className='relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between'>
            <div className='max-w-2xl text-white'>
              <div className='mb-3 inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-100'>
                {eyebrow}
              </div>
              <h2 className='text-2xl font-bold leading-tight sm:text-3xl lg:text-[2.1rem]'>
                {title}
              </h2>
              <p className='mt-3 max-w-xl text-sm leading-6 text-slate-200 sm:text-[15px]'>
                {description}
              </p>
            </div>

            <form
              onSubmit={handleFormSubmit}
              className='relative z-10 w-full max-w-xl rounded-[24px] border border-white/15 bg-white/10 p-4 backdrop-blur-md'>
              <div className='flex flex-col gap-3 sm:flex-row'>
                <input
                  type='email'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={placeholder}
                  aria-label={placeholder}
                  disabled={status === 'loading' || status === 'success'}
                  className='h-12 w-full rounded-2xl border border-white/15 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-70'
                  required
                />
                <button
                  type='submit'
                  disabled={status === 'loading' || status === 'success'}
                  className='inline-flex h-12 items-center justify-center rounded-2xl bg-cyan-400 px-5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-emerald-400 sm:min-w-[152px]'>
                  {status === 'loading'
                    ? '...'
                    : status === 'success'
                      ? 'Subscribed'
                      : buttonText}
                </button>
              </div>

              <div className='mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                <p
                  className={`text-xs ${
                    status === 'error'
                      ? 'text-rose-200'
                      : status === 'success'
                        ? 'text-emerald-200'
                        : 'text-slate-300'
                  }`}>
                  {message || note}
                </p>

                {secondaryUrl ? (
                  <SmartLink
                    href={secondaryUrl}
                    onClick={() =>
                      trackCtaClick({
                        location: 'heo_home_cta',
                        label: 'secondary_link'
                      })}
                    className='inline-flex items-center text-sm font-medium text-white/90 transition hover:text-white'>
                    {secondaryText}
                    <ArrowSmallRight className='ml-1 h-4 w-4 stroke-2' />
                  </SmartLink>
                ) : null}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
