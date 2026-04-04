const { THEME } = require('./blog.config')
const fs = require('fs')
const path = require('path')
const BLOG = require('./blog.config')
const { extractLangPrefix } = require('./lib/utils/pageId')

// 是否为静态导出
const isExport = Boolean(process.env.EXPORT)

// 打包时是否分析代码
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: BLOG.BUNDLE_ANALYZER
})

// 扫描项目 /themes 下的目录名
const themes = scanSubdirectories(path.resolve(__dirname, 'themes'))

// 检测用户开启的多语言
const locales = (function () {
  const langs = [BLOG.LANG]

  if (BLOG.NOTION_PAGE_ID.indexOf(',') > 0) {
    const siteIds = BLOG.NOTION_PAGE_ID.split(',')
    for (let index = 0; index < siteIds.length; index++) {
      const siteId = siteIds[index]
      const prefix = extractLangPrefix(siteId)
      if (prefix && !langs.includes(prefix)) {
        langs.push(prefix)
      }
    }
  }

  return langs
})()

// 编译前执行
// eslint-disable-next-line no-unused-vars
const preBuild = (function () {
  const lifecycle = process.env.npm_lifecycle_event

  if (lifecycle !== 'export' && lifecycle !== 'build') {
    return
  }

  // 删除 public/sitemap.xml 文件；否则会和 /pages/sitemap.xml.js 冲突
  const sitemapPath = path.resolve(__dirname, 'public', 'sitemap.xml')
  if (fs.existsSync(sitemapPath)) {
    fs.unlinkSync(sitemapPath)
    console.log('Deleted existing sitemap.xml from public directory')
  }

  // 删除根目录 sitemap.xml
  const sitemap2Path = path.resolve(__dirname, 'sitemap.xml')
  if (fs.existsSync(sitemap2Path)) {
    fs.unlinkSync(sitemap2Path)
    console.log('Deleted existing sitemap.xml from root directory')
  }
})()

/**
 * 扫描指定目录下的文件夹名，用于获取所有主题
 * @param {string} directory
 * @returns {string[]}
 */
