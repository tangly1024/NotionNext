import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import { useGlobal } from '@/lib/global'

/**
 * 404
 * @param {*} props
 * @returns
 */
const NoFound = props => {
  const { Layout } = props
  const { siteInfo } = useGlobal()
  const meta = { title: `${props?.siteInfo?.title} | 页面找不到啦`, image: siteInfo?.pageCover }

  props = { ...props, meta }

  return <Layout {...props} />
}

export async function getStaticProps () {
  const props = (await getGlobalNotionData({ from: '404' })) || {}
  return { props }
}

export default NoFound
