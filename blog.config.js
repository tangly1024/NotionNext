// 注: process.env.XX是Vercel的环境变量，配置方式见：https://docs.tangly1024.com/article/how-to-config-notion-next#c4768010ae7d44609b744e79e2f9959a

const BLOG = {
  // Important page_id！！！Duplicate Template from  https://www.notion.so/tanghh/02ab3b8678004aa69e9e415905ef32a5
  NOTION_PAGE_ID:
    process.env.NOTION_PAGE_ID ||
    '02ab3b8678004aa69e9e415905ef32a5,en:7c1d570661754c8fbc568e00a01fd70e',
  THEME: process.env.NEXT_PUBLIC_THEME || 'heo', // 当前主题，在themes文件夹下可找到所有支持的主题；主题名称就是文件夹名，例如 example,fukasawa,gitbook,heo,hexo,landing,matery,medium,next,nobelium,plog,simple
  LANG: process.env.NEXT_PUBLIC_LANG || 'zh-CN', // e.g 'zh-CN','en-US'  see /lib/lang.js for more.
  SINCE: process.env.NEXT_PUBLIC_SINCE || 2021, // e.g if leave this empty, current year will be used.

  PSEUDO_STATIC: process.env.NEXT_PUBLIC_PSEUDO_STATIC || true, // 伪静态路径，开启后所有文章URL都以 .html 结尾。
  NEXT_REVALIDATE_SECOND: process.env.NEXT_PUBLIC_REVALIDATE_SECOND || 5, // 更新缓存间隔 单位(秒)；即每个页面有5秒的纯静态期、此期间无论多少次访问都不会抓取notion数据；调大该值有助于节省Vercel资源、同时提升访问速率，但也会使文章更新有延迟。
  APPEARANCE: process.env.NEXT_PUBLIC_APPEARANCE || 'auto', // ['light', 'dark', 'auto'], // light 日间模式 ， dark夜间模式， auto根据时间和主题自动夜间模式
  APPEARANCE_DARK_TIME: process.env.NEXT_PUBLIC_APPEARANCE_DARK_TIME || [18, 6], // 夜间模式起至时间，false时关闭根据时间自动切换夜间模式

  AUTHOR: process.env.NEXT_PUBLIC_AUTHOR || '分享之王', // 您的昵称 例如 tangly1024
  BIO: process.env.NEXT_PUBLIC_BIO || '分享之王 - 专注整理分享学习资源、职场技能、AI工具、软件资源等高价值内容。提供考研资料、技能提升、效率工具推荐，助力个人成长与思维认知升级。', // 作者简介（用作元描述）
  BIO_SHORT: process.env.NEXT_PUBLIC_BIO_SHORT || '一个分享高价值资源的网站', // 首页显示的简短介绍
  LINK: process.env.NEXT_PUBLIC_LINK || 'https://www.shareking.vip', // 网站地址
  KEYWORDS: process.env.NEXT_PUBLIC_KEYWORD || '分享之王, 学习资源, 职场技能, AI工具, 高价值资料, 效率软件, 网盘资源, 免费资源, 技能提升, 考研资料, 影视资源, 软件分享',// 网站关键词 英文逗号隔开
  BLOG_FAVICON: process.env.NEXT_PUBLIC_FAVICON || '/favicon.ico', // blog favicon 配置, 默认使用 /public/favicon.ico，支持在线图片，如 https://img.imesong.com/favicon.png
  BEI_AN: process.env.NEXT_PUBLIC_BEI_AN || '', // 备案号 闽ICP备XXXXXX
  BEI_AN_LINK: process.env.NEXT_PUBLIC_BEI_AN_LINK || 'https://beian.miit.gov.cn/', // 备案查询链接，如果用了萌备等备案请在这里填写

  // RSS订阅
  ENABLE_RSS: process.env.NEXT_PUBLIC_ENABLE_RSS || true, // 是否开启RSS订阅功能

  // SEO增强功能
  SEO_ENHANCED_MODE: process.env.NEXT_PUBLIC_SEO_ENHANCED_MODE || true, // 是否启用增强版SEO
  SEO_DEBUG_MODE: process.env.NEXT_PUBLIC_SEO_DEBUG_MODE || false, // 是否启用SEO调试日志
  SEO_TITLE_SEPARATOR: process.env.NEXT_PUBLIC_SEO_TITLE_SEPARATOR || ' | ', // 标题分隔符
  SEO_MAX_TITLE_LENGTH: process.env.NEXT_PUBLIC_SEO_MAX_TITLE_LENGTH || 60, // 最大标题长度
  SEO_MAX_DESCRIPTION_LENGTH: process.env.NEXT_PUBLIC_SEO_MAX_DESCRIPTION_LENGTH || 160, // 最大描述长度
  SEO_MAX_KEYWORDS: process.env.NEXT_PUBLIC_SEO_MAX_KEYWORDS || 10, // 最大关键词数量
  SEO_ENABLE_STRUCTURED_DATA: process.env.NEXT_PUBLIC_SEO_ENABLE_STRUCTURED_DATA || true, // 启用结构化数据
  SEO_ENABLE_BREADCRUMBS: process.env.NEXT_PUBLIC_SEO_ENABLE_BREADCRUMBS || true, // 启用面包屑
  SEO_ENABLE_HREFLANG: process.env.NEXT_PUBLIC_SEO_ENABLE_HREFLANG || false, // 启用多语言标签
  SEO_BING_SITE_VERIFICATION: process.env.NEXT_PUBLIC_SEO_BING_SITE_VERIFICATION || '', // Bing网站验证

  // Robots.txt配置
  SEO_ROBOTS_ENHANCED: process.env.NEXT_PUBLIC_SEO_ROBOTS_ENHANCED || true, // 启用增强版robots.txt
  SEO_ROBOTS_CRAWL_DELAY: process.env.NEXT_PUBLIC_SEO_ROBOTS_CRAWL_DELAY || 1, // 爬虫延迟（秒）
  SEO_ROBOTS_BLOCK_BOTS: process.env.NEXT_PUBLIC_SEO_ROBOTS_BLOCK_BOTS || true, // 阻止恶意爬虫

  // Sitemap配置
  SEO_SITEMAP_ENHANCED: process.env.NEXT_PUBLIC_SEO_SITEMAP_ENHANCED || true, // 启用增强版sitemap
  SEO_SITEMAP_IMAGES: process.env.NEXT_PUBLIC_SEO_SITEMAP_IMAGES || true, // 启用图片sitemap
  SEO_SITEMAP_NEWS: process.env.NEXT_PUBLIC_SEO_SITEMAP_NEWS || false, // 启用新闻sitemap
  SEO_SITEMAP_VIDEOS: process.env.NEXT_PUBLIC_SEO_SITEMAP_VIDEOS || false, // 启用视频sitemap
  SEO_SITEMAP_CHANGEFREQ_HOME: process.env.NEXT_PUBLIC_SEO_SITEMAP_CHANGEFREQ_HOME || 'daily', // 首页更新频率
  SEO_SITEMAP_CHANGEFREQ_POSTS: process.env.NEXT_PUBLIC_SEO_SITEMAP_CHANGEFREQ_POSTS || 'weekly', // 文章更新频率

  // 自定义分类URL映射
  CUSTOM_CATEGORY_MAPPING: process.env.NEXT_PUBLIC_CUSTOM_CATEGORY_MAPPING || true, // 启用自定义分类URL映射
  CATEGORY_URL_MAPPING: {
    '影视资源': 'movie',
    '软件资源': 'software',
    '教程资源': 'tutorials',
    '游戏资源': 'games',
    '书籍资源': 'books'
  }, // 分类URL映射配置
  SEO_SITEMAP_PRIORITY_HOME: process.env.NEXT_PUBLIC_SEO_SITEMAP_PRIORITY_HOME || 1.0, // 首页优先级
  SEO_SITEMAP_PRIORITY_POSTS: process.env.NEXT_PUBLIC_SEO_SITEMAP_PRIORITY_POSTS || 0.8, // 文章优先级

  // 性能优化配置
  SEO_ENABLE_PERFORMANCE_MONITOR: process.env.NEXT_PUBLIC_SEO_ENABLE_PERFORMANCE_MONITOR || false, // 启用性能监控
  SEO_ENABLE_PRELOAD: process.env.NEXT_PUBLIC_SEO_ENABLE_PRELOAD || true, // 启用资源预加载
  SEO_ENABLE_PREFETCH: process.env.NEXT_PUBLIC_SEO_ENABLE_PREFETCH || true, // 启用资源预取
  SEO_ENABLE_PRECONNECT: process.env.NEXT_PUBLIC_SEO_ENABLE_PRECONNECT || true, // 启用预连接
  SEO_ENABLE_DNS_PREFETCH: process.env.NEXT_PUBLIC_SEO_ENABLE_DNS_PREFETCH || true, // 启用DNS预解析
  SEO_PERFORMANCE_REPORT_URL: process.env.NEXT_PUBLIC_SEO_PERFORMANCE_REPORT_URL || '', // 性能数据上报URL
  SEO_IMAGE_OPTIMIZATION_QUALITY: process.env.NEXT_PUBLIC_SEO_IMAGE_OPTIMIZATION_QUALITY || 75, // 图片优化质量
  SEO_ENABLE_LAZY_LOADING: process.env.NEXT_PUBLIC_SEO_ENABLE_LAZY_LOADING || true, // 启用懒加载
  SEO_ENABLE_VIRTUAL_SCROLL: process.env.NEXT_PUBLIC_SEO_ENABLE_VIRTUAL_SCROLL || false, // 启用虚拟滚动
  SEO_AUTO_GENERATE_ALT: process.env.NEXT_PUBLIC_SEO_AUTO_GENERATE_ALT || true, // 启用自动生成图片ALT属性

  // 404页面SEO优化配置
  SEO_ENHANCED_404: process.env.NEXT_PUBLIC_SEO_ENHANCED_404 || true, // 启用增强版404页面
  SEO_404_MONITOR: process.env.NEXT_PUBLIC_SEO_404_MONITOR || true, // 启用404错误监控
  SEO_404_SMART_REDIRECT: process.env.NEXT_PUBLIC_SEO_404_SMART_REDIRECT || true, // 启用智能重定向建议
  SEO_404_RELATED_CONTENT: process.env.NEXT_PUBLIC_SEO_404_RELATED_CONTENT || true, // 显示相关内容推荐
  SEO_404_SEARCH_INTEGRATION: process.env.NEXT_PUBLIC_SEO_404_SEARCH_INTEGRATION || true, // 集成搜索功能
  SEO_404_ANALYTICS_TRACKING: process.env.NEXT_PUBLIC_SEO_404_ANALYTICS_TRACKING || true, // 404页面分析跟踪

  // 搜索引擎提交配置
  SEO_AUTO_SUBMISSION: process.env.NEXT_PUBLIC_SEO_AUTO_SUBMISSION || true, // 启用自动提交
  SEO_SUBMISSION_INTERVAL: process.env.NEXT_PUBLIC_SEO_SUBMISSION_INTERVAL || 24, // 自动提交间隔（小时）
  SEO_GOOGLE_INDEXING_API_KEY: process.env.GOOGLE_INDEXING_API_KEY || '', // Google Indexing API密钥
  SEO_BING_WEBMASTER_API_KEY: process.env.BING_WEBMASTER_API_KEY || '', // Bing Webmaster API密钥
  SEO_BAIDU_PUSH_TOKEN: process.env.BAIDU_PUSH_TOKEN || '', // 百度推送Token
  SEO_ENABLE_GOOGLE_SUBMISSION: process.env.NEXT_PUBLIC_SEO_ENABLE_GOOGLE_SUBMISSION || true, // 启用Google提交
  SEO_ENABLE_BING_SUBMISSION: process.env.NEXT_PUBLIC_SEO_ENABLE_BING_SUBMISSION || true, // 启用Bing提交
  SEO_ENABLE_BAIDU_SUBMISSION: process.env.NEXT_PUBLIC_SEO_ENABLE_BAIDU_SUBMISSION || true, // 启用百度提交
  SEO_ENABLE_YANDEX_SUBMISSION: process.env.NEXT_PUBLIC_SEO_ENABLE_YANDEX_SUBMISSION || false, // 启用Yandex提交

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
