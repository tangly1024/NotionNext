import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

/**
 * clerk 身份验证中间件
 */
export const config = {
  // 这里设置白名单，防止静态资源被拦截
  matcher: ['/((?!.*\\..*|_next|/sign-in).*)', '/', '/(api|trpc)(.*)']
}

// 被保护的路由

const isTenantRoute = createRouteMatcher([
  '/user/organization-selector(.*)',
  '/user/orgid/(.*)'
])

// 被限制权限的路由
const isTenantAdminRoute = createRouteMatcher([
  '/admin/(.*)/memberships',
  '/admin/(.*)/domain'
])

// 路由登录及权限检查
export default clerkMiddleware(
  (auth, req) => {
    // Restrict admin routes to users with specific permissions
    if (isTenantAdminRoute(req)) {
      auth().protect(has => {
        return (
          has({ permission: 'org:sys_memberships:manage' }) ||
          has({ permission: 'org:sys_domains_manage' })
        )
      })
    }
    // Restrict organization routes to signed in users
    if (isTenantRoute(req)) auth().protect()
  }
  //   { debug: process.env.npm_lifecycle_event === 'dev' } // 开发调试模式打印日志
)
