import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getGlobalData } from '@/lib/db/getSiteData'
// import { getGlobalData } from '@/lib/db/getSiteData'
import { DynamicLayout } from '@/themes/theme'

/**
 * 登录
 * @param {*} props
 * @returns
 */
const SignIn = props => {
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return <DynamicLayout theme={theme} layoutName='LayoutSignIn' {...props} />
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
export function getStaticPaths() {
  return {
    paths: [
      { params: { index: [] } }, // 使 /sign-in 路径可访问
      { params: { index: ['factor-one'] } } // 明确 sign-in 生成路径
    ],
    fallback: 'blocking' // 使用 'blocking' 模式让未生成的路径也能正确响应
  }
}

export default SignIn
