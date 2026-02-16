import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { resolvePostProps } from '@/lib/db/SiteDataApi'
import { DynamicLayout } from '@/themes/theme'

/**
 * 根据notion的slug访问页面
 * 只解析一级目录例如 /about
 * @param {*} props
 * @returns
 */
const Dashboard = props => {
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return <DynamicLayout theme={theme} layoutName='LayoutDashboard' {...props} />
}

export async function getStaticProps({ locale }) {
  const prefix = 'dashboard'
  const props = await resolvePostProps({
    prefix,
    locale,
  })

  return {
    props,
    revalidate: process.env.EXPORT
      ? undefined
      : siteConfig(
        'NEXT_REVALIDATE_SECOND',
        BLOG.NEXT_REVALIDATE_SECOND,
        props.NOTION_CONFIG
      )
  }
}

export const getStaticPaths = () => {
  return {
    paths: [
      { params: { index: [] } }, // 对应首页路径
      { params: { index: ['membership'] } },
      { params: { index: ['balance'] } },
      { params: { index: ['user-profile'] } },
      { params: { index: ['user-profile', 'security'] } }, // 嵌套路由，按结构传递
      { params: { index: ['order'] } },
      { params: { index: ['affiliate'] } }
    ],
    fallback: 'blocking' // 或者 true，阻塞式渲染
  }
}

export default Dashboard
