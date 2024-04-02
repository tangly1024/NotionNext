import { getGlobalData } from '@/lib/db/getSiteData'
import { useRouter } from 'next/router'
import { getLayoutByTheme } from '@/themes/theme'
import { siteConfig } from '@/lib/config'

/**
 * 404
 * @param {*} props
 * @returns
 */
const NoFound = props => {
  // 根据页面路径加载不同Layout文件
  const Layout = getLayoutByTheme({ theme: siteConfig('THEME'), router: useRouter() })
  return <Layout {...props} />
}

export async function getStaticProps () {
  const props = (await getGlobalData({ from: '404' })) || {}
  return { props }
}

export default NoFound
