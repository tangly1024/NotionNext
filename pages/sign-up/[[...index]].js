import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getGlobalData } from '@/lib/db/getSiteData'
import { getLayoutByTheme } from '@/themes/theme'
import { useRouter } from 'next/router'

/**
 * 注册
 * @param {*} props
 * @returns
 */
const SignUp = props => {
  // 根据页面路径加载不同Layout文件
  const Layout = getLayoutByTheme({
    theme: siteConfig('THEME'),
    router: useRouter()
  })
  return <Layout {...props} />
}

export async function getStaticProps(req) {
  const { locale } = req

  const from = 'SignIn'
  const props = await getGlobalData({ from, locale })

  delete props.allPages
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

/**
 * catch-all route for clerk
 * @returns
 */
export async function getStaticPaths() {
  return {
    paths: [
      { params: { index: [] } }, // 使 /sign-up 路径可访问
      { params: { index: ['sign-up'] } } // 明确 sign-up 生成路径
    ],
    fallback: 'blocking' // 使用 'blocking' 模式让未生成的路径也能正确响应
  }
}
export default SignUp
