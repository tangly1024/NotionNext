import BlogPostListPage from './components/BlogPostListPage'
import Header from './components/Header'
import CONFIG_APPLE_IOS_HEXO from './config_apple_ios_hexo'
import LayoutBase from './LayoutBase'

export const LayoutIndex = props => {
  return (
    <LayoutBase
      {...props}
      headerSlot={
        CONFIG_APPLE_IOS_HEXO.HOME_BANNER_ENABLE && <Header {...props} />
      }
    >
      <BlogPostListPage {...props} />
    </LayoutBase>
  )
}
