import BLOG from '@/blog.config'
import { FacebookProvider, Page } from 'react-facebook'

const FacebookPage = () => (
  <FacebookProvider appId={BLOG.FACEBOOK_APP_ID}>
    <Page href={BLOG.FACEBOOK_PAGE} tabs="timeline" />
  </FacebookProvider>
)
export default FacebookPage
