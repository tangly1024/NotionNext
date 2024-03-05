import { getGlobalData } from '@/lib/notion/getNotionData'
import BLOG from '@/blog.config'
import { useRouter } from 'next/router'
import { getLayoutByTheme } from '@/themes/theme'
import { siteConfig } from '@/lib/config'

/**
 * 标签首页
 * @param {*} props
 * @returns
 */
const TagIndex = props => {
  // 根据页面路径加载不同Layout文件
  const Layout = getLayoutByTheme({ theme: siteConfig('THEME'), router: useRouter() })
  return <Layout {...props} />
}

export async function getStaticProps() {
  const from = 'tag-index-props'
  const props = await getGlobalData({ from })
  delete props.allPages
  return {
    props,
    revalidate: parseInt(BLOG.NEXT_REVALIDATE_SECOND)
  }
}

export default TagIndex
