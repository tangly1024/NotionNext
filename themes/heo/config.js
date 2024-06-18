const CONFIG = {
  HEO_HOME_BANNER_ENABLE: true,

  HEO_SITE_CREATE_TIME: '2024-06-15', // 建站日期，用于计算网站运行的第几天

  // 首页顶部通知条滚动内容，如不需要可以留空 []
  HEO_NOTICE_BAR: [
    { title: '欢迎来到我的个人小宇宙！', url: 'https://www.agercare.com/' },
    { title: '这里记录着我的工作心得、学习感悟和生活点滴。希望我的分享能给您带来启发和乐趣。让我们一起在字里行间，感受生活的美好和成长的力量。🌱📝', url: 'https://www.agercare.com/' }
  ],

  // 英雄区左右侧组件颠倒位置
  HEO_HERO_REVERSE: false,
  // 博客主体区左右侧组件颠倒位置
  HEO_HERO_BODY_REVERSE: false,

  // 英雄区(首页顶部大卡)
  HEO_HERO_TITLE_1: '知识与年龄同行',
  HEO_HERO_TITLE_2: '健康与生活相伴',
  HEO_HERO_TITLE_3: 'AGERCARE.COM',
  HEO_HERO_TITLE_4: '',
  HEO_HERO_TITLE_5: '',
  HEO_HERO_TITLE_LINK: 'https://agercare.com',

  // 英雄区显示三个置顶分类
  HEO_HERO_CATEGORY_1: { title: '人生百味', url: '/tag/人生百味' },
  HEO_HERO_CATEGORY_2: { title: '职场沉浮', url: '/tag/职场沉浮' },
  HEO_HERO_CATEGORY_3: { title: '生活杂记', url: '/tag/生活杂记' },

  // 英雄区右侧推荐文章标签, 例如 [推荐] , 最多六篇文章; 若留空白''，则推荐最近更新文章
  HEO_HERO_RECOMMEND_POST_TAG: '推荐',
  HEO_HERO_RECOMMEND_POST_SORT_BY_UPDATE_TIME: false, // 推荐文章排序，为`true`时将强制按最后修改时间倒序
  //   HERO_RECOMMEND_COVER: 'https://cdn.pixabay.com/photo/2015/10/30/20/13/sunrise-1014712_1280.jpg', // 英雄区右侧图片

  // 右侧个人资料卡牌欢迎语，点击可自动切换
  HEO_INFOCARD_GREETINGS: [
    '你好！我是',
    '🔍 分享与热心帮助',
    '🤝 专修金融与科技',
    '🏃 脚踏实地行动派',
    '🏠 温馨家庭守护者',
    '🤖️ 数码科技爱好者',
    '🧱 团队小组发动机'
  ],
  HEO_INFO_CARD_URL: 'https://agercare.com/', // 个人资料底部按钮链接

  // 用户技能图标
  HEO_GROUP_ICONS: [
    {
      title_1: 'Axure',
      img_1: '/images/heo/100.png',
      color_1: '#989bf8',
      title_2: 'Visio',
      img_2: '/images/heo/113.png',
      color_2: '#ffffff'
    },
    {
      title_1: 'Excel',
      img_1: '/images/heo/208.png',
      color_1: '#57b6e6',
      title_2: 'Word',
      img_2: '/images/heo/309.png',
      color_2: '#4082c3'
    },
    {
      title_1: 'PPT',
      img_1: '/images/heo/348.png',
      color_1: '#ffffff',
      title_2: 'Mysql',
      img_2: '/images/heo/360.png',
      color_2: '#ffffff'
    },
    {
      title_1: 'Oracle',
      img_1: '/images/heo/378.png',
      color_1: '#eb6840',
      title_2: 'Sqlsever',
      img_2: '/images/heo/384.png',
      color_2: '#8f55ba'
    },
    {
      title_1: 'Python',
      img_1: '/images/heo/1030.png',
      color_1: '#f29e39',
      title_2: 'Java',
      img_2: '/images/heo/1043.png',
      color_2: '#2c51db'
    },
    {
      title_1: 'HTML',
      img_1: '/images/heo/1044.png',
      color_1: '#f7cb4f',
      title_2: 'CSS',
      img_2: '/images/heo/1052.png',
      color_2: '#e9572b'
    },
    {
      title_1: 'VUE',
      img_1: '/images/heo/1056.png',
      color_1: '#df5b40',
      title_2: 'NEXT',
      img_2: '/images/heo/1119.png',
      color_2: '#1f1f1f'
    }
  ],

  HEO_SOCIAL_CARD: true, // 是否显示右侧，点击加入社群按钮
  HEO_SOCIAL_CARD_TITLE_1: '交流频道',
  HEO_SOCIAL_CARD_TITLE_2: '加入我们的社群讨论分享',
  HEO_SOCIAL_CARD_TITLE_3: '点击加入社群',
  HEO_SOCIAL_CARD_URL: 'https://agercare.com',

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
  HEO_POST_LIST_PREVIEW: true, // 读取文章预览
  HEO_POST_LIST_IMG_CROSSOVER: false, // 博客列表图片左右交错

  HEO_ARTICLE_ADJACENT: false, // 显示上一篇下一篇文章推荐
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
