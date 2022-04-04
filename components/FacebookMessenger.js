import BLOG from '@/blog.config'
import MessengerCustomerChat from 'react-messenger-customer-chat/lib/MessengerCustomerChat'

const Messenger = () => (
  <MessengerCustomerChat
    pageId={BLOG.FACEBOOK_PAGE_ID}
    appId={BLOG.FACEBOOK_APP_ID}
    language={BLOG.LANG.replace('-', '_')}
  />
)
export default Messenger
