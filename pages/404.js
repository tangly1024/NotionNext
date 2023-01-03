import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import * as ThemeMap from '@/themes'
import { useGlobal } from '@/lib/global'

/**
 * 404
 * @param {*} props
 * @returns
 */
const NoFound = props => {
  const { theme, siteInfo } = useGlobal()
  const ThemeComponents = ThemeMap[theme]
  const meta = { title: `${props?.siteInfo?.title} | 页面找不到啦`, image: siteInfo?.pageCover }
  return <ThemeComponents.Layout404 {...props} meta={meta}/>
}

export async function getStaticProps () {
  const props = await getGlobalNotionData({ from: '404' }) || {}
  return { props }
}

export default NoFound
