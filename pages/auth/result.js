// pages/sitemap.xml.js
import { getGlobalData } from '@/lib/db/getSiteData'
import { useRouter } from 'next/router'
import Slug from '../[prefix]'

/**
/**
 * @returns
 */
export const getStaticProps = async () => {
  const from = `auth`
  const props = await getGlobalData({ from })

  delete props.allPages
  return {
    props
  }
}

/**
 * 根据notion的slug访问页面
 * 解析二级目录 /article/about
 * @param {*} props
 * @returns
 */
const UI = props => {
  const router = useRouter()
  return <Slug {...props} msg={router?.query?.msg} title={'授权结果'} />
}

export default UI
