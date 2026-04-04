const BLOG = require('./blog.config')

/**
 * next-sitemap 配置（当前未被任何 npm script 调用）
 *
 * sitemap 生成策略：
 * - SSR 模式：/pages/sitemap.xml.js 动态生成
 * - 构建时：lib/utils/sitemap.xml.js 写入 public/sitemap.xml（由 pages/index.js getStaticProps 触发）
 * - robots.txt：lib/utils/robots.txt.js 构建时生成
 *
 * next-sitemap 已从 post-build 和 export 脚本中移除，避免覆盖上述自定义输出。
 * 如需手动调用：npx next-sitemap --config next-sitemap.config.js
 */
module.exports = {
  siteUrl: BLOG.LINK,
  changefreq: 'daily',
  priority: 0.7,
  generateRobotsTxt: false,
  sitemapSize: 7000,
  exclude: ['/search', '/search/*', '/404', '/auth']
}
