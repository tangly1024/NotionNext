import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import { useGlobal } from '@/lib/global'
import dynamic from 'next/dynamic'

/**
 * 404
 * @param {*} props
 * @returns
 */
const NoFound = props => {
  const { theme, siteInfo } = useGlobal()
  const meta = { title: `${props?.siteInfo?.title} | 页面找不到啦`, image: siteInfo?.pageCover }
  const Layout404 = dynamic(() => import(`@/themes/${theme}/Layout404`))
  return <Layout404 {...props} meta={meta}/>
}

export async function getStaticProps () {
  const props = (await getGlobalNotionData({ from: '404' })) || {}
  return { props }
}

export default NoFound
