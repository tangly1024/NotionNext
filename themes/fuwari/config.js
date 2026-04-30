/**
 * Fuwari 主题专用配置
 *
 * 与 NotionNext 的 `blog.config.js` 合并后生效；可在博客配置里覆盖任意项。
 * 布尔项：true 显示/启用，false 隐藏/关闭。
 */

const CONFIG = {
  // ---------------------------------------------------------------------------
  // 导航（桌面顶栏 + 受 FUWARI_MOBILE_MENU 影响的移动菜单项）
  // ---------------------------------------------------------------------------
  /** 显示「首页」 */
  FUWARI_MENU_INDEX: true,
  /** 显示「归档」 */
  FUWARI_MENU_ARCHIVE: true,
  /** 显示「分类」 */
  FUWARI_MENU_CATEGORY: true,
  /** 显示「标签」 */
  FUWARI_MENU_TAG: true,
  /** 显示「搜索」（Algolia 或站内搜索由全局配置决定） */
  FUWARI_MENU_SEARCH: true,

  // ---------------------------------------------------------------------------
  // 首页文章列表卡片
  // ---------------------------------------------------------------------------
  /** 是否显示右侧封面图区域 */
  FUWARI_POST_LIST_COVER: true,
  /** 无文章封面时，是否用站点横幅图（HOME_BANNER_IMAGE）作默认图 */
  FUWARI_POST_LIST_COVER_DEFAULT: true,
  /** 封面悬停轻微放大 */
  FUWARI_POST_LIST_COVER_HOVER_ENLARGE: true,
  /** 显示摘要（有 summary 时） */
  FUWARI_POST_LIST_SUMMARY: true,
  /** 卡片内显示标签 */
  FUWARI_POST_LIST_TAG: true,

  // ---------------------------------------------------------------------------
  // 移动端
  // ---------------------------------------------------------------------------
  /** 右侧汉堡菜单（含导航项）；关闭后小屏仅保留顶栏图标 */
  FUWARI_MOBILE_MENU: true,

  // ---------------------------------------------------------------------------
  // 首页 Hero 大图区（封面来自站点信息或下方图片配置）
  // ---------------------------------------------------------------------------
  /** 是否渲染 Hero 区块（无图时仍占位，可按需关） */
  FUWARI_HERO_ENABLE: true,
  /** 自定义背景图 URL；留空则用 Notion 站点封面或 HOME_BANNER_IMAGE */
  FUWARI_HERO_BG_IMAGE: '',
  /** 右下角署名文案；留空不显示 */
  FUWARI_HERO_CREDIT_TEXT: '',
  /** 署名链接 */
  FUWARI_HERO_CREDIT_LINK: '',

  // ---------------------------------------------------------------------------
  // 侧栏（SidePanel）小部件
  // ---------------------------------------------------------------------------
  /** 公告（有公告数据时） */
  FUWARI_WIDGET_NOTICE: true,
  /** 最新文章列表 */
  FUWARI_WIDGET_LATEST_POSTS: true,
  /** 分类云/列表 */
  FUWARI_WIDGET_CATEGORY_LIST: true,
  /** 标签云/列表 */
  FUWARI_WIDGET_TAG_LIST: true,
  /** 侧栏头像/昵称下的「个人页」链接路径 */
  FUWARI_PROFILE_PATH: '/about',
  /** 联系/社群入口卡片 */
  FUWARI_WIDGET_CONTACT: true,
  /** 侧栏广告位总开关 */
  FUWARI_WIDGET_AD: false,
  /** 侧栏广告位内：是否渲染 WWAds */
  FUWARI_WIDGET_WWADS: true,
  /** 侧栏广告位内：是否渲染 AdSense 槽位 */
  FUWARI_WIDGET_ADSENSE: false,
  /** 插件注入区域卡片 */
  FUWARI_WIDGET_PLUGIN_AREA: true,
  /** 访问量等统计卡片 */
  FUWARI_WIDGET_ANALYTICS: true,
  /** 顶栏调色板内的色相滑块等；false 时展开调色板无控件 */
  FUWARI_WIDGET_THEME_COLOR_SWITCHER: true,
  /** 默认品牌色相 0–360 */
  FUWARI_THEME_COLOR_HUE: 52,
  /** true：隐藏顶栏调色盘按钮，无法在站内改色相 */
  FUWARI_THEME_COLOR_FIXED: false,
  /** 文章页右侧浮动区：跳转评论区按钮 */
  FUWARI_WIDGET_TO_COMMENT: true,
  /** 文章页右侧浮动区：深色模式切换 */
  FUWARI_WIDGET_DARK_MODE: true,
  /** 文章页目录：桌面在侧栏；小屏为浮动按钮抽屉（RightFloatArea） */
  FUWARI_ARTICLE_TOC: true,

  // ---------------------------------------------------------------------------
  // 联系卡片（侧栏，可翻转）
  // ---------------------------------------------------------------------------
  /** 正面标题 */
  FUWARI_CONTACT_TITLE: '社区',
  /** 正面说明文案 */
  FUWARI_CONTACT_DESCRIPTION: '欢迎交流与反馈',
  /** 正面右上角徽标 */
  FUWARI_CONTACT_FRONT_BADGE: 'Community',
  /** 跳转 URL（外链或站内路径） */
  FUWARI_CONTACT_URL: 'https://docs.tangly1024.com/article/chat-community',
  /** 正面行动文案（如「联系我们 →」） */
  FUWARI_CONTACT_TEXT: '查看',
  /** 是否使用正反面翻转卡片 */
  FUWARI_CONTACT_FLIP_CARD: true,
  /** 背面标题 */
  FUWARI_CONTACT_BACK_TITLE: '支持内容',
  /** 背面说明 */
  FUWARI_CONTACT_BACK_DESCRIPTION: '可提交问题、建议与合作意向。',
  /** 背面行动文案 */
  FUWARI_CONTACT_BACK_TEXT: '查看',

  // ---------------------------------------------------------------------------
  // 全站动效（按需开启，可能影响性能）
  // ---------------------------------------------------------------------------
  /** Lenis 平滑滚动 */
  FUWARI_EFFECT_LENIS: false,
  /** 自定义光标圆点 */
  FUWARI_EFFECT_CURSOR_DOT: false,

  // ---------------------------------------------------------------------------
  // 文章页
  // ---------------------------------------------------------------------------
  /** 文首：日期、分类、标签等元信息 */
  FUWARI_ARTICLE_META: true,
  /** 分享条 */
  FUWARI_ARTICLE_SHARE: true,
  /** 文末版权信息块 */
  FUWARI_ARTICLE_COPYRIGHT: true,
  /** 文末评论区（需在 `blog.config.js` 配置任一种评论服务，如 COMMENT_GISCUS_REPO / COMMENT_TWIKOO_ENV_ID 等，否则不渲染） */
  FUWARI_ARTICLE_COMMENT: true,
  /** 文末上一篇 / 下一篇 */
  FUWARI_ARTICLE_ADJACENT: true
}

export default CONFIG
