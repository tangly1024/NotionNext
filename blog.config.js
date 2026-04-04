// 注: process.env.XX是Vercel的环境变量，配置方式见：https://docs.tangly1024.com/article/how-to-config-notion-next#c4768010ae7d44609b744e79e2f9959a

const BLOG = {
  API_BASE_URL: process.env.API_BASE_URL || 'https://www.notion.so/api/v3', // API默认请求地址,可以配置成自己的地址例如：https://[xxxxx].notion.site/api/v3
  // Important page_id！！！Duplicate Template from  https://tanghh.notion.site/02ab3b8678004aa69e9e415905ef32a5
  NOTION_PAGE_ID:
    process.env.NOTION_PAGE_ID ||
    '02ab3b8678004aa69e9e415905ef32a5,en:7c1d570661754c8fbc568e00a01fd70e',
  THEME: process.env.NEXT_PUBLIC_THEME || 'simple', // 当前主题，在themes文件夹下可找到所有支持的主题；主题名称就是文件夹名，例如 example,fukasawa,gitbook,heo,hexo,landing,matery,medium,next,nobelium,plog,simple
  LANG: process.env.NEXT_PUBLIC_LANG || 'zh-CN', // e.g 'zh-CN','en-US'  see /lib/lang.js for more.
  SINCE: process.env.NEXT_PUBLIC_SINCE || 2021, // e.g if leave this empty, current year will be used.

  PSEUDO_STATIC: process.env.NEXT_PUBLIC_PSEUDO_STATIC || false, // 伪静态路径，开启后所有文章URL都以 .html 结尾。
  NEXT_REVALIDATE_SECOND: process.env.NEXT_PUBLIC_REVALIDATE_SECOND || 60, // 更新缓存间隔 单位(秒)；即每个页面有60秒的纯静态期、此期间无论多少次访问都不会抓取notion数据；调大该值有助于节省Vercel资源、同时提升访问速率，但也会使文章更新有延迟。
  APPEARANCE: process.env.NEXT_PUBLIC_APPEARANCE || 'light', // ['light', 'dark', 'auto'], // light 日间模式 ， dark夜间模式， auto根据时间和主题自动夜间模式
  APPEARANCE_DARK_TIME: process.env.NEXT_PUBLIC_APPEARANCE_DARK_TIME || [18, 6], // 夜间模式起至时间，false时关闭根据时间自动切换夜间模式

  AUTHOR: process.env.NEXT_PUBLIC_AUTHOR || 'NotionNext', // 您的昵称 例如 tangly1024
  BIO: process.env.NEXT_PUBLIC_BIO || '一个普通的干饭人🍚', // 作者简介
  LINK: process.env.NEXT_PUBLIC_LINK || 'https://tangly1024.com', // 网站地址
  KEYWORDS: process.env.NEXT_PUBLIC_KEYWORD || 'Notion, 博客', // 网站关键词 英文逗号隔开
  BLOG_FAVICON: process.env.NEXT_PUBLIC_FAVICON || '/favicon.ico', // blog favicon 配置, 默认使用 /public/favicon.ico，支持在线图片，如 https://img.imesong.com/favicon.png
  BEI_AN: process.env.NEXT_PUBLIC_BEI_AN || '', // 备案号 闽ICP备XXXXXX
  BEI_AN_LINK: process.env.NEXT_PUBLIC_BEI_AN_LINK || 'https://beian.miit.gov.cn/', // 备案查询链接，如果用了萌备等备案请在这里填写
  BEI_AN_GONGAN: process.env.NEXT_PUBLIC_BEI_AN_GONGAN || '', // 公安备案号，例如 '浙公网安备3xxxxxxxx8号'

  // RSS订阅
  ENABLE_RSS: process.env.NEXT_PUBLIC_ENABLE_RSS || true, // 是否开启RSS订阅功能

  // 其它复杂配置
  // 原配置文件过长，且并非所有人都会用到，故此将配置拆分到/conf/目录下, 按需找到对应文件并修改即可
  ...require('./conf/comment.config'), // 评论插件
  ...require('./conf/contact.config'), // 作者联系方式配置
  ...require('./conf/post.config'), // 文章与列表配置
  ...require('./conf/analytics.config'), // 站点访问统计
  ...require('./conf/image.config'), // 网站图片相关配置
  ...require('./conf/font.config'), // 网站字体
  ...require('./conf/right-click-menu'), // 自定义右键菜单相关配置
  ...require('./conf/code.config'), // 网站代码块样式
  ...require('./conf/animation.config'), // 动效美化效果
  ...require('./conf/widget.config'), // 悬浮在网页上的挂件，聊天客服、宠物挂件、音乐播放器等
  ...require('./conf/ad.config'), // 广告营收插件
  ...require('./conf/plugin.config'), // 其他第三方插件 algolia全文索引
  ...require('./conf/performance.config'), // 性能优化配置

  // 高级用法
  ...require('./conf/layout-map.config'), // 路由与布局映射自定义，例如自定义特定路由的页面布局
  ...require('./conf/notion.config'), // 读取notion数据库相关的扩展配置，例如自定义表头
  ...require('./conf/dev.config'), // 开发、调试时需要关注的配置

  // 自定义外部脚本，外部样式
  CUSTOM_EXTERNAL_JS: [''], // e.g. ['http://xx.com/script.js','http://xx.com/script.js']
  CUSTOM_EXTERNAL_CSS: [''], // e.g. ['http://xx.com/style.css','http://xx.com/style.css']

  // 自定义菜单
  CUSTOM_MENU: process.env.NEXT_PUBLIC_CUSTOM_MENU || true, // 支持Menu类型的菜单，替代了3.12版本前的Page类型

  // 文章列表相关设置
  CAN_COPY: process.env.NEXT_PUBLIC_CAN_COPY || true, // 是否允许复制页面内容 默认允许，如果设置为false、则全栈禁止复制内容。

  // 公众号导流插件（TechGrow）
  // 可在 Notion 的 Config 页面用“同名键”覆盖这里的值（Config 优先级更高）。
  // 建议在 Config 页面至少配置以下四项：
  // - TECH_GROW_BLOG_ID: TechGrow 后台的 blogId
  // - TECH_GROW_NAME: 公众号名称
  // - TECH_GROW_QRCODE: 公众号二维码图片地址
  // - TECH_GROW_KEYWORD: 公众号回复关键词
  // 常用可选项：
  // - TECH_GROW_ARTICLE_CONTENT_ID: 需要被锁定的正文容器 id（默认 notion-article）
  // - TECH_GROW_BTN_TEXT: 引导按钮文案
  // - TECH_GROW_VALIDITY_DURATION: 验证通过后的有效时长（小时）
  // 名单规则：
  // - TECH_GROW_WHITE_LIST: 白名单（这些路径直接放行）
  // - TECH_GROW_YELLOW_LIST: 黄名单（仅这些路径启用拦截，优先级高于白名单）
  TECH_GROW_BLOG_ID:
    process.env.NEXT_PUBLIC_TECH_GROW_BLOG_ID ||
    process.env.TECH_GROW_BLOG_ID ||
    '',
  TECH_GROW_NAME:
    process.env.NEXT_PUBLIC_TECH_GROW_NAME ||
    process.env.TECH_GROW_NAME ||
    '',
  TECH_GROW_QRCODE:
    process.env.NEXT_PUBLIC_TECH_GROW_QRCODE ||
    process.env.TECH_GROW_QRCODE ||
    '',
  TECH_GROW_KEYWORD:
    process.env.NEXT_PUBLIC_TECH_GROW_KEYWORD ||
    process.env.TECH_GROW_KEYWORD ||
    '',
  TECH_GROW_ARTICLE_CONTENT_ID:
    process.env.NEXT_PUBLIC_TECH_GROW_ARTICLE_CONTENT_ID ||
    process.env.TECH_GROW_ARTICLE_CONTENT_ID ||
    process.env.NEXT_PUBLIC_TECH_GROW_CONTENT_ID ||
    process.env.TECH_GROW_CONTENT_ID ||
    '',
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
  TECH_GROW_JS_URL:
    process.env.NEXT_PUBLIC_TECH_GROW_JS_URL ||
    process.env.TECH_GROW_JS_URL ||
    'https://qiniu.techgrow.cn/readmore/dist/readmore.js',
  TECH_GROW_CSS_URL:
    process.env.NEXT_PUBLIC_TECH_GROW_CSS_URL ||
    process.env.TECH_GROW_CSS_URL ||
    'https://qiniu.techgrow.cn/readmore/dist/hexo.css',
  TECH_GROW_DEBUG:
    process.env.NEXT_PUBLIC_TECH_GROW_DEBUG ||
    process.env.TECH_GROW_DEBUG ||
    true,
  TECH_GROW_ALLOW_MOBILE:
    process.env.NEXT_PUBLIC_TECH_GROW_ALLOW_MOBILE ||
    process.env.TECH_GROW_ALLOW_MOBILE ||
    false,
  TECH_GROW_CAPTCHA_URL:
    process.env.NEXT_PUBLIC_TECH_GROW_CAPTCHA_URL ||
    process.env.TECH_GROW_CAPTCHA_URL ||
    'https://open.techgrow.cn/#/readmore/captcha/generate?blogId=',
  TECH_GROW_BASE_URL:
    process.env.NEXT_PUBLIC_TECH_GROW_BASE_URL ||
    process.env.TECH_GROW_BASE_URL ||
    '',

  // 侧栏布局 是否反转(左变右,右变左) 已支持主题: hexo next medium fukasawa example
  LAYOUT_SIDEBAR_REVERSE:
    process.env.NEXT_PUBLIC_LAYOUT_SIDEBAR_REVERSE || false,

  // 欢迎语打字效果,Hexo,Matery主题支持, 英文逗号隔开多个欢迎语。
  GREETING_WORDS:
    process.env.NEXT_PUBLIC_GREETING_WORDS ||
    'Hi，我是一个程序员, Hi，我是一个打工人,Hi，我是一个干饭人,欢迎来到我的博客🎉',

  // uuid重定向至 slug
  UUID_REDIRECT: process.env.UUID_REDIRECT || false
}

module.exports = BLOG
