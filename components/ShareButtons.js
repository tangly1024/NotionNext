import BLOG from '@/blog.config'
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

const ShareButtons = ({ shareUrl, title, body, image }) => {
  const services = BLOG.POSTS_SHARE_SERVICES.split(', ')
  console.log(image)
  const titleWithSiteInfo = title + ' | ' + BLOG.TITLE
  return (
    <>
      {services.map(singleService => {
        if (singleService === 'facebook') {
          return (
            <FacebookShareButton key="{item}" url={shareUrl} className="mx-1">
              <FacebookIcon size={32} round />
            </FacebookShareButton>
          )
        }
        if (singleService === 'messenger') {
          return (
            <FacebookMessengerShareButton
              key="{item}"
              url={shareUrl}
              appId={BLOG.FACEBOOK_APP_ID}
              className="mx-1"
            >
              <FacebookMessengerIcon size={32} round />
            </FacebookMessengerShareButton>
          )
        }
        if (singleService === 'line') {
          return (
            <LineShareButton key="{item}" url={shareUrl} className="mx-1">
              <LineIcon size={32} round />
            </LineShareButton>
          )
        }
        if (singleService === 'reddit') {
          return (
            <RedditShareButton
              key="{item}"
              url={shareUrl}
              title={titleWithSiteInfo}
              windowWidth={660}
              windowHeight={460}
              className="mx-1"
            >
              <RedditIcon size={32} round />
            </RedditShareButton>
          )
        }
        if (singleService === 'email') {
          return (
            <EmailShareButton
              key="{item}"
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
              key="{item}"
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
              key="{item}"
              url={shareUrl}
              title={titleWithSiteInfo}
              className="mx-1"
            >
              <TelegramIcon size={32} round />
            </TelegramShareButton>
          )
        }
        if (singleService === 'whatsapp') {
          return (
            <WhatsappShareButton
              key="{item}"
              url={shareUrl}
              title={titleWithSiteInfo}
              separator=":: "
              className="mx-1"
            >
              <WhatsappIcon size={32} round />
            </WhatsappShareButton>
          )
        }
        if (singleService === 'linkedin') {
          return (
            <LinkedinShareButton key="{item}" url={shareUrl} className="mx-1">
              <LinkedinIcon size={32} round />
            </LinkedinShareButton>
          )
        }
        if (singleService === 'pinterest') {
          return (
            <PinterestShareButton
              key="{item}"
              url={shareUrl}
              media={image}
              className="mx-1"
            >
              <PinterestIcon size={32} round />
            </PinterestShareButton>
          )
        }
        if (singleService === 'vkshare') {
          return (
            <VKShareButton
              key="{item}"
              url={shareUrl}
              image={image}
              className="mx-1"
            >
              <VKIcon size={32} round />
            </VKShareButton>
          )
        }
        if (singleService === 'okshare') {
          return (
            <OKShareButton
              key="{item}"
              url={shareUrl}
              image={image}
              className="mx-1"
            >
              <OKIcon size={32} round />
            </OKShareButton>
          )
        }
        if (singleService === 'tumblr') {
          return (
            <TumblrShareButton
              key="{item}"
              url={shareUrl}
              title={titleWithSiteInfo}
              className="mx-1"
            >
              <TumblrIcon size={32} round />
            </TumblrShareButton>
          )
        }
        if (singleService === 'livejournal') {
          return (
            <LivejournalShareButton
              key="{item}"
              url={shareUrl}
              title={titleWithSiteInfo}
              description={shareUrl}
              className="mx-1"
            >
              <LivejournalIcon size={32} round />
            </LivejournalShareButton>
          )
        }
        if (singleService === 'mailru') {
          return (
            <MailruShareButton
              key="{item}"
              url={shareUrl}
              title={titleWithSiteInfo}
              className="mx-1"
            >
              <MailruIcon size={32} round />
            </MailruShareButton>
          )
        }
        if (singleService === 'viber') {
          return (
            <ViberShareButton
              key="{item}"
              url={shareUrl}
              title={titleWithSiteInfo}
              className="mx-1"
            >
              <ViberIcon size={32} round />
            </ViberShareButton>
          )
        }
        if (singleService === 'workplace') {
          return (
            <WorkplaceShareButton
              key="{item}"
              url={shareUrl}
              quote={titleWithSiteInfo}
              className="mx-1"
            >
              <WorkplaceIcon size={32} round />
            </WorkplaceShareButton>
          )
        }
        if (singleService === 'weibo') {
          return (
            <WeiboShareButton
              key="{item}"
              url={shareUrl}
              title={titleWithSiteInfo}
              image={image}
              className="mx-1"
            >
              <WeiboIcon size={32} round />
            </WeiboShareButton>
          )
        }
        if (singleService === 'pocket') {
          return (
            <PocketShareButton
              key="{item}"
              url={shareUrl}
              title={titleWithSiteInfo}
              className="mx-1"
            >
              <PocketIcon size={32} round />
            </PocketShareButton>
          )
        }
        if (singleService === 'instapaper') {
          return (
            <InstapaperShareButton
              key="{item}"
              url={shareUrl}
              title={titleWithSiteInfo}
              className="mx-1"
            >
              <InstapaperIcon size={32} round />
            </InstapaperShareButton>
          )
        }
        if (singleService === 'hatena') {
          return (
            <HatenaShareButton
              key="{item}"
              url={shareUrl}
              title={titleWithSiteInfo}
              windowWidth={660}
              windowHeight={460}
              className="mx-1"
            >
              <HatenaIcon size={32} round />
            </HatenaShareButton>
          )
        }
        return <></>
      })}
    </>
  )
}

export default ShareButtons
