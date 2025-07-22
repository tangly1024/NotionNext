import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
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
const isTenantRoute = createRouteMatcher([
  '/user/organization-selector(.*)',
  '/user/orgid/(.*)',
  '/dashboard',
  '/dashboard/(.*)'
])

// 限制权限访问的路由
const isTenantAdminRoute = createRouteMatcher([
  '/admin/(.*)/memberships',
  '/admin/(.*)/domain'
])

/**
 * 没有配置权限相关功能的返回
 * @param req
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/require-await
const noAuthMiddleware = async (req: NextRequest) => {
  let response = NextResponse.next()
  
  // 如果没有配置 Clerk 相关环境变量，返回一个默认响应或者继续处理请求
  if (BLOG['UUID_REDIRECT']) {
    let redirectJson: Record<string, string> = {}
    try {
      const fetchResponse = await fetch(`${req.nextUrl.origin}/redirect.json`)
      if (fetchResponse.ok) {
        redirectJson = (await fetchResponse.json()) as Record<string, string>
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
      response = NextResponse.redirect(redirectToUrl, 308)
    }
  }
  
  // 添加性能优化头
  addPerformanceOptimizations(req, response)
  
  return response
}

/**
 * 添加性能优化头和策略
 */
function addPerformanceOptimizations(request: NextRequest, response: NextResponse) {
  const url = request.nextUrl
  const pathname = url.pathname
  
  // 添加资源提示
  addResourceHints(pathname, response)
  
  // 添加压缩头
  addCompressionHeaders(request, response)
  
  // 添加缓存头
  addCacheHeaders(pathname, response)
  
  // 添加安全头
  addSecurityHeaders(response)
}

/**
 * 添加资源提示
 */
function addResourceHints(pathname: string, response: NextResponse) {
  const hints: string[] = []
  
  // 首页预加载关键资源
  if (pathname === '/') {
    hints.push(
      '</css/critical.css>; rel=preload; as=style',
      '</js/critical.js>; rel=preload; as=script',
      '</fonts/main.woff2>; rel=preload; as=font; crossorigin'
    )
  }
  
  // 文章页面预加载
  if (pathname.startsWith('/post/') || pathname.includes('/article/')) {
    hints.push(
      '</css/post.css>; rel=preload; as=style',
      '</js/post.js>; rel=preload; as=script'
    )
  }
  
  // 管理页面预加载
  if (pathname.startsWith('/admin/')) {
    hints.push(
      '</css/admin.css>; rel=preload; as=style',
      '</js/admin.js>; rel=preload; as=script'
    )
  }
  
  if (hints.length > 0) {
    response.headers.set('Link', hints.join(', '))
  }
}

/**
 * 添加压缩头
 */
function addCompressionHeaders(request: NextRequest, response: NextResponse) {
  const acceptEncoding = request.headers.get('accept-encoding') || ''
  
  // 设置Vary头以支持不同的压缩格式
  response.headers.set('Vary', 'Accept-Encoding, Accept')
  
  // 对于支持的内容类型启用压缩
  const contentType = response.headers.get('content-type') || ''
  const compressibleTypes = [
    'text/html',
    'text/css',
    'text/javascript',
    'application/javascript',
    'application/json',
    'text/xml',
    'application/xml',
    'image/svg+xml'
  ]
  
  if (compressibleTypes.some(type => contentType.includes(type))) {
    if (acceptEncoding.includes('br')) {
      response.headers.set('Content-Encoding', 'br')
    } else if (acceptEncoding.includes('gzip')) {
      response.headers.set('Content-Encoding', 'gzip')
    }
  }
}

/**
 * 添加缓存头
 */
function addCacheHeaders(pathname: string, response: NextResponse) {
  // 静态资源长期缓存
  if (pathname.startsWith('/_next/static/') || 
      pathname.match(/\.(js|css|png|jpg|jpeg|gif|webp|svg|woff|woff2|ico)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    response.headers.set('Expires', new Date(Date.now() + 31536000 * 1000).toUTCString())
  }
  
  // API响应缓存
  else if (pathname.startsWith('/api/')) {
    if (pathname.includes('/seo/') || pathname.includes('/analytics/')) {
      response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=600')
    } else if (pathname.includes('/admin/')) {
      response.headers.set('Cache-Control', 'private, max-age=0, no-cache')
    } else {
      response.headers.set('Cache-Control', 'public, max-age=60')
    }
  }
  
  // 页面缓存
  else if (!pathname.startsWith('/admin/') && !pathname.startsWith('/dashboard/')) {
    response.headers.set('Cache-Control', 'public, max-age=3600, must-revalidate')
  }
  
  // 添加ETag
  const etag = generateETag(pathname)
  response.headers.set('ETag', etag)
}

/**
 * 添加安全头
 */
function addSecurityHeaders(response: NextResponse) {
  // 内容安全策略
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.google.com *.googleapis.com *.gstatic.com",
    "style-src 'self' 'unsafe-inline' *.googleapis.com *.gstatic.com",
    "img-src 'self' data: blob: *.google.com *.googleapis.com *.gstatic.com",
    "font-src 'self' *.googleapis.com *.gstatic.com",
    "connect-src 'self' *.google.com *.googleapis.com",
    "frame-src 'self' *.google.com",
    "object-src 'none'",
    "base-uri 'self'"
  ]
  
  response.headers.set('Content-Security-Policy', cspDirectives.join('; '))
  
  // 其他安全头
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()')
  
  // HSTS (仅在HTTPS环境下)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  }
}

/**
 * 生成ETag
 */
function generateETag(pathname: string): string {
  // 使用简单的哈希算法替代crypto模块，适用于Edge Runtime
  const str = pathname + (process.env.BUILD_ID || Date.now())
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // 转换为32位整数
  }
  return `"${Math.abs(hash).toString(16)}"`
}
/**
 * 鉴权中间件
 */
const authMiddleware = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  ? clerkMiddleware((auth, req) => {
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
        auth().protect(has => {
          return (
            has({ permission: 'org:sys_memberships:manage' }) ||
            has({ permission: 'org:sys_domains_manage' })
          )
        })
      }

      // 默认继续处理请求
      return NextResponse.next()
    })
  : noAuthMiddleware

export default authMiddleware
