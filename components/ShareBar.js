import BLOG from '@/blog.config'
import { useRouter } from 'next/router'
import React from 'react'
import { createPopper } from '@popperjs/core'
import copy from 'copy-to-clipboard'
import QRCode from 'qrcode.react'

const ShareBar = ({ post }) => {
  const router = useRouter()
  const shareUrl = BLOG.link + router.asPath

  // 二维码悬浮
  const [qrCodeShow, setQrCodeShow] = React.useState(false)
  const btnRef = React.createRef()
  const popoverRef = React.createRef()

  const openPopover = () => {
    createPopper(btnRef.current, popoverRef.current, {
      placement: 'left'
    })
    setQrCodeShow(true)
  }
  const closePopover = () => {
    setQrCodeShow(false)
  }

  const copyUrl = () => {
    copy(shareUrl)
    alert('当前链接已复制到剪贴板')
  }

  return <>
    <div
      className='dark:border-gray-500 py-2 text-gray-500 flex-col text-center space-y-2 w-12 border my-1 bg-white dark:bg-gray-800 dark:text-white overflow-hidden'>
      <div className='text-3xl cursor-pointer'>
        <a className='fa fa-facebook-square'
           href={`https://www.facebook.com/sharer.php?u=${shareUrl}`} />
      </div>
      <div className='text-3xl cursor-pointer'>
        <a className='fa fa-twitter-square' target='_blank' rel='noreferrer'
           href={`https://twitter.com/intent/tweet?title=${post.title}&url${shareUrl}`} />
      </div>
      <div className='text-3xl cursor-pointer'>
        <a className='fa fa-telegram' href={`https://telegram.me/share/url?url=${shareUrl}&text=${post.title}`} />
      </div>
      <div className='cursor-pointer text-2xl'>
        <a className='fa fa-wechat' ref={btnRef}
           onMouseEnter={() => {
             openPopover()
           }}
           onMouseLeave={() => {
             closePopover()
           }}>
          <div ref={popoverRef}
               className={(qrCodeShow ? 'animate__animated animate__fadeIn ' : 'hidden') + ' text-center py-2 bg-white'}>
            <div className='p-2 bg-white border-0 duration-200 transform block z-50 font-normal shadow-xl'>
              <QRCode
                value={shareUrl}// 生成二维码的内容
                fgColor='#000000' // 二维码的颜色
              />
            </div>
            <span className='bg-white text-black font-semibold p-1 mb-0 rounded-t-lg text-sm mx-auto'>
            扫一扫分享
          </span>
          </div>
        </a>
      </div>
      <div className='cursor-pointer text-2xl'>
        <a className='fa fa-weibo' target='_blank' rel='noreferrer'
           href={`https://service.weibo.com/share/share.php?url=${shareUrl}&title=${post.title}`} />
      </div>
      <div className='cursor-pointer text-2xl'>
        <a className='fa fa-qq' target='_blank' rel='noreferrer'
           href={`http://connect.qq.com/widget/shareqq/index.html?url=${shareUrl}&sharesource=qzone&title=${post.title}&desc=${post.summary}`} />
      </div>
      <div className='cursor-pointer text-2xl'>
        <a className='fa fa-star' target='_blank' rel='noreferrer'
           href={`https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${shareUrl}&sharesource=qzone&title=${post.title}&summary=${post.summary}`} />
      </div>
      <div className='cursor-pointer text-2xl'>
        <a className='fa fa-link' onClick={copyUrl} />
      </div>
    </div>
  </>
}
export default ShareBar
