/**
 * 另一个落地页主题
 */
const CONFIG = {

  STARTER_LOGO: '/images/starter/logo/logo.svg', // 普通logo
  STARTER_LOGO_WHITE: '/images/starter/logo/logo-white.svg', // 透明底浅色logo

  STARTER_HERO_TITLE_1: 'Open-Source Web Template for SaaS, Startup, Apps, and More ', // 英雄区文字
  STARTER_HERO_TITLE_2: 'Multidisciplinary Web Template Built with Your Favourite Technology - HTML Bootstrap, Tailwind and React NextJS.', // 英雄区文字
  STARTER_HERO_TITLE_3: 'Built with latest technology ', // 英雄区文字
  STARTER_HERO_BUTTON_1_TEXT: 'Start Now', // 英雄区按钮
  STARTER_HERO_BUTTON_1_URL: 'https://docs.tangly1024.com/article/vercel-deploy-notion-next', // 英雄区按钮
  STARTER_HERO_BUTTON_2_TEXT: 'Star on Github', // 英雄区按钮
  STARTER_HERO_BUTTON_2_URL: 'https://github.com/tangly1024/NotionNext', // 英雄区按钮
  STARTER_HERO_PREVIEW_IMAGE: '/images/starter/hero/hero-image.webp', // 产品预览图 ，默认读取public目录下图片

  STARTER_NAV_BUTTON_1_TEXT: 'Sign In',
  STARTER_NAV_BUTTON_1_URL: '/signin',

  STARTER_NAV_BUTTON_2_TEXT: 'Sign Up',
  STARTER_NAV_BUTTON_2_URL: '/signup',

  STARTER_NEWSLETTER: process.env.NEXT_PUBLIC_THEME_STARTER_NEWSLETTER || false // 是否开启邮件订阅 请先配置mailchimp功能 https://docs.tangly1024.com/article/notion-next-mailchimp
}
export default CONFIG
