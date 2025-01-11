import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookMessengerIcon,
  FacebookMessengerShareButton,
  FacebookShareButton,
  HatenaIcon,
  HatenaShareButton,
  InstapaperIcon,
  InstapaperShareButton,
  LineIcon,
  LineShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  LivejournalIcon,
  LivejournalShareButton,
  MailruIcon,
  MailruShareButton,
  OKIcon,
  OKShareButton,
  PinterestIcon,
  PinterestShareButton,
  PocketIcon,
  PocketShareButton,
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  TumblrIcon,
  TumblrShareButton,
  TwitterIcon,
  TwitterShareButton,
  ViberIcon,
  ViberShareButton,
  VKIcon,
  VKShareButton,
  WeiboIcon,
  WeiboShareButton,
  WhatsappIcon,
  WhatsappShareButton,
  WorkplaceIcon,
  WorkplaceShareButton
} from 'react-share'

const QrCode = dynamic(() => import('@/components/QrCode'), { ssr: false })

/**
 * @author https://github.com/txs
 * @param {*} param0
 * @returns
 */
const ShareButtons = ({ post }) => {
  const router = useRouter()
  const [shareUrl, setShareUrl] = useState(siteConfig('LINK') + router.asPath)
  const title = post?.title || siteConfig('TITLE')
  const image = post?.pageCover
  const tags = post.tags || []
  const hashTags = tags.map(tag => `#${tag}`).join(',')
  const body =
    post?.title + ' | ' + title + ' ' + shareUrl + ' ' + post?.summary

  const services = siteConfig('POSTS_SHARE_SERVICES').split(',')
  const titleWithSiteInfo = title + ' | ' + siteConfig('TITLE')
  const { locale } = useGlobal()
  const [qrCodeShow, setQrCodeShow] = useState(false)

  const copyUrl = () => {
    // 确保 shareUrl 是一个正确的字符串并进行解码
    const decodedUrl = decodeURIComponent(shareUrl)
    navigator?.clipboard?.writeText(decodedUrl)
    alert(locale.COMMON.URL_COPIED + ' \n' + decodedUrl)
  }

  const openPopover = () => {
    setQrCodeShow(true)
  }
  const closePopover = () => {
    setQrCodeShow(false)
  }

  useEffect(() => {
    setShareUrl(window.location.href)
  }, [])

  return (
    <>
      {services.map(singleService => {
        switch (singleService) {
          case 'facebook':
            return (
              <FacebookShareButton
                key={singleService}
                url={shareUrl}
                hashtag={hashTags}
                className='mx-1'>
                <FacebookIcon size={32} round />
              </FacebookShareButton>
            )
          case 'messenger':
            return (
              <FacebookMessengerShareButton
                key={singleService}
                url={shareUrl}
                appId={siteConfig('FACEBOOK_APP_ID')}
                className='mx-1'>
                <FacebookMessengerIcon size={32} round />
              </FacebookMessengerShareButton>
            )
          case 'line':
            return (
              <LineShareButton
                key={singleService}
                url={shareUrl}
                className='mx-1'>
                <LineIcon size={32} round />
              </LineShareButton>
            )
          case 'reddit':
            return (
              <RedditShareButton
                key={singleService}
                url={shareUrl}
                title={titleWithSiteInfo}
                windowWidth={660}
                windowHeight={460}
                className='mx-1'>
                <RedditIcon size={32} round />
              </RedditShareButton>
            )
          case 'email':
            return (
              <EmailShareButton
                key={singleService}
                url={shareUrl}
                subject={titleWithSiteInfo}
                body={body}
                className='mx-1'>
                <EmailIcon size={32} round />
              </EmailShareButton>
            )
          case 'twitter':
            return (
              <TwitterShareButton
                key={singleService}
                url={shareUrl}
                title={titleWithSiteInfo}
                hashtags={tags}
                className='mx-1'>
                <TwitterIcon size={32} round />
              </TwitterShareButton>
            )
          case 'telegram':
            return (
              <TelegramShareButton
                key={singleService}
                url={shareUrl}
                title={titleWithSiteInfo}
                className='mx-1'>
                <TelegramIcon size={32} round />
              </TelegramShareButton>
            )
          case 'whatsapp':
            return (
              <WhatsappShareButton
                key={singleService}
                url={shareUrl}
                title={titleWithSiteInfo}
                separator=':: '
                className='mx-1'>
                <WhatsappIcon size={32} round />
              </WhatsappShareButton>
            )
          case 'linkedin':
            return (
              <LinkedinShareButton
                key={singleService}
                url={shareUrl}
                className='mx-1'>
                <LinkedinIcon size={32} round />
              </LinkedinShareButton>
            )
          case 'pinterest':
            return (
              <PinterestShareButton
                key={singleService}
                url={shareUrl}
                media={image}
                className='mx-1'>
                <PinterestIcon size={32} round />
              </PinterestShareButton>
            )
          case 'vkshare':
            return (
              <VKShareButton
                key={singleService}
                url={shareUrl}
                image={image}
                className='mx-1'>
                <VKIcon size={32} round />
              </VKShareButton>
            )
          case 'okshare':
            return (
              <OKShareButton
                key={singleService}
                url={shareUrl}
                image={image}
                className='mx-1'>
                <OKIcon size={32} round />
              </OKShareButton>
            )
          case 'tumblr':
            return (
              <TumblrShareButton
                key={singleService}
                url={shareUrl}
                title={titleWithSiteInfo}
                tags={tags}
                className='mx-1'>
                <TumblrIcon size={32} round />
              </TumblrShareButton>
            )
          case 'livejournal':
            return (
              <LivejournalShareButton
                key={singleService}
                url={shareUrl}
                title={titleWithSiteInfo}
                description={shareUrl}
                className='mx-1'>
                <LivejournalIcon size={32} round />
              </LivejournalShareButton>
            )
          case 'mailru':
            return (
              <MailruShareButton
                key={singleService}
                url={shareUrl}
                title={titleWithSiteInfo}
                className='mx-1'>
                <MailruIcon size={32} round />
              </MailruShareButton>
            )
          case 'viber':
            return (
              <ViberShareButton
                key={singleService}
                url={shareUrl}
                title={titleWithSiteInfo}
                className='mx-1'>
                <ViberIcon size={32} round />
              </ViberShareButton>
            )
          case 'workplace':
            return (
              <WorkplaceShareButton
                key={singleService}
                url={shareUrl}
                quote={titleWithSiteInfo}
                hashtag={hashTags}
                className='mx-1'>
                <WorkplaceIcon size={32} round />
              </WorkplaceShareButton>
            )
          case 'weibo':
            return (
              <WeiboShareButton
                key={singleService}
                url={shareUrl}
                title={titleWithSiteInfo}
                image={image}
                className='mx-1'>
                <WeiboIcon size={32} round />
              </WeiboShareButton>
            )
          case 'pocket':
            return (
              <PocketShareButton
                key={singleService}
                url={shareUrl}
                title={titleWithSiteInfo}
                className='mx-1'>
                <PocketIcon size={32} round />
              </PocketShareButton>
            )
          case 'instapaper':
            return (
              <InstapaperShareButton
                key={singleService}
                url={shareUrl}
                title={titleWithSiteInfo}
                className='mx-1'>
                <InstapaperIcon size={32} round />
              </InstapaperShareButton>
            )
          case 'hatena':
            return (
              <HatenaShareButton
                key={singleService}
                url={shareUrl}
                title={titleWithSiteInfo}
                windowWidth={660}
                windowHeight={460}
                className='mx-1'>
                <HatenaIcon size={32} round />
              </HatenaShareButton>
            )
          case 'qq':
            return (
              <button
                key={singleService}
                className='cursor-pointer bg-blue-600 text-white rounded-full mx-1'>
                <a
                  target='_blank'
                  rel='noreferrer'
                  aria-label='Share by QQ'
                  href={`http://connect.qq.com/widget/shareqq/index.html?url=${shareUrl}&sharesource=qzone&title=${title}&desc=${body}`}>
                  <i className='fab fa-qq w-8' />
                </a>
              </button>
            )
          case 'wechat':
            return (
              <button
                onMouseEnter={openPopover}
                onMouseLeave={closePopover}
                aria-label={singleService}
                key={singleService}
                className='cursor-pointer bg-green-600 text-white rounded-full mx-1'>
                <div id='wechat-button'>
                  <i className='fab fa-weixin w-8' />
                </div>
                <div className='absolute'>
                  <div
                    id='pop'
                    className={
                      (qrCodeShow ? 'opacity-100 ' : ' invisible opacity-0') +
                      ' z-40 absolute bottom-10 -left-10 bg-white shadow-xl transition-all duration-200 text-center'
                    }>
                    <div className='p-2 mt-1 w-28 h-28'>
                      {qrCodeShow && <QrCode value={shareUrl} />}
                    </div>
                    <span className='text-black font-semibold p-1 rounded-t-lg text-sm mx-auto mb-1'>
                      {locale.COMMON.SCAN_QR_CODE}
                    </span>
                  </div>
                </div>
              </button>
            )
          case 'link':
            return (
              <button
                aria-label={singleService}
                key={singleService}
                className='cursor-pointer bg-yellow-500 text-white rounded-full mx-1'>
                <div alt={locale.COMMON.URL_COPIED} onClick={copyUrl}>
                  <i className='fas fa-link w-8' />
                </div>
              </button>
            )
          default:
            return <></>
        }
      })}
    </>
  )
}

export default ShareButtons
