const { THEME } = require('./blog.config');
const fs = require('fs');
const path = require('path');
const BLOG = require('./blog.config');
const withBundleAnalyzer = require('@next/bundle-analyzer')({

enabled: BLOG.BUNDLE_ANALYZER
});

/**
 * Scans the subdirectories of the specified directory to get all themes
 * @param {*} directory
 * @returns
 */
function scanSubdirectories(directory) {
const subdirectories = [];

fs.readdirSync(directory).forEach(file => {
  const fullPath = path.join(directory, file);
  const stats = fs.statSync(fullPath);
  if (stats.isDirectory()) {
    subdirectories.push(file);
  }
});

return subdirectories;
}

// Scan the directories under /themes in the project
const themes = scanSubdirectories(path.resolve(__dirname, 'themes'));

module.exports = withBundleAnalyzer({
images: {
  // Image compression
  formats: ['image/avif', 'image/webp'],
  // Allowed domains for next/image to load images from
  domains: [
    'gravatar.com',
    'www.notion.so',
    'avatars.githubusercontent.com',
    'images.unsplash.com',
    'source.unsplash.com',
    'p1.qhimg.com',
    'webmention.io',
    'ko-fi.com'
  ]
},
// Redirect /feed to /rss/feed.xml by default
async redirects() {
  return [
    {
      source: '/feed',
      destination: '/rss/feed.xml',
      permanent: true
    }
  ];
},
async rewrites() {
  return [
    {
      source: '/:path*.html',
      destination: '/:path*'
    }
  ];
},
async headers() {
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
      ]
    }
  ];
},
webpack: (config, { dev, isServer }) => {
  // Replace React with Preact only in client production build
  // if (!dev && !isServer) {
  //   Object.assign(config.resolve.alias, {
  //     react: 'preact/compat',
  //     'react-dom/test-utils': 'preact/test-utils',
  //     'react-dom': 'preact/compat'
  //   })
  // }
  // Dynamic theme: Add resolve.alias configuration to map dynamic paths to actual paths
  if (!isServer) {
    console.log('[Loading theme]', path.resolve(__dirname, 'themes', THEME));
  }
  config.resolve.alias['@theme-components'] = path.resolve(__dirname, 'themes', THEME);
  return config;
},
experimental: {
  scrollRestoration: true
},
exportPathMap: async function (defaultPathMap, { dev, dir, outDir, distDir, buildId }) {
  // Ignore /pages/sitemap.xml.js when exporting, otherwise it will throw getServerSideProps error
  const pages = { ...defaultPathMap };
  delete pages['/sitemap.xml'];
  return pages;
},
publicRuntimeConfig: { // This configuration can be accessed both on the server and in the browser
  NODE_ENV_API: process.env.NODE_ENV_API || 'prod',
  THEMES: themes
}
});