function scanSubdirectories(directory) {
  const subdirectories = []

  fs.readdirSync(directory).forEach(file => {
    const fullPath = path.join(directory, file)
    const stats = fs.statSync(fullPath)
    if (stats.isDirectory()) {
      subdirectories.push(file)
    }
  })

  return subdirectories
}

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true
  },

  output: isExport
    ? 'export'
    : process.env.NEXT_BUILD_STANDALONE === 'true'
      ? 'standalone'
      : undefined,

  staticPageGenerationTimeout: 120,

  // 性能优化配置
  compress: true,
  poweredByHeader: false,
  generateEtags: true,

  // 构建优化
  swcMinify: true,
  modularizeImports: {
    '@heroicons/react/24/outline': {
      transform: '@heroicons/react/24/outline/{{member}}'
    },
    '@heroicons/react/24/solid': {
      transform: '@heroicons/react/24/solid/{{member}}'
    }
  },

  // 多语言，在 export 时禁用
  i18n: isExport
    ? undefined
    : {
        defaultLocale: BLOG.LANG,
        locales,
        localeDetection: false
      },

  images: {
    // 关键修复：静态导出时禁用 next/image 默认优化
    unoptimized: isExport,

    // 图片压缩和格式优化
    formats: ['image/avif', 'image/webp'],

    // 图片尺寸优化
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // 允许 next/image 加载的图片域名
    domains: [
      'gravatar.com',
      'www.notion.so',
      'avatars.githubusercontent.com',
      'images.unsplash.com',
      'source.unsplash.com',
      'p1.qhimg.com',
      'webmention.io',
      'images.pexels.com',
      'picsum.photos',
      'imagedelivery.net',
      'ko-fi.com'
    ],

    // 默认加载器保留即可；静态导出时由 unoptimized 接管
    loader: 'default',

    // 图片缓存优化
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7天

    // 危险的允许 SVG
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  },

  // 默认将 feed 重定向至 /public/rss/feed.xml
  redirects: isExport
    ? undefined
    : async () => {
        return [
          {
            source: '/feed',
            destination: '/rss/feed.xml',
            permanent: true
          }
        ]
      },

  // 重写 url
  rewrites: isExport
    ? undefined
    : async () => {
        const langsRewrites = []

        if (BLOG.NOTION_PAGE_ID.indexOf(',') > 0) {
          const siteIds = BLOG.NOTION_PAGE_ID.split(',')
          const langs = []

          for (let index = 0; index < siteIds.length; index++) {
            const siteId = siteIds[index]
            const prefix = extractLangPrefix(siteId)
            if (prefix) {
              langs.push(prefix)
            }
            console.log('[Locales]', siteId)
          }

          if (langs.length > 0) {
            langsRewrites.push(
              {
                source: `/:locale(${langs.join('|')})/:path*`,
                destination: '/:path*'
              },
              {
                source: `/:locale(${langs.join('|')})`,
                destination: '/'
              },
              {
                source: `/:locale(${langs.join('|')})/`,
                destination: '/'
              }
            )
          }
        }

        return [
          ...langsRewrites,
          {
            source: '/:path*.html',
            destination: '/:path*'
          }
        ]
      },

  headers: isExport
    ? undefined
    : async () => {
        return [
          {
            source: '/:path*{/}?',
            headers: [
              { key: 'Access-Control-Allow-Credentials', value: 'true' },
              { key: 'Access-Control-Allow-Origin', value: '*' },
              {
                key: 'Access-Control-Allow-Methods',
                value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT'
              },
              {
                key: 'Access-Control-Allow-Headers',
                value:
                  'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
              }

              // 安全头部相关配置，谨慎开启
              // { key: 'X-Frame-Options', value: 'DENY' },
              // { key: 'X-Content-Type-Options', value: 'nosniff' },
              // { key: 'X-XSS-Protection', value: '1; mode=block' },
              // { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
              // { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
              // {
              //   key: 'Strict-Transport-Security',
              //   value: 'max-age=31536000; includeSubDomains; preload'
              // },
              // {
              //   key: 'Content-Security-Policy',
              //   value: [
              //     "default-src 'self'",
              //     "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.googleapis.com *.gstatic.com *.google-analytics.com *.googletagmanager.com",
              //     "style-src 'self' 'unsafe-inline' *.googleapis.com *.gstatic.com",
              //     "img-src 'self' data: blob: *.notion.so *.unsplash.com *.githubusercontent.com *.gravatar.com",
              //     "font-src 'self' *.googleapis.com *.gstatic.com",
              //     "connect-src 'self' *.google-analytics.com *.googletagmanager.com",
              //     "frame-src 'self' *.youtube.com *.vimeo.com",
              //     "object-src 'none'",
              //     "base-uri 'self'",
              //     "form-action 'self'"
              //   ].join('; ')
              // },

              // CORS 配置（更严格）
              // { key: 'Access-Control-Allow-Credentials', value: 'false' },
              // {
              //   key: 'Access-Control-Allow-Origin',
              //   value: process.env.NODE_ENV === 'production'
              //     ? siteConfig('LINK') || 'https://yourdomain.com'
              //     : '*'
              // },
              // { key: 'Access-Control-Max-Age', value: '86400' }
            ]
          }

          // {
          //   source: '/api/:path*',
          //   headers: [
          //     { key: 'X-Frame-Options', value: 'DENY' },
          //     { key: 'X-Content-Type-Options', value: 'nosniff' },
          //     { key: 'Cache-Control', value: 'no-store, max-age=0' },
          //     {
          //       key: 'Access-Control-Allow-Methods',
          //       value: 'GET,POST,PUT,DELETE,OPTIONS'
          //     }
          //   ]
          // }
        ]
      },

  webpack: (config, { dev, isServer }) => {
    // 动态主题：添加 resolve.alias 配置，将动态路径映射到实际路径
    config.resolve.alias['@'] = path.resolve(__dirname)

    if (!isServer) {
      console.log('[默认主题]', path.resolve(__dirname, 'themes', THEME))
    }

    config.resolve.alias['@theme-components'] = path.resolve(
      __dirname,
      'themes',
      THEME
    )

    // 性能优化配置
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all'
            },
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              enforce: true
            }
          }
        }
      }
    }

    // Enable source maps in development mode
    if (dev || process.env.NODE_ENV_API === 'development') {
      config.devtool = 'eval-source-map'
    }

    // 优化模块解析
    config.resolve.modules = [
      path.resolve(__dirname, 'node_modules'),
      'node_modules'
    ]

    return config
  },

  experimental: {
    scrollRestoration: true,
    optimizePackageImports: ['@heroicons/react', 'lodash']
  },

  exportPathMap: function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    // export 静态导出时忽略 /pages/sitemap.xml.js，否则和动态文件冲突
    const pages = { ...defaultPathMap }
    delete pages['/sitemap.xml']
    delete pages['/auth']
    return pages
  },

  publicRuntimeConfig: {
    // 这里的配置既可以服务端获取到，也可以在浏览器端获取到
    THEMES: themes
  }
}

module.exports = process.env.ANALYZE
  ? withBundleAnalyzer(nextConfig)
  : nextConfig
