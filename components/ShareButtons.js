import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import copy from 'copy-to-clipboard'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useState } from 'react'

import {
  FacebookShareButton,
  FacebookIcon,
  FacebookMessengerShareButton,
  FacebookMessengerIcon,
  RedditShareButton,
  RedditIcon,
  LineShareButton,
  LineIcon,
  EmailShareButton,
  EmailIcon,
  TwitterShareButton,
  TwitterIcon,
  TelegramShareButton,
  TelegramIcon,
  WhatsappShareButton,
  WhatsappIcon,
  LinkedinShareButton,
  LinkedinIcon,
  PinterestShareButton,
  PinterestIcon,
  VKIcon,
  VKShareButton,
  OKShareButton,
  OKIcon,
  TumblrShareButton,
  TumblrIcon,
  LivejournalIcon,
  LivejournalShareButton,
  MailruShareButton,
  MailruIcon,
  ViberIcon,
  ViberShareButton,
  WorkplaceShareButton,
  WorkplaceIcon,
  WeiboShareButton,
  WeiboIcon,
  PocketShareButton,
  PocketIcon,
  InstapaperShareButton,
  InstapaperIcon,
  HatenaShareButton,
  HatenaIcon
} from 'react-share'

const QrCode = dynamic(() => import('@/components/QrCode'), { ssr: false })

/**
 * @author https://github.com/txs
 * @param {*} param0
 * @returns
 */
const ShareButtons = ({ post }) => {
  const router = useRouter()
  const shareUrl = siteConfig('LINK') + router.asPath
  const title = post.title || siteConfig('TITLE')
  const image = post.pageCover
  const body = post?.title + ' | ' + title + ' ' + shareUrl + ' ' + post?.summary

  const services = siteConfig('POSTS_SHARE_SERVICES').split(',')
  const titleWithSiteInfo = title + ' | ' + siteConfig('TITLE')
  const { locale } = useGlobal()
  const [qrCodeShow, setQrCodeShow] = useState(false)

  const copyUrl = () => {
    copy(shareUrl)
    alert(locale.COMMON.URL_COPIED)
  }

  const openPopover = () => {
    setQrCodeShow(true)
  }
  const closePopover = () => {
    setQrCodeShow(false)
  }

  return (
        <>
            {services.map(singleService => {
              if (singleService === 'email') {
                return (
                        <EmailShareButton
                            key={singleService}
                            url={shareUrl}
                            subject={titleWithSiteInfo}
                            body={body}
                            className="mx-1"
                        >
                            <EmailIcon size={32} round />
                        </EmailShareButton>
                )
              }
              if (singleService === 'twitter') {
                return (
                        <TwitterShareButton
                            key={singleService}
                            url={shareUrl}
                            title={titleWithSiteInfo}
                            className="mx-1"
                        >
                            <TwitterIcon size={32} round />
                        </TwitterShareButton>
                )
              }
              if (singleService === 'telegram') {
                return (
                        <TelegramShareButton
                            key={singleService}
                            url={shareUrl}
                            title={titleWithSiteInfo}
                            className="mx-1"
                        >
                            <TelegramIcon size={32} round />
                        </TelegramShareButton>
                )
              }
              if (singleService === 'weibo') {
                return (
                        <WeiboShareButton
                            key={singleService}
                            url={shareUrl}
                            title={titleWithSiteInfo}
                            image={image}
                            className="mx-1"
                        >
                            <WeiboIcon size={32} round />
                        </WeiboShareButton>
                )
              }
              if (singleService === 'qq') {
                return <button key={singleService} className='cursor-pointer bg-blue-600 text-white rounded-full mx-1'>
                        <a target='_blank' rel='noreferrer' aria-label="Share by QQ" href={`http://connect.qq.com/widget/shareqq/index.html?url=${shareUrl}&sharesource=qzone&title=${title}&desc=${body}`} >
                            <i className='fab fa-qq w-8' />
                        </a>
                    </button>
              }
              if (singleService === 'wechat') {
                return <button onMouseEnter={openPopover} onMouseLeave={closePopover} aria-label={singleService} key={singleService} className='cursor-pointer bg-green-600 text-white rounded-full mx-1'>
                        <div id='wechat-button'>
                            <i className='fab fa-weixin w-8' />
                        </div>
                        <div className='absolute'>
                        <div id='pop' className={(qrCodeShow ? 'opacity-100 ' : ' invisible opacity-0') + ' z-40 absolute bottom-10 -left-10 bg-white shadow-xl transition-all duration-200 text-center'}>
                                <div className='p-2 mt-1 w-28 h-28'>
                                    { qrCodeShow && <QrCode value={shareUrl}/> }
                                </div>
                                <span className='text-black font-semibold p-1 rounded-t-lg text-sm mx-auto mb-1'>
                                    {locale.COMMON.SCAN_QR_CODE}
                                </span>
                        </div>
                        </div>
                    </button>
              }
              if (singleService === 'link') {
                return <button aria-label={singleService} key={singleService} className='cursor-pointer bg-yellow-500 text-white rounded-full mx-1'>
                        <div alt={locale.COMMON.URL_COPIED} onClick={copyUrl} >
                            <i className='fas fa-link w-8' />
                        </div>
                    </button>
              }
              return <></>
            })}
        </>
  )
}

export default ShareButtons
