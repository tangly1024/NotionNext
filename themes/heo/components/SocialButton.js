import { siteConfig } from '@/lib/config'
import { useEffect, useRef, useState } from 'react'
import { handleEmailClick } from '@/lib/plugins/mailEncrypt'

/**
 * 社交联系方式按钮组
 * @returns {JSX.Element}
 * @constructor
 */
const SocialButton = () => {
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
  const [showWechatQR, setShowWechatQR] = useState(false)
  const wechatWrapperRef = useRef(null)

  const emailIcon = useRef(null)

  useEffect(() => {
  if (!showWechatQR) return

  const handleClickOutside = (e) => {
    if (
      wechatWrapperRef.current &&
      !wechatWrapperRef.current.contains(e.target)
    ) {
      setShowWechatQR(false)
    }
  }

  document.addEventListener('click', handleClickOutside)
  return () => document.removeEventListener('click', handleClickOutside)
}, [showWechatQR])

  return (
    <div className='w-full justify-center flex-wrap flex'>
      <div className='space-x-8 text-3xl text-gray-600 dark:text-gray-300 '>
          <a
            target='_blank'
            rel='noreferrer'
            title='douyin'
            href='https://v.douyin.com/nDD4_ACPRiY'>
            <img
              src='https://p-pc-weboff.byteimg.com/tos-cn-i-9r5gewecjs/logo-horizontal-small.svg'
              alt='douyin'
              loading='lazy'
              decoding='async'
              className='inline-block transform hover:scale-125 duration-150 dark:hover:opacity-90 hover:opacity-90'
              style={{ width: '1em', height: '1em', verticalAlign: '-0.125em' }}
            />
          </a>
          <div
            ref={wechatWrapperRef}
            className='relative inline-flex'
            onPointerEnter={(e) => {
              if (e.pointerType === 'mouse') setShowWechatQR(true)
            }}
            onPointerLeave={(e) => {
              if (e.pointerType === 'mouse') setShowWechatQR(false)
            }}
          >
            <span
              className='cursor-pointer transform transition-transform duration-150 hover:scale-125'
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setShowWechatQR(v => !v)
              }}
            >
              <i className='fab fa-weixin dark:hover:text-indigo-400 hover:text-indigo-600' />
            </span>
            {showWechatQR && (
              <div className='absolute bottom-12 left-1/2 -translate-x-1/2 z-40'>
                <div
                  className='w-36 rounded-xl bg-white dark:bg-neutral-800 shadow-2xl ring-1 ring-black/5 flex flex-col items-center px-3 py-2'
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src='https://cdn.jsdmirror.com/gh/88lin/picx-images-hosting@master/qrcode.1ovwa0ke25.png'
                    alt='微信公众号二维码'
                    className='block w-28 h-28 object-contain'
                    draggable={false}
                  />
                  <div className='mt-1 text-[11px] leading-none text-gray-600 dark:text-gray-300 whitespace-nowrap'>
                    扫码关注公众号
                  </div>
                </div>
              </div>
            )}
          </div>
        {CONTACT_BILIBILI && (
          <a
            target='_blank'
            rel='noreferrer'
            title={'bilibili'}
            href={CONTACT_BILIBILI}>
            <i className='transform hover:scale-125 duration-150 fab fa-bilibili dark:hover:text-indigo-400 hover:text-indigo-600' />
          </a>
        )}
        {CONTACT_GITHUB && (
          <a
            target='_blank'
            rel='noreferrer'
            title={'github'}
            href={CONTACT_GITHUB}>
            <i className='transform hover:scale-125 duration-150 fab fa-github dark:hover:text-indigo-400 hover:text-indigo-600' />
          </a>
        )}
        {CONTACT_TWITTER && (
          <a
            target='_blank'
            rel='noreferrer'
            title={'twitter'}
            href={CONTACT_TWITTER}>
            <i className='transform hover:scale-125 duration-150 fab fa-twitter dark:hover:text-indigo-400 hover:text-indigo-600' />
          </a>
        )}
        {CONTACT_TELEGRAM && (
          <a
            target='_blank'
            rel='noreferrer'
            href={CONTACT_TELEGRAM}
            title={'telegram'}>
            <i className='transform hover:scale-125 duration-150 fab fa-telegram dark:hover:text-indigo-400 hover:text-indigo-600' />
          </a>
        )}
        {CONTACT_LINKEDIN && (
          <a
            target='_blank'
            rel='noreferrer'
            href={CONTACT_LINKEDIN}
            title={'linkIn'}>
            <i className='transform hover:scale-125 duration-150 fab fa-linkedin dark:hover:text-indigo-400 hover:text-indigo-600' />
          </a>
        )}
        {CONTACT_WEIBO && (
          <a
            target='_blank'
            rel='noreferrer'
            title={'weibo'}
            href={CONTACT_WEIBO}>
            <i className='transform hover:scale-125 duration-150 fab fa-weibo dark:hover:text-indigo-400 hover:text-indigo-600' />
          </a>
        )}
        {CONTACT_INSTAGRAM && (
          <a
            target='_blank'
            rel='noreferrer'
            title={'instagram'}
            href={CONTACT_INSTAGRAM}>
            <i className='transform hover:scale-125 duration-150 fab fa-instagram dark:hover:text-indigo-400 hover:text-indigo-600' />
          </a>
        )}
        {CONTACT_EMAIL && (
          <a
            onClick={e => handleEmailClick(e, emailIcon, CONTACT_EMAIL)}
            title='email'
            className='cursor-pointer'
            ref={emailIcon}>
            <i className='transform hover:scale-125 duration-150 fas fa-envelope dark:hover:text-indigo-400 hover:text-indigo-600' />
          </a>
        )}
        {ENABLE_RSS && (
          <a
            target='_blank'
            rel='noreferrer'
            title={'RSS'}
            href={'/rss/feed.xml'}>
            <i className='transform hover:scale-125 duration-150 fas fa-rss dark:hover:text-indigo-400 hover:text-indigo-600' />
          </a>
        )}
        {CONTACT_YOUTUBE && (
          <a
            target='_blank'
            rel='noreferrer'
            title={'youtube'}
            href={CONTACT_YOUTUBE}>
            <i className='transform hover:scale-125 duration-150 fab fa-youtube dark:hover:text-indigo-400 hover:text-indigo-600' />
          </a>
        )}
      </div>
    </div>
  )
}
export default SocialButton