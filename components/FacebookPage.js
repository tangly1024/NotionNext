import BLOG from '@/blog.config'
import { FacebookProvider, Page } from 'react-facebook'
import { FacebookIcon } from 'react-share'

/**
 * facebook个人主页
 * @returns
 */
const FacebookPage = () => {
  if (!BLOG.FACEBOOK_APP_ID || !BLOG.FACEBOOK_PAGE) {
    return <></>
  }
  return <div className="shadow-md hover:shadow-xl dark:text-gray-300 border dark:border-black rounded-xl px-2 py-4 bg-white dark:bg-hexo-black-gray lg:duration-100 justify-center">
    {BLOG.FACEBOOK_PAGE && (
      <div className="flex items-center pb-2">
        <a
          href={BLOG.FACEBOOK_PAGE}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1 pr-2 pt-0"
        >
          <FacebookIcon size={28} round />
        </a>
        <a href={BLOG.FACEBOOK_PAGE} rel="noopener noreferrer" target="_blank">
          {BLOG.FACEBOOK_PAGE_TITLE}
        </a>
      </div>
    )}
    {BLOG.FACEBOOK_APP_ID && <FacebookProvider appId={BLOG.FACEBOOK_APP_ID}>
      <Page href={BLOG.FACEBOOK_PAGE} tabs="timeline" />
    </FacebookProvider>}
  </div>
}
export default FacebookPage
