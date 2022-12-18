import BLOG from '@/blog.config'
import { useRouter } from 'next/router'
import React from 'react'
import { createPopper } from '@popperjs/core'
import copy from 'copy-to-clipboard'
import QRCode from 'qrcode.react'
import { useGlobal } from '@/lib/global'
import CONFIG_NEXT from '../config_next'

const ShareBar = ({ post }) => {
  if (!CONFIG_NEXT.ARTICLE_SHARE) {
    return <></>
  }
  const router = useRouter()
  const shareUrl = BLOG.LINK + router.asPath

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
      className='py-2 text-gray-500 text-center space-x-2 flex my-1 dark:text-gray-200 overflow-visible'>
      <div className='hidden md:block text-gray-800 dark:text-gray-300 mr-2 my-2 whitespace-nowrap'>{locale.COMMON.SHARE}:</div>
      <div className='text-3xl cursor-pointer'>
        <a className='text-blue-700' href={`https://www.facebook.com/sharer.php?u=${shareUrl}`} >
          <i className='fab fa-facebook-square'/>
        </a>
      </div>
      <div className='text-3xl cursor-pointer'>
        <a className='text-blue-400' target='_blank' rel='noreferrer' href={`https://twitter.com/intent/tweet?title=${post.title}&url${shareUrl}`} >
          <i className='fab fa-twitter-square'/>
        </a>
      </div>
      <div className='text-3xl cursor-pointer'>
        <a className='text-blue-500' href={`https://telegram.me/share/url?url=${shareUrl}&text=${post.title}`} >
        <i className='fab fa-telegram'/>
        </a>
      </div>
      <div className='cursor-pointer text-2xl'>
        <a className='text-green-600' ref={btnRef} onMouseEnter={openPopover} onMouseLeave={closePopover}>
          <i className='fab fa-weixin'/>
          <div ref={popoverRef} className={(qrCodeShow ? 'animate__animated animate__fadeIn ' : 'hidden') + ' text-center py-2'}>
            <div className='p-2 bg-white border-0 duration-200 transform block z-40 font-normal shadow-xl mr-10'>
              <QRCode value={shareUrl} fgColor='#000000' />
            </div>
            <span className='bg-white text-black font-semibold p-1 mb-0 rounded-t-lg text-sm mx-auto mr-10'>
            {locale.COMMON.SCAN_QR_CODE}
            </span>
          </div>
        </a>
      </div>
      <div className='cursor-pointer text-2xl'>
        <a className='text-red-600' target='_blank' rel='noreferrer' href={`https://service.weibo.com/share/share.php?url=${shareUrl}&title=${post.title}`} >
          <i className='fab fa-weibo'/>
        </a>
      </div>
      <div className='cursor-pointer text-2xl'>
        <a className='text-blue-400' target='_blank' rel='noreferrer' href={`http://connect.qq.com/widget/shareqq/index.html?url=${shareUrl}&sharesource=qzone&title=${post.title}&desc=${post.summary}`} >
          <i className='fab fa-qq'/>
        </a>
      </div>
      <div className='cursor-pointer text-2xl'>
        <a className='text-yellow-600' onClick={copyUrl} >
          <i className='fas fa-link'/>
        </a>
      </div>
    </div>
  </>
}
export default ShareBar
