/**
 * 公众号导流插件（TechGrow）
 * - 可在 Notion 的 Config 页面用“同名键”覆盖这里的值（Config 优先级更高）
 * - 建议在 Config 页面至少配置以下四项：
 *   TECH_GROW_BLOG_ID / TECH_GROW_NAME / TECH_GROW_QRCODE / TECH_GROW_KEYWORD
 */
module.exports = {
  // 必填 TechGrow后台生成的博客ID
  TECH_GROW_BLOG_ID:
    process.env.NEXT_PUBLIC_TECH_GROW_BLOG_ID ||
    process.env.TECH_GROW_BLOG_ID ||
    '',
  // 必填 公众号名称
  TECH_GROW_NAME:
    process.env.NEXT_PUBLIC_TECH_GROW_NAME ||
    process.env.TECH_GROW_NAME ||
    '',
  // 必填 公众号二维码
  TECH_GROW_QRCODE:
    process.env.NEXT_PUBLIC_TECH_GROW_QRCODE ||
    process.env.TECH_GROW_QRCODE ||
    '',
  // 必填 公众号回复关键词
  TECH_GROW_KEYWORD:
    process.env.NEXT_PUBLIC_TECH_GROW_KEYWORD ||
    process.env.TECH_GROW_KEYWORD ||
    '',

  // 常用
  TECH_GROW_BTN_TEXT:
    process.env.NEXT_PUBLIC_TECH_GROW_BTN_TEXT ||
    process.env.TECH_GROW_BTN_TEXT ||
    '原创不易，完成人机检测，阅读全文',
  TECH_GROW_VALIDITY_DURATION:
    process.env.NEXT_PUBLIC_TECH_GROW_VALIDITY_DURATION ||
    process.env.TECH_GROW_VALIDITY_DURATION ||
    1,
  TECH_GROW_WHITE_LIST:
    process.env.NEXT_PUBLIC_TECH_GROW_WHITE_LIST ||
    process.env.TECH_GROW_WHITE_LIST ||
    '',
  TECH_GROW_YELLOW_LIST:
    process.env.NEXT_PUBLIC_TECH_GROW_YELLOW_LIST ||
    process.env.TECH_GROW_YELLOW_LIST ||
    '',

  // 资源地址
  TECH_GROW_JS_URL:
    process.env.NEXT_PUBLIC_TECH_GROW_JS_URL ||
    process.env.TECH_GROW_JS_URL ||
    'https://qiniu.techgrow.cn/readmore/dist/readmore.js',
  TECH_GROW_CSS_URL:
    process.env.NEXT_PUBLIC_TECH_GROW_CSS_URL ||
    process.env.TECH_GROW_CSS_URL ||
    'https://qiniu.techgrow.cn/readmore/dist/hexo.css',
  TECH_GROW_CAPTCHA_URL:
    process.env.NEXT_PUBLIC_TECH_GROW_CAPTCHA_URL ||
    process.env.TECH_GROW_CAPTCHA_URL ||
    'https://open.techgrow.cn/#/readmore/captcha/generate?blogId=',
  TECH_GROW_BASE_URL:
    process.env.NEXT_PUBLIC_TECH_GROW_BASE_URL ||
    process.env.TECH_GROW_BASE_URL ||
    ''
}

