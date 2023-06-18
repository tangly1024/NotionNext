import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import { useGlobal } from '@/lib/global'
import dynamic from 'next/dynamic'
import Loading from '@/components/Loading'
import { Suspense, useEffect, useState } from 'react'
import BLOG from '@/blog.config'

const layout = 'Layout404'
/**
 * 加载默认主题
 */
const DefaultLayout = dynamic(() => import(`@/themes/${BLOG.THEME}/${layout}`), { ssr: true })

/**
 * 404
 * @param {*} props
 * @returns
 */
const NoFound = props => {
  const { theme, siteInfo } = useGlobal()
  const meta = { title: `${props?.siteInfo?.title} | 页面找不到啦`, image: siteInfo?.pageCover }
  const [Layout, setLayout] = useState(DefaultLayout)
  useEffect(() => {
    const loadLayout = async () => {
      const newLayout = await dynamic(() => import(`@/themes/${theme}/${layout}`))
      setLayout(newLayout)
    }
    loadLayout()
  }, [theme])

  props = { ...props, meta }

  return <Suspense fallback={<Loading/>}>
    <Layout {...props} />
  </Suspense>
}

export async function getStaticProps () {
  const props = (await getGlobalNotionData({ from: '404' })) || {}
  return { props }
}

export default NoFound
