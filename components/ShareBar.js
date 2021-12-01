import BLOG from '@/blog.config'
import { useRouter } from 'next/router'
import React from 'react'
import { createPopper } from '@popperjs/core'
import copy from 'copy-to-clipboard'
import QRCode from 'qrcode.react'
import { useGlobal } from '@/lib/global'

const ShareBar = ({ post }) => {
  const router = useRouter()
  const shareUrl = BLOG.link + router.asPath

  // 二维码悬浮
  const [qrCodeShow, setQrCodeShow] = React.useState(false)
  const btnRef = React.createRef()
  const popoverRef = React.createRef()
  const { locale } = useGlobal()

  const openPopover = () => {
    createPopper(btnRef.current, popoverRef.current, {
      placement: 'top'
    })
    setQrCodeShow(true)
  }
  const closePopover = () => {
    setQrCodeShow(false)
  }

  const copyUrl = () => {
    copy(shareUrl)
    alert(locale.COMMON.URL_COPIED)
  }

  return <>
    <div
      className='py-2 text-gray-500 text-center space-x-2 flex inline-block my-1 dark:text-gray-200 overflow-visible'>
      <div className='hidden md:block text-gray-800 dark:text-gray-300 mr-2 my-2'>{locale.COMMON.SHARE}:</div>
      <div className='text-3xl cursor-pointer'>
        <a className='fa fa-facebook-square hover:text-red-600'
           href={`https://www.facebook.com/sharer.php?u=${shareUrl}`} />
      </div>
      <div className='text-3xl cursor-pointer'>
        <a className='fa fa-twitter-square hover:text-red-600' target='_blank' rel='noreferrer'
           href={`https://twitter.com/intent/tweet?title=${post.title}&url${shareUrl}`} />
      </div>
      <div className='text-3xl cursor-pointer'>
        <a className='fa fa-telegram hover:text-red-600' href={`https://telegram.me/share/url?url=${shareUrl}&text=${post.title}`} />
      </div>
      <div className='cursor-pointer text-2xl'>
        <a className='fa fa-wechat hover:text-red-600' ref={btnRef}
           onMouseEnter={() => {
             openPopover()
           }}
           onMouseLeave={() => {
             closePopover()
           }}>
          <div ref={popoverRef}
               className={(qrCodeShow ? 'animate__animated animate__fadeIn ' : 'hidden') + ' text-center py-2'}>
            <div className='p-2 bg-white border-0 duration-200 transform block z-50 font-normal shadow-xl mr-10'>
              <QRCode
                value={shareUrl}// 生成二维码的内容
                fgColor='#000000' // 二维码的颜色
              />
            </div>
            <span className='bg-white text-black font-semibold p-1 mb-0 rounded-t-lg text-sm mx-auto mr-10'>
            {locale.COMMON.SCAN_QR_CODE}
          </span>
          </div>
        </a>
      </div>
      <div className='cursor-pointer text-2xl'>
        <a className='fa fa-weibo hover:text-red-600' target='_blank' rel='noreferrer'
           href={`https://service.weibo.com/share/share.php?url=${shareUrl}&title=${post.title}`} />
      </div>
      <div className='cursor-pointer text-2xl'>
        <a className='fa fa-qq hover:text-red-600' target='_blank' rel='noreferrer'
           href={`http://connect.qq.com/widget/shareqq/index.html?url=${shareUrl}&sharesource=qzone&title=${post.title}&desc=${post.summary}`} />
      </div>
      <div className='cursor-pointer text-2xl'>
        <a className='fa fa-star hover:text-red-600' target='_blank' rel='noreferrer'
           href={`https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${shareUrl}&sharesource=qzone&title=${post.title}&summary=${post.summary}`} />
      </div>
      <div className='cursor-pointer text-2xl'>
        <a className='fa fa-link hover:text-red-600' onClick={copyUrl} />
      </div>
    </div>
  </>
}
export default ShareBar
