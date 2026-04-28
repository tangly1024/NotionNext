const CONFIG = {
  HEO_HOME_POST_TWO_COLS: true, // 首页博客两列显示，若为false则只显示一列
  HEO_LOADING_COVER: true, // 页面加载的遮罩动画

  HEO_HOME_BANNER_ENABLE: true,

  HEO_SITE_CREATE_TIME: '2024-09-21', // 建站日期，用于计算网站运行的第几天

  // 首页顶部通知条滚动内容，如不需要可以留空 []
  HEO_NOTICE_BAR: {
    'zh-CN': [
      { title: '🎉 欢迎来到 CharliiAI 博客', url: 'https://www.charliiai.com' },
      { title: '📚 AIGC 与实用技能精选文章', url: '/tag/精选' },
      { title: '🚀 探索 AI 创作与科创落地', url: '/tag/AI落地' }
    ],
    'en-US': [
      { title: '🎉 Welcome to CharliiAI Blog', url: 'https://www.charliiai.com' },
      { title: '📚 Featured Articles on AIGC & Practical Skills', url: '/tag/Featured' },
      { title: '🚀 Explore AI Creation & Innovation', url: '/tag/AI-Innovation' }
    ]
  },


  // 英雄区左右侧组件颠倒位置
  HEO_HERO_REVERSE: false,
  // 博客主体区左右侧组件颠倒位置
  HEO_HERO_BODY_REVERSE: false,

  // 英雄区(首页顶部大卡)
  HEO_HERO_TITLE_1: {
    'zh-CN': '探索 AI',
    'en-US': 'Explore AI'
  },
  HEO_HERO_TITLE_2: {
    'zh-CN': '与 自动化 未来',
    'en-US': 'and Automation Future'
  },
  HEO_HERO_TITLE_3: 'CHARLIIAI.COM',
  HEO_HERO_TITLE_4: {
    'zh-CN': '数字智能助手',
    'en-US': 'Digital Intelligence Assistant'
  },
  HEO_HERO_TITLE_5: {
    'zh-CN': '打造属于你的 AI 领导力',
    'en-US': 'Build Your AI Leadership'
  },
  HEO_HERO_TITLE_LINK: 'https://www.charliiai.com',

  HEO_HOME_CTA_ENABLE: true,
  HEO_HOME_CTA_EYEBROW: {
    'zh-CN': 'EMAIL CTA',
    'en-US': 'EMAIL CTA'
  },
  HEO_HOME_CTA_TITLE: {
    'zh-CN': '获取新的 AI 实战内容与自动化案例',
    'en-US': 'Get new AI workflows and automation case studies'
  },
  HEO_HOME_CTA_DESCRIPTION: {
    'zh-CN': '留下邮箱，我会把新的教程、工具拆解和可落地的工作流更新发给你。这个入口更适合咨询、合作线索和订阅型读者。',
    'en-US': 'Leave your email to receive new tutorials, tool breakdowns, and practical automation workflows. This CTA is tuned for leads, collaborations, and newsletter readers.'
  },
  HEO_HOME_CTA_PLACEHOLDER: {
    'zh-CN': '输入你的邮箱地址',
    'en-US': 'Enter your email address'
  },
  HEO_HOME_CTA_BUTTON_TEXT: {
    'zh-CN': '订阅更新',
    'en-US': 'Subscribe'
  },
  HEO_HOME_CTA_SUCCESS: {
    'zh-CN': '订阅成功，后续更新会发到你的邮箱。',
    'en-US': 'Subscribed. Future updates will be sent to your inbox.'
  },
  HEO_HOME_CTA_ERROR: {
    'zh-CN': '订阅失败，请稍后重试或直接从联系页联系我。',
    'en-US': 'Subscription failed. Try again later or reach out from the contact page.'
  },
  HEO_HOME_CTA_NOTE: {
    'zh-CN': '不发垃圾邮件。你也可以直接从联系页发合作需求。',
    'en-US': 'No spam. You can also send a collaboration request from the contact page.'
  },
  HEO_HOME_CTA_SECONDARY_TEXT: {
    'zh-CN': '查看联系页',
    'en-US': 'Open contact page'
  },
  HEO_HOME_CTA_SECONDARY_URL: {
    'zh-CN': '/contact',
    'en-US': '/contact'
  },

  // 英雄区遮罩文字（核心SEO关键词）
  HEO_HERO_COVER_TITLE: {
    'zh-CN': 'AIGC · 效率 · 科创 · 落地 · AI创作',
    'en-US': 'AIGC · Efficiency · Innovation · Implementation · AI Creation'
  },

  // 英雄区置顶分类（关键词导向，更专业）
  HEO_HERO_CATEGORY_1: {
    'zh-CN': { title: 'AIGC应用实践', url: '/tag/AIGC应用' },
    'en-US': { title: 'AIGC Applications', url: '/tag/AIGC-Applications' }
  },
  HEO_HERO_CATEGORY_2: {
    'zh-CN': { title: '效率与生产力工具', url: '/tag/效率工具' },
    'en-US': { title: 'Productivity Tools', url: '/tag/Productivity-Tools' }
  },
  HEO_HERO_CATEGORY_3: {
    'zh-CN': { title: 'AI科创与落地', url: '/tag/AI落地' },
    'en-US': { title: 'AI Innovation & Implementation', url: '/tag/AI-Innovation' }
  },

  // 英雄区右侧推荐文章标签
  HEO_HERO_RECOMMEND_POST_TAG: 'Popular',
  HEO_HERO_RECOMMEND_POST_SORT_BY_UPDATE_TIME: true,

  // 右侧个人资料卡牌欢迎语（突出科创、落地、应用）
  // 支持多语言，根据当前 locale 显示不同内容
  HEO_INFOCARD_GREETINGS: {
    'zh-CN': [
      '你好！我是 Charlii博士',
      '🤖 专注 AIGC 与 AI创作应用',
      '🦾 提供 OpenClaw Agent 全流程服务',
      '📲 支持X/TikTok/小红书/抖音多平台运营',
      '🎬 视频·图文·博客内容自动化',
      '🚀 聚焦AI科创与落地实践',
      '🌍 探索出海与全球化经验',
      '💡 让AI成为生产力伙伴',
      '🔍 助力打造超级个体'
    ],
    'en-US': [
      'Hello! I\'m Dr. Charlii',
      '🤖 Focused on AIGC & AI Creative Applications',
      '🦾 Full OpenClaw Agent & Skill Services',
      '📲 X, TikTok, Reddit, RedBook & More',
      '🎬 Video, Blog & Social Content Automation',
      '🚀 Exploring AI Innovation & Implementation',
      '🌍 Global Expansion & Cross-border Experience',
      '💡 Making AI Your Productivity Partner',
      '🔍 Building Super Individuals'
    ]
  },




  // 个人资料底部按钮
  HEO_INFO_CARD_URL1: '/about',
  HEO_INFO_CARD_ICON1: 'fas fa-user',

  HEO_INFO_CARD_URL2: {
    'zh-CN': 'https://cdn.jsdelivr.net/gh/kenchikuliu/picx-images@main/social-cards/charlii.png',
    'en-US': 'https://cdn.jsdelivr.net/gh/kenchikuliu/picx-images@main/social-cards/charliiai—en.png'
  }, // 你的微信二维码图片地址
  HEO_INFO_CARD_ICON2: 'fab fa-weixin', // 微信图标

  HEO_INFO_CARD_URL3: 'https://www.charliiai.com',
  HEO_INFO_CARD_TEXT3: '了解更多',


  // 社交平台 & AI工具图标
  HEO_GROUP_ICONS: [
    {
      title_1: 'X (Twitter)',
      img_1: 'https://cdn.simpleicons.org/x/ffffff',
      color_1: '#000000',
      title_2: 'TikTok',
      img_2: 'https://cdn.simpleicons.org/tiktok/ffffff',
      color_2: '#010101'
    },
    {
      title_1: 'Reddit',
      img_1: 'https://cdn.simpleicons.org/reddit/ffffff',
      color_1: '#FF4500',
      title_2: 'Instagram',
      img_2: 'https://cdn.simpleicons.org/instagram/ffffff',
      color_2: '#C13584'
    },
    {
      title_1: 'YouTube',
      img_1: 'https://cdn.simpleicons.org/youtube/ffffff',
      color_1: '#FF0000',
      title_2: '小红书',
      img_2: 'https://cdn.simpleicons.org/xiaohongshu/ffffff',
      color_2: '#FF2442'
    },
    {
      title_1: '抖音',
      img_1: 'https://cdn.simpleicons.org/tiktok/ffffff',
      color_1: '#69C9D0',
      title_2: '视频号',
      img_2: 'https://cdn.simpleicons.org/wechat/ffffff',
      color_2: '#07C160'
    },
    {
      title_1: 'LinkedIn',
      img_1: 'https://cdn.simpleicons.org/linkedin/ffffff',
      color_1: '#0A66C2',
      title_2: 'Facebook',
      img_2: 'https://cdn.simpleicons.org/facebook/ffffff',
      color_2: '#1877F2'
    },
    {
      title_1: 'OpenAI',
      img_1: 'https://cdn.simpleicons.org/openai/ffffff',
      color_1: '#412991',
      title_2: 'Claude',
      img_2: 'https://cdn.simpleicons.org/anthropic/ffffff',
      color_2: '#D97757'
    },
    {
      title_1: 'Notion',
      img_1: 'https://cdn.simpleicons.org/notion/ffffff',
      color_1: '#000000',
      title_2: 'Pinterest',
      img_2: 'https://cdn.simpleicons.org/pinterest/ffffff',
      color_2: '#BD081C'
    }
  ],

  HEO_SOCIAL_CARD: true, // 显示右侧社群卡片
  HEO_SOCIAL_CARD_TITLE_1: {
    'zh-CN': '交流频道',
    'en-US': 'Community'
  },
  HEO_SOCIAL_CARD_TITLE_2: {
    'zh-CN': '添加微信，加入微信群讨论',
    'en-US': 'Add WeChat to join group discussions'
  },
  HEO_SOCIAL_CARD_TITLE_3: {
    'zh-CN': '点击扫码添加微信',
    'en-US': 'Scan QR code to add WeChat'
  },
  HEO_SOCIAL_CARD_URL: {
    'zh-CN': 'https://cdn.jsdelivr.net/gh/kenchikuliu/picx-images@main/social-cards/charlii.png',
    'en-US': 'https://cdn.jsdelivr.net/gh/kenchikuliu/picx-images@main/social-cards/charliiai—en.png'
  }, // 你的微信二维码图片




  // *****  以下配置无效，只是预留开发 ****
  // 菜单配置
  HEO_MENU_INDEX: true, // 显示首页
  HEO_MENU_CATEGORY: true, // 显示分类
  HEO_MENU_TAG: true, // 显示标签
  HEO_MENU_ARCHIVE: true, // 显示归档
  HEO_MENU_SEARCH: true, // 显示搜索

  HEO_POST_LIST_COVER: true, // 列表显示文章封面
  HEO_POST_LIST_COVER_HOVER_ENLARGE: false, // 列表鼠标悬停放大

  HEO_POST_LIST_COVER_DEFAULT: true, // 封面为空时用站点背景做默认封面
  HEO_POST_LIST_SUMMARY: true, // 文章摘要
  HEO_POST_LIST_PREVIEW: false, // 读取文章预览
  HEO_POST_LIST_IMG_CROSSOVER: true, // 博客列表图片左右交错

  HEO_ARTICLE_ADJACENT: true, // 显示上一篇下一篇文章推荐
  HEO_ARTICLE_COPYRIGHT: true, // 显示文章版权声明
  HEO_ARTICLE_NOT_BY_AI: false, // 显示非AI写作
  HEO_ARTICLE_RECOMMEND: true, // 文章关联推荐

  HEO_WIDGET_LATEST_POSTS: true, // 显示最新文章卡
  HEO_WIDGET_ANALYTICS: false, // 显示统计卡
  HEO_WIDGET_TO_TOP: true,
  HEO_WIDGET_TO_COMMENT: true, // 跳到评论区
  HEO_WIDGET_DARK_MODE: true, // 夜间模式
  HEO_WIDGET_TOC: true // 移动端悬浮目录
}
export default CONFIG
