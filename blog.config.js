// 注: process.env.XX是Vercel的环境变量，配置方式见：https://docs.tangly1024.com/article/how-to-config-notion-next#c4768010ae7d44609b744e79e2f9959a

const BLOG = {
  API_BASE_URL: process.env.API_BASE_URL || 'https://barryprivate.notion.site/api/v3', // API默认请求地址,可以配置成自己的地址例如：https://[xxxxx].notion.site/api/v3
  // Important page_id！！！Duplicate Template from  https://tanghh.notion.site/02ab3b8678004aa69e9e415905ef32a5
  NOTION_PAGE_ID:
    process.env.NOTION_PAGE_ID ||
    '02ab3b8678004aa69e9e415905ef32a5,en:7c1d570661754c8fbc568e00a01fd70e',
  THEME: process.env.NEXT_PUBLIC_THEME || 'heo', // 当前主题，在themes文件夹下可找到所有支持的主题；主题名称就是文件夹名，例如 example,fukasawa,gitbook,heo,hexo,landing,matery,medium,next,nobelium,plog,simple

  LANG: process.env.NEXT_PUBLIC_LANG || 'zh-CN', // e.g 'zh-CN','en-US'  see /lib/lang.js for more.
  SINCE: process.env.NEXT_PUBLIC_SINCE || 2025, // e.g if leave this empty, current year will be used.

  PSEUDO_STATIC: process.env.NEXT_PUBLIC_PSEUDO_STATIC || false, // 伪静态路径，开启后所有文章URL都以 .html 结尾。
  NEXT_REVALIDATE_SECOND: process.env.NEXT_PUBLIC_REVALIDATE_SECOND || 60, // 更新缓存间隔 单位(秒)；即每个页面有60秒的纯静态期、此期间无论多少次访问都不会抓取notion数据；调大该值有助于节省Vercel资源、同时提升访问速率，但也会使文章更新有延迟。
  REVALIDATION_TOKEN: process.env.REVALIDATION_TOKEN || '', // On-Demand Revalidation Token，设置后可通过 POST /api/revalidate 立即刷新页面缓存（解决 Notion 内容更新延迟问题）
  APPEARANCE: process.env.NEXT_PUBLIC_APPEARANCE || 'auto', // ['light', 'dark', 'auto'], // light 日间模式 ， dark夜间模式， auto根据时间和主题自动夜间模式
  APPEARANCE_DARK_TIME: process.env.NEXT_PUBLIC_APPEARANCE_DARK_TIME || [16, 7], // 夜间模式起至时间，false时关闭根据时间自动切换夜间模式
  AUTHOR: process.env.NEXT_PUBLIC_AUTHOR || 'BarryZed', // 您的昵称 例如 tangly1024
  BIO: process.env.NEXT_PUBLIC_BIO || '专注于眼前的事物吧。', // 作者简介
  LINK: process.env.NEXT_PUBLIC_LINK || 'https://www.barryzed.top', // 网站地址
  KEYWORDS: process.env.NEXT_PUBLIC_KEYWORD || '游戏,编程,个人', // 网站关键词 英文逗号隔开

  BLOG_FAVICON: process.env.NEXT_PUBLIC_FAVICON || '/favicon.ico', // blog favicon 配置, 默认使用 /public/favicon.ico，支持在线图片，如 https://img.imesong.com/favicon.png
  BEI_AN: process.env.NEXT_PUBLIC_BEI_AN || '黑ICP备2025035555', // 备案号 闽ICP备XXXXXX
  PWA_ENABLE: process.env.NEXT_PUBLIC_PWA_ENABLE || false, // 是否启用 PWA 安装入口；也可在 Notion_Config 中配置 PWA_ENABLE=true
  PWA_NAME: process.env.NEXT_PUBLIC_PWA_NAME || '', // PWA 安装名称；默认读取站点标题，通常无需单独配置
  PWA_SHORT_NAME: process.env.NEXT_PUBLIC_PWA_SHORT_NAME || '', // PWA 短名称；默认读取站点标题，通常无需单独配置
  PWA_ICON: process.env.NEXT_PUBLIC_PWA_ICON || '', // PWA 页面图标（apple-touch-icon / favicon 回退）；不控制 manifest 安装图标，manifest 使用内置尺寸合规的 PNG
  PWA_ICON_192: process.env.NEXT_PUBLIC_PWA_ICON_192 || '', // 可选：覆盖 manifest 192x192 普通图标；须提供真实 192×192 尺寸的资源路径
  PWA_ICON_512: process.env.NEXT_PUBLIC_PWA_ICON_512 || '', // 可选：覆盖 manifest 512x512 普通图标；须提供真实 512×512 尺寸的资源路径
  PWA_ICON_192_MASKABLE: process.env.NEXT_PUBLIC_PWA_ICON_192_MASKABLE || '', // 可选：覆盖 manifest 192x192 maskable 图标；资源应留有足够安全边距
  PWA_ICON_512_MASKABLE: process.env.NEXT_PUBLIC_PWA_ICON_512_MASKABLE || '', // 可选：覆盖 manifest 512x512 maskable 图标；资源应留有足够安全边距
  PWA_THEME_COLOR: process.env.NEXT_PUBLIC_PWA_THEME_COLOR || '', // PWA 主题色
  PWA_BACKGROUND_COLOR: process.env.NEXT_PUBLIC_PWA_BACKGROUND_COLOR || '', // PWA 启动画面背景色
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
  ...require('./conf/ai.config'), // AI 相关配置（AI摘要、AI聊天机器人等）
  ...require('./conf/performance.config'), // 性能优化配置
  ...require('./conf/top-tag.config'), // 置顶文章全局配置

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
  CAN_COPY: process.env.NEXT_PUBLIC_CAN_COPY || false, // 是否允许复制页面内容，默认允许；可被文章属性 CAN_COPY / ext.CAN_COPY 覆盖。

  ...require('./conf/techgrow.config'), // 公众号导流插件（TechGrow）

  // 侧栏布局 是否反转(左变右,右变左) 已支持主题: hexo next medium fukasawa example
  LAYOUT_SIDEBAR_REVERSE:
    process.env.NEXT_PUBLIC_LAYOUT_SIDEBAR_REVERSE || true,

  // 欢迎语打字效果,Hexo,Matery主题支持, 英文逗号隔开多个欢迎语。
  GREETING_WORDS:
    process.env.NEXT_PUBLIC_GREETING_WORDS ||
    '我希望事情是本来的样子而不是我臆想的样子。,放下助人情节，尊重他人命运。,童话也是生活的一部分。,你和你喜欢的人一起坐过摩天轮吗？,欸？这狗怎么上来的？',

  // 欢迎语打字效果类型速度
  GREETING_WORDS_TYPE_SPEED:
    process.env.NEXT_PUBLIC_GREETING_WORDS_TYPE_SPEED || 200,

  // 欢迎语打字效果回退速度
  GREETING_WORDS_BACK_SPEED:
    process.env.NEXT_PUBLIC_GREETING_WORDS_BACK_SPEED || 100,

  // uuid重定向至 slug
  UUID_REDIRECT: process.env.UUID_REDIRECT || false,

  // 内嵌 Notion 子页面 URL 跟随父级文章路径，例如 /article/post/{pageId}
  INNER_PAGE_URL_PARENT_PATH:
    process.env.NEXT_PUBLIC_INNER_PAGE_URL_PARENT_PATH || false,

  // HEO 主题：今日卡牌「每日一句」句子列表（点击「换一个」随机切换）
  HEO_HERO_QUOTES:
    process.env.NEXT_PUBLIC_HEO_HERO_QUOTES?.split(',') || [
      '我的个人朋友圈上线啦！',
      '喝的多了兑了水的水也会醉。'
    ]
}

module.exports = BLOG
