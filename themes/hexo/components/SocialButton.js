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
  const CONTACT_EMAIL = siteConfig('CONTACT_EMAIL')
  const CONTACT_BILIBILI = siteConfig('CONTACT_BILIBILI')


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

        {CONTACT_EMAIL && (
          <a
            onClick={e => handleEmailClick(e, emailIcon, CONTACT_EMAIL)}
            title='email'
            className='cursor-pointer'
            ref={emailIcon}>
            <i className='transform hover:scale-125 duration-150 fas fa-envelope dark:hover:text-indigo-400 hover:text-indigo-600' />
          </a>
        )}
        {CONTACT_BILIBILI && (
          <a
            target='_blank'
            rel='noreferrer'
            title={'bilibili'}
            href={CONTACT_BILIBILI}>
            <i className='transform hover:scale-125 duration-150 dark:hover:text-indigo-400 hover:text-indigo-600 fab fa-bilibili' />
          </a>
        )}
      </div>
    </div>
  )
}
export default SocialButton
