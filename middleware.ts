import { NextRequest, NextResponse } from 'next/server'
import { checkStrIsNotionId, getLastPartOfUrl } from '@/lib/utils'
import { idToUuid } from 'notion-utils'
import BLOG from './blog.config'

/**
 * Clerk 身份验证中间件
 */
export const config = {
  // 这里设置白名单，防止静态资源被拦截
  matcher: ['/((?!.*\\..*|_next|/sign-in|/auth).*)', '/', '/(api|trpc)(.*)']
}

// 限制登录访问的路由
// 定义路由模式，稍后在使用时初始化匹配器
const tenantRoutePatterns = [
  '/user/organization-selector(.*)',
  '/user/orgid/(.*)',
  '/dashboard',
  '/dashboard/(.*)'
]

// 限制权限访问的路由
// 定义路由模式，稍后在使用时初始化匹配器
const tenantAdminRoutePatterns = [
  '/admin/(.*)/memberships',
  '/admin/(.*)/domain'
]

/**
 * 没有配置权限相关功能的返回
 * @param req
 * @param ev
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/require-await, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
const noAuthMiddleware = async (req: NextRequest, ev: any) => {
  // 如果没有配置 Clerk 相关环境变量，返回一个默认响应或者继续处理请求
  if (BLOG['UUID_REDIRECT']) {
    let redirectJson: Record<string, string> = {}
    try {
      const response = await fetch(`${req.nextUrl.origin}/redirect.json`)
      if (response.ok) {
        redirectJson = (await response.json()) as Record<string, string>
      }
    } catch (err) {
      console.error('Error fetching static file:', err)
    }
    let lastPart = getLastPartOfUrl(req.nextUrl.pathname) as string
    if (checkStrIsNotionId(lastPart)) {
      lastPart = idToUuid(lastPart)
    }
    if (lastPart && redirectJson[lastPart]) {
      const redirectToUrl = req.nextUrl.clone()
      redirectToUrl.pathname = '/' + redirectJson[lastPart]
      console.log(
        `redirect from ${req.nextUrl.pathname} to ${redirectToUrl.pathname}`
      )
      return NextResponse.redirect(redirectToUrl, 308)
    }
  }
  return NextResponse.next()
}
/**
 * 鉴权中间件
 */
const authMiddleware = async (req: NextRequest, ev: any) => {
  if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    try {
      // 动态导入Clerk相关函数
      const { clerkMiddleware, createRouteMatcher } = await import('@clerk/nextjs/server')

      // 初始化路由匹配器
      const isTenantRoute = createRouteMatcher(tenantRoutePatterns)
      const isTenantAdminRoute = createRouteMatcher(tenantAdminRoutePatterns)

      // 使用Clerk中间件
      return clerkMiddleware(async (auth: any, req: NextRequest) => {
        const { userId } = auth()
        // 处理 /dashboard 路由的登录保护
        if (isTenantRoute(req)) {
          if (!userId) {
            // 用户未登录，重定向到 /sign-in
            const url = new URL('/sign-in', req.url)
            url.searchParams.set('redirectTo', req.url) // 保存重定向目标
            return NextResponse.redirect(url)
          }
        }

        // 处理管理员相关权限保护
        if (isTenantAdminRoute(req)) {
          auth().protect((has: any) => {
            return (
              has({ permission: 'org:sys_memberships:manage' }) ||
              has({ permission: 'org:sys_domains_manage' })
            )
          })
        }

        // 默认继续处理请求
        return NextResponse.next()
      })(req, ev)
    } catch (error) {
      console.error('Error loading Clerk middleware:', error)
      return noAuthMiddleware(req, ev)
    }
  } else {
    return noAuthMiddleware(req, ev)
  }
}

export default authMiddleware
