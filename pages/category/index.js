import { getGlobalData } from '@/lib/notion/getNotionData'
import React from 'react'
import BLOG from '@/blog.config'
import { useRouter } from 'next/router'
import { getLayoutByTheme } from '@/themes/theme'
import { siteConfig } from '@/lib/config'

/**
 * 分类首页
 * @param {*} props
 * @returns
 */
export default function Category(props) {
  // 根据页面路径加载不同Layout文件
  const Layout = getLayoutByTheme({ theme: siteConfig('THEME'), router: useRouter() })

  return <Layout {...props} />
}

export async function getStaticProps() {
  const props = await getGlobalData({ from: 'category-index-props' })
  delete props.allPages
  return {
    props,
    revalidate: parseInt(BLOG.NEXT_REVALIDATE_SECOND)
  }
}
