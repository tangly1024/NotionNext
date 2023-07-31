import BLOG from '@/blog.config'

const Messenger = () => (
  <div
    pageId={BLOG.FACEBOOK_PAGE_ID}
    appId={BLOG.FACEBOOK_APP_ID}
    language={BLOG.LANG.replace('-', '_')}
  />
)
export default Messenger
