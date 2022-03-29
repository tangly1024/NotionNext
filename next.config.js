module.exports = {
  future: {
    webpack5: true
  },
  images: {
    loader: 'akamai',
    path: '',
    domains: ['gravatar.com', 'www.notion.so', 'avatars.githubusercontent.com', 'images.unsplash.com'] // 允许next/image加载的图片 域名
  },
  exportPathMap: async function (defaultPathMap, { dev, dir, outDir, distDir, buildId }) {
    console.log(defaultPathMap)
    return {
      '/': { page: '/' },
      '/archive': { page: 'archive' },
      '/article/[slug]': { page: '/article/[slug]' },
      '/[slug]': { page: '/[slug]' }
    }
  },
  async headers () {
    return [
      {
        source: '/:path*{/}?',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'interest-cohort=()'
          }
        ]
      }
    ]
  },
  webpack: (config, { dev, isServer }) => {
    // Replace React with Preact only in client production build
    if (!dev && !isServer) {
      Object.assign(config.resolve.alias, {
        react: 'preact/compat',
        'react-dom/test-utils': 'preact/test-utils',
        'react-dom': 'preact/compat'
      })
    }
    return config
  }
}
