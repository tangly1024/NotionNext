import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { DynamicLayout } from '@/themes/theme'

/**
 * 404
 * @param {*} props
 * @returns
 */
const NoFound = props => {
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return <DynamicLayout theme={theme} layoutName='Layout404' {...props} />
}

export function getStaticProps() {
  return {
    props: {
      siteInfo: {
        title: 'AI博士Charlii',
        description: '分享AIGC与实用技能',
        pageCover: '/bg_image.jpg'
      },
      latestPosts: [],
      allNavPages: [],
      NOTION_CONFIG: {}
    }
  }
}

export default NoFound
