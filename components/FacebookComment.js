import BLOG from '@/blog.config'
import { FacebookProvider } from 'react-facebook'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const FacbookComment = ({ isDarkMode }) => {
  const theme = isDarkMode ? 'dark' : 'light'
  const { asPath } = useRouter()
  const href = BLOG.LINK + asPath

  useEffect(() => {
    if (window.FB) {
      window.FB.XFBML.parse()
    }
  }, [])
  return (
    // Facebook colorscheme dark 文字還是會是黑色 只好用個框框讓留言不這麼醜。「
    <FacebookProvider appId={BLOG.FACEBOOK_APP_ID}>
      <div className="dark:bg-gray-100 rounded-xl items-center">
        <div
          className="fb-comments"
          data-href={href}
          data-width="100%"
          data-colorscheme={theme}
        ></div>
      </div>
    </FacebookProvider>
  )
}

export default FacbookComment
