const CONFIG = {
  HEO_HOME_POST_TWO_COLS: true, // 首页博客两列显示，若为false则只显示一列
  HEO_LOADING_COVER: true, // 页面加载的遮罩动画

  HEO_HOME_BANNER_ENABLE: true,

  HEO_SITE_CREATE_TIME: '2021-09-21', // 建站日期，用于计算网站运行的第几天

  // 首页顶部通知条滚动内容，如不需要可以留空 []
  HEO_NOTICE_BAR: [
    { title: 'AIGC，互联网营销，新兴科技分享！', url: 'https://wbolyn.com' },
    { title: '个人微信bolyn000，期待与你有更多的交流。', url: 'https://wbolyn.com' }
  ],

  // 英雄区左右侧组件颠倒位置
  HEO_HERO_REVERSE: false,
  // 博客主体区左右侧组件颠倒位置
  HEO_HERO_BODY_REVERSE: true,

  // 英雄区(首页顶部大卡)
  HEO_HERO_TITLE_1: '分享编程',
  HEO_HERO_TITLE_2: '与思维认知',
  HEO_HERO_TITLE_3: '王博霖bolyn',
  HEO_HERO_TITLE_4: '记录我，遇见你！',
  HEO_HERO_TITLE_5: '故事从这里开始。',
  HEO_HERO_TITLE_LINK: 'https://wbolyn.com/',
  // 英雄区遮罩文字
  HEO_HERO_COVER_TITLE: '随机漫步',

  // 英雄区显示三个置顶分类
  HEO_HERO_CATEGORY_1: { title: '必看精选', url: '/tag/必看精选' },
  HEO_HERO_CATEGORY_2: { title: '热门文章', url: '/tag/热门文章' },
  HEO_HERO_CATEGORY_3: { title: '实用教程', url: '/tag/实用教程' },

  // 英雄区右侧推荐文章标签, 例如 [推荐] , 最多六篇文章; 若留空白''，则推荐最近更新文章
  HEO_HERO_RECOMMEND_POST_TAG: '推荐',
  HEO_HERO_RECOMMEND_POST_SORT_BY_UPDATE_TIME: false, // 推荐文章排序，为`true`时将强制按最后修改时间倒序
  //   HERO_RECOMMEND_COVER: 'https://cdn.pixabay.com/photo/2015/10/30/20/13/sunrise-1014712_1280.jpg', // 英雄区右侧图片
  
  // 英雄区右侧推荐文章遮罩控制
  HEO_HERO_RECOMMEND_COVER_ENABLE: false, // 是否显示推荐文章遮罩图片，true显示遮罩需点击查看，false直接显示推荐文章

// 右侧个人资料卡牌欢迎语，点击可自动切换
  HEO_INFOCARD_GREETINGS: [
    '你好！我是',
    '分享与热心帮助',
    '专修互联网与编程',
    'AIGC知识传道者',
    '业余马拉松爱好者',
    '物理学在读博士',
    '独立开发者'
  ],

  // 个人资料底部按钮
  HEO_INFO_CARD_URL1: '/about',
  HEO_INFO_CARD_ICON1: 'fas fa-user',
  HEO_INFO_CARD_URL2: 'https:/github.com/BolynWang',
  HEO_INFO_CARD_ICON2: 'fab fa-github',
  HEO_INFO_CARD_URL3: 'https://wbolyn.com',
  HEO_INFO_CARD_TEXT3: '了解更多',

  // 用户技能图标
  HEO_GROUP_ICONS: [
    {
      title_1: 'ChatGPT',
      img_1: '/images/heo/202401a8f9e6b4d5c7a8e3f2b1c9d0e8f7g5h4.webp',
      color_1: '#f8f9fa',
      title_2: 'Claude',
      img_2: '/images/heo/202402b9f0e7c5d6a8f4e2b3c0d1e9f8g6h5.webp',
      color_2: '#ffffff'
    },
    {
      title_1: 'Grok',
      img_1: '/images/heo/202403c0f1e8d6a7f5e3b4c2d0e1f9g7h6.webp',
      color_1: '#f1f3f4',
      title_2: '即梦AI',
      img_2: '/images/heo/202404d1f2e9a8f6e4b5c3d1e0f8g8h7.webp',
      color_2: '#f8f9ff'
    },
    {
      title_1: 'Midjourney',
      img_1: '/images/heo/202405e2f3a9f7e5b6c4d2e1f0g9h8.webp',
      color_1: '#f5f5f5',
      title_2: 'Notion',
      img_2: '/images/heo/202406f4a0f8e6b7c5d3e2f1g0h9.webp',
      color_2: '#fafafa'
    },
    {
      title_1: 'Python',
      img_1: '/images/heo/20235c0731cd4c0c95fc136a8db961fdf963071502.webp',
      color_1: '#f6f8f6',
      title_2: 'SwiftUI',
      img_2: '/images/heo/202407f5a1e9b8c6d4e3f2g1h0.webp',
      color_2: '#f0f4ff'
    },
    {
      title_1: 'C#',
      img_1: '/images/heo/202408f6a2b9c7d5e4f3g2h1.webp',
      color_1: '#f0f8f0',
      title_2: 'C++',
      img_2: '/images/heo/202409f7a3c0d6e5f4g3h2.webp',
      color_2: '#f8f9fa'
    },
    {
      title_1: 'JavaScript',
      img_1: '/images/heo/202410f8a4c1d7e6f5g4h3.webp',
      color_1: '#fdfdfd',
      title_2: 'HTML5',
      img_2: '/images/heo/202411f9a5c2d8e7f6g5h4.webp',
      color_2: '#f1f3f4'
    },
    {
      title_1: 'CSS3',
      img_1: '/images/heo/202412f0a6c3d9e8f7g6h5.webp',
      color_1: '#f8f9ff',
      title_2: 'VSCode',
      img_2: '/images/heo/202413f1a7c4e0f8g7h6.webp',
      color_2: '#f5f5f5'
    },
    {
      title_1: 'Git',
      img_1: '/images/heo/202414f2a8c5e1f9g8h7.webp',
      color_1: '#e8eaed',
      title_2: 'GitHub',
      img_2: '/images/heo/202415f3a9c6e2g0h8.webp',
      color_2: '#ffffff'
    },
    {
      title_1: 'macOS',
      img_1: '/images/heo/202416f4a0c7e3g1h9.webp',
      color_1: '#f1f3f4',
      title_2: 'Windows',
      img_2: '/images/heo/202417f5a1c8e4g2h0.webp',
      color_2: '#f6f8f6'
    },
    {
      title_1: 'Obsidian',
      img_1: '/images/heo/202418f6a2c9e5g3h1.webp',
      color_1: '#f8f9fa',
      title_2: 'Zotero',
      img_2: '/images/heo/202419f7a3e6g4h2.webp',
      color_2: '#f0f4ff'
    },
    {
      title_1: 'Flomo',
      img_1: '/images/heo/202420f8a4e7g5h3.webp',
      color_1: '#fdfdfd',
      title_2: 'COROS',
      img_2: '/images/heo/202421f9a5e8g6h4.webp',
      color_2: '#f1f3f4'
    }
  ],

  HEO_SOCIAL_CARD: false, // 是否显示右侧，点击加入社群按钮
  HEO_SOCIAL_CARD_TITLE_1: '交流频道',
  HEO_SOCIAL_CARD_TITLE_2: '加入我们的社群讨论分享',
  HEO_SOCIAL_CARD_TITLE_3: '点击加入社群',
  HEO_SOCIAL_CARD_URL: 'https://wbolyn.com/',

  // 底部统计面板文案
  HEO_POST_COUNT_TITLE: '文章数:',
  HEO_SITE_TIME_TITLE: '建站天数:',
  HEO_SITE_VISIT_TITLE: '访问量:',
  HEO_SITE_VISITOR_TITLE: '访客数:',

  // *****  以下配置无效，只是预留开发 ****
  // 菜单配置
  HEO_MENU_INDEX: true, // 显示首页
  HEO_MENU_CATEGORY: true, // 显示分类
  HEO_MENU_TAG: true, // 显示标签
  HEO_MENU_ARCHIVE: true, // 显示归档
  HEO_MENU_SEARCH: true, // 显示搜索

  HEO_POST_LIST_COVER: true, // 列表显示文章封面
  HEO_POST_LIST_COVER_HOVER_ENLARGE: true, // 列表鼠标悬停放大

  HEO_POST_LIST_COVER_DEFAULT: true, // 封面为空时用站点背景做默认封面
  HEO_POST_LIST_SUMMARY: true, // 文章摘要
  HEO_POST_LIST_PREVIEW: false, // 读取文章预览
  HEO_POST_LIST_IMG_CROSSOVER: true, // 博客列表图片左右交错

  HEO_ARTICLE_ADJACENT:  false, // 显示上一篇下一篇文章推荐
  HEO_ARTICLE_COPYRIGHT: true, // 显示文章版权声明
  HEO_ARTICLE_NOT_BY_AI: true, // 显示非AI写作
  HEO_ARTICLE_RECOMMEND: true, // 文章关联推荐测试

  HEO_WIDGET_LATEST_POSTS: true, // 显示最新文章卡
  HEO_WIDGET_ANALYTICS: false, // 显示统计卡
  HEO_WIDGET_TO_TOP: true,
  HEO_WIDGET_TO_COMMENT: true, // 跳到评论区
  HEO_WIDGET_DARK_MODE: true, // 夜间模式
  HEO_WIDGET_TOC: true // 移动端悬浮目录
}
export default CONFIG
