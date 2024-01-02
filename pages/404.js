import { getGlobalData } from '@/lib/notion/getNotionData'
import { useRouter } from 'next/router'
import { getLayoutByTheme } from '@/themes/theme'
import { siteConfig } from '@/lib/config'

/**
 * 404
 * @param {*} props
 * @returns
 */
const NoFound = props => {
  const meta = { title: `${siteConfig('TITLE')} | 页面找不到啦`, image: siteConfig('HOME_BANNER_IMAGE') }

  props = { ...props, meta }

  // 根据页面路径加载不同Layout文件
  const Layout = getLayoutByTheme({ theme: siteConfig('THEME'), router: useRouter() })

  return <Layout {...props} />
}

export async function getStaticProps () {
  const props = (await getGlobalData({ from: '404' })) || {}
  return { props }
}

export default NoFound
