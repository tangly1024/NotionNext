import {
  EmailShareButton,
  FacebookShareButton,
  RedditShareButton,
  TwitterShareButton,
  WeiboShareButton,
  WhatsappShareButton,
  EmailIcon,
  FacebookIcon,
  RedditIcon,
  TwitterIcon,
  WeiboIcon,
  WhatsappIcon
} from 'react-share'

/**
 * 社交分享按钮
 * @returns {JSX.Element}
 * @constructor
 */
const ShareButtons = ({ shareUrl, title }) => {
  const iconProps = {
    size: 28,
    round: true,
    borderRadius: 15
  }

  return (
    <div className='flex justify-center items-center gap-2'>
      <TwitterShareButton url={shareUrl} title={title}>
        <TwitterIcon {...iconProps} />
      </TwitterShareButton>

      <FacebookShareButton url={shareUrl} quote={title}>
        <FacebookIcon {...iconProps} />
      </FacebookShareButton>

      <RedditShareButton url={shareUrl} title={title}>
        <RedditIcon {...iconProps} />
      </RedditShareButton>

      <WeiboShareButton url={shareUrl} title={title}>
        <WeiboIcon {...iconProps} />
      </WeiboShareButton>

      <WhatsappShareButton url={shareUrl} title={title}>
        <WhatsappIcon {...iconProps} />
      </WhatsappShareButton>

      <EmailShareButton url={shareUrl} subject={title}>
        <EmailIcon {...iconProps} />
      </EmailShareButton>
    </div>
  )
}

export default ShareButtons
