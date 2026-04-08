import QrCode from '@/components/QrCode'
import { siteConfig } from '@/lib/config'
import { useRef, useState } from 'react'
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
  const CONTACT_WHATSAPP = siteConfig('CONTACT_WHATSAPP')
  const CONTACT_LINKEDIN = siteConfig('CONTACT_LINKEDIN')
  const CONTACT_WEIBO = siteConfig('CONTACT_WEIBO')
  const CONTACT_INSTAGRAM = siteConfig('CONTACT_INSTAGRAM')
  const CONTACT_EMAIL = siteConfig('CONTACT_EMAIL')
  const ENABLE_RSS = siteConfig('ENABLE_RSS')
  const CONTACT_BILIBILI = siteConfig('CONTACT_BILIBILI')
  const CONTACT_YOUTUBE = siteConfig('CONTACT_YOUTUBE')

  const CONTACT_XIAOHONGSHU = siteConfig('CONTACT_XIAOHONGSHU')
  const CONTACT_ZHISHIXINGQIU = siteConfig('CONTACT_ZHISHIXINGQIU')
  const CONTACT_WEHCHAT_PUBLIC = siteConfig('CONTACT_WEHCHAT_PUBLIC')

  const [qrCodeShow, setQrCodeShow] = useState(false)

  const openPopover = () => {
    setQrCodeShow(true)
  }
  const closePopover = () => {
    setQrCodeShow(false)
  }

  const emailIcon = useRef(null)

  return (
    <div className='w-full justify-center flex-wrap flex'>
      <div className='space-x-3 text-xl flex items-center text-gray-600 dark:text-gray-300 '>
        
        {/* GitHub */}
        {CONTACT_GITHUB && (
          <a target='_blank' rel='noreferrer' title={'github'} href={CONTACT_GITHUB}>
            <i className='transform hover:scale-125 duration-150 fab fa-github dark:hover:text-indigo-400 hover:text-indigo-600' />
          </a>
        )}
       {/* X (Twitter) - 使用兼容性更好的类名 */}
        {CONTACT_TWITTER && (
          <a target='_blank' rel='noreferrer' title={'X'} href={CONTACT_TWITTER}>
            <i className='transform hover:scale-125 duration-150 fab fa-twitter dark:hover:text-indigo-400 hover:text-indigo-600' />
          </a>
        )}

        {/* Telegram */}
        {CONTACT_TELEGRAM && (
          <a target='_blank' rel='noreferrer' href={CONTACT_TELEGRAM} title={'telegram'}>
            <i className='transform hover:scale-125 duration-150 fab fa-telegram dark:hover:text-indigo-400 hover:text-indigo-600' />
          </a>
        )}

        {/* WhatsApp - 你的新联系方式 */}
        {CONTACT_WHATSAPP && (
          <a target='_blank' rel='noreferrer' href={CONTACT_WHATSAPP} title={'whatsapp'}>
            <i className='transform hover:scale-125 duration-150 fab fa-whatsapp dark:hover:text-indigo-400 hover:text-indigo-600' />
          </a>
        )}

        {/* LinkedIn */}
        {CONTACT_LINKEDIN && (
          <a target='_blank' rel='noreferrer' href={CONTACT_LINKEDIN} title={'linkIn'}>
            <i className='transform hover:scale-125 duration-150 fab fa-linkedin dark:hover:text-indigo-400 hover:text-indigo-600' />
          </a>
        )}

        {/* Email */}
        {CONTACT_EMAIL && (
          <a onClick={e => handleEmailClick(e, emailIcon, CONTACT_EMAIL)} title='email' className='cursor-pointer' ref={emailIcon}>
            <i className='transform hover:scale-125 duration-150 fas fa-envelope dark:hover:text-indigo-400 hover:text-indigo-600' />
          </a>
        )}

        {/* RSS */}
        {ENABLE_RSS && (
          <a target='_blank' rel='noreferrer' title={'RSS'} href={'/rss/feed.xml'}>
            <i className='transform hover:scale-125 duration-150 fas fa-rss dark:hover:text-indigo-400 hover:text-indigo-600' />
          </a>
        )}

        {/* 微信公众号 - 悬停自动弹出二维码 */}
        {CONTACT_WEHCHAT_PUBLIC && (
          <button onMouseEnter={openPopover} onMouseLeave={closePopover} aria-label={'微信公众号'}>
            <div id='wechat-button'>
              <i className='transform scale-105 hover:scale-125 duration-150 fab fa-weixin  dark:hover:text-indigo-400 hover:text-indigo-600' />
            </div>
            <div className='absolute'>
              <div id='pop' className={(qrCodeShow ? 'opacity-100 ' : ' invisible opacity-0') + ' z-40 absolute bottom-10 -left-10 bg-white shadow-xl transition-all duration-200 text-center'}>
                <div className='p-2 mt-1 w-28 h-28'>
                  {qrCodeShow && <QrCode value={CONTACT_WEHCHAT_PUBLIC} />}
                </div>
              </div>
            </div>
          </button>
        )}

      </div>
    </div>
  )
}
export default SocialButton
