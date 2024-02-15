const CONFIG = {
  HEO_HOME_BANNER_ENABLE: true,

  HEO_SITE_CREATE_TIME: '2021-09-21', // 建站日期，用于计算网站运行的第几天

  // 首页顶部通知条滚动内容，如不需要可以留空 []
  HEO_NOTICE_BAR: [
    { title: '欢迎来到0y.games', url: 'https://0y.games' },
  ],

  // 英雄区左右侧组件颠倒位置
  HEO_HERO_REVERSE: false,
  // 博客主体区左右侧组件颠倒位置
  HEO_HERO_BODY_REVERSE: false,

  // 英雄区(首页顶部大卡)
  HEO_HERO_TITLE_1: '游戏资源分享',
  HEO_HERO_TITLE_2: '',
  HEO_HERO_TITLE_3: '0y.games',
  HEO_HERO_TITLE_4: '全新上线',
  HEO_HERO_TITLE_5: '博德之门3-全DLC',
  HEO_HERO_TITLE_LINK: 'https://www.0y.games/article/8481d293-be0b-4694-be1f-f0ff501ac857',

  // 英雄区显示三个置顶分类
  HEO_HERO_CATEGORY_1: { title: '热门游戏', url: '/tag/热门' },
  HEO_HERO_CATEGORY_2: { title: 'PC游戏', url: '/tag/PC' },
  HEO_HERO_CATEGORY_3: { title: '主机游戏', url: '/tag/主机游戏' },

  // 英雄区右侧推荐文章标签, 例如 [推荐] , 最多六篇文章; 若留空白''，则推荐最近更新文章
  HEO_HERO_RECOMMEND_POST_TAG: '推荐',
  HEO_HERO_RECOMMEND_POST_SORT_BY_UPDATE_TIME: false, // 推荐文章排序，为`true`时将强制按最后修改时间倒序
  //   HERO_RECOMMEND_COVER: 'https://cdn.pixabay.com/photo/2015/10/30/20/13/sunrise-1014712_1280.jpg', // 英雄区右侧图片

  // 右侧个人资料卡牌欢迎语，点击可自动切换
  HEO_INFOCARD_GREETINGS: [
    '你好！我们是火绳工业',
    '🔍 分享与热心帮助',
    '🤝 专注游戏资源',
    '🏃 脚踏实地行动派',
    '🧱 团队小组发动机'
  ],
  HEO_INFO_CARD_URL: 'https://github.com/tangly1024/NotionNext', // 个人资料底部按钮链接

  // 用户技能图标
  HEO_GROUP_ICONS: [
    {
      title_1: '大表哥',
      img_1: 'data:image/jpeg;base64,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',
      color_1: '#989bf8',
      title_2: 'Sketch',
      img_2: 'data:image/jpeg;base64,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',
      color_2: '#ffffff'
    },
    {
      title_1: 'Docker',
      img_1: '/images/heo/20231108a540b2862d26f8850172e4ea58ed075102.webp',
      color_1: '#57b6e6',
      title_2: 'Photoshop',
      img_2: '/images/heo/2023e4058a91608ea41751c4f102b131f267075902.webp',
      color_2: '#4082c3'
    },
    {
      title_1: 'FinalCutPro',
      img_1: '/images/heo/20233e777652412247dd57fd9b48cf997c01070702.webp',
      color_1: '#ffffff',
      title_2: 'Python',
      img_2: '/images/heo/20235c0731cd4c0c95fc136a8db961fdf963071502.webp',
      color_2: '#ffffff'
    },
    {
      title_1: 'Swift',
      img_1: '/images/heo/202328bbee0b314297917b327df4a704db5c072402.webp',
      color_1: '#eb6840',
      title_2: 'Principle',
      img_2: '/images/heo/2023f76570d2770c8e84801f7e107cd911b5073202.webp',
      color_2: '#8f55ba'
    },
    {
      title_1: 'illustrator',
      img_1: '/images/heo/20237359d71b45ab77829cee5972e36f8c30073902.webp',
      color_1: '#f29e39',
      title_2: 'CSS3',
      img_2: '/images/heo/20237c548846044a20dad68a13c0f0e1502f074602.webp',
      color_2: '#2c51db'
    },
    {
      title_1: 'JS',
      img_1: '/images/heo/2023786e7fc488f453d5fb2be760c96185c0075502.webp',
      color_1: '#f7cb4f',
      title_2: 'HTML',
      img_2: '/images/heo/202372b4d760fd8a497d442140c295655426070302.webp',
      color_2: '#e9572b'
    },
    {
      title_1: 'Git',
      img_1: '/images/heo/2023ffa5707c4e25b6beb3e6a3d286ede4c6071102.webp',
      color_1: '#df5b40',
      title_2: 'Rhino',
      img_2: '/images/heo/20231ca53fa0b09a3ff1df89acd7515e9516173302.webp',
      color_2: '#1f1f1f'
    }
  ],

  HEO_SOCIAL_CARD: true, // 是否显示右侧，点击加入社群按钮
  HEO_SOCIAL_CARD_TITLE_1: '交流频道',
  HEO_SOCIAL_CARD_TITLE_2: '加入我们的社群讨论分享',
  HEO_SOCIAL_CARD_TITLE_3: '点击加入社群',
  HEO_SOCIAL_CARD_URL: 'https://docs.tangly1024.com/article/how-to-question',

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
  HEO_ARTICLE_RECOMMEND: true, // 文章关联推荐

  HEO_WIDGET_LATEST_POSTS: true, // 显示最新文章卡
  HEO_WIDGET_ANALYTICS: false, // 显示统计卡
  HEO_WIDGET_TO_TOP: true,
  HEO_WIDGET_TO_COMMENT: true, // 跳到评论区
  HEO_WIDGET_DARK_MODE: true, // 夜间模式
  HEO_WIDGET_TOC: true // 移动端悬浮目录
}
export default CONFIG
