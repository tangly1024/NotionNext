/**
 * 另一个落地页主题
 */
const CONFIG = {

  STARTER_LOGO: '/images/landing-2/logo/logo.svg', // 普通logo
  STARTER_LOGO_WHITE: '/images/landing-2/logo/logo-white.svg', // 透明底浅色logo

  STARTER_NEWSLETTER: process.env.NEXT_PUBLIC_THEME_LANDING_NEWSLETTER || false // 是否开启邮件订阅 请先配置mailchimp功能 https://docs.tangly1024.com/article/notion-next-mailchimp
}
export default CONFIG
