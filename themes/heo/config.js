const CONFIG = {
  HEO_HOME_POST_TWO_COLS: true, // 首页博客两列显示，若为false则只显示一列
  HEO_LOADING_COVER: true, // 页面加载的遮罩动画

  HEO_HOME_BANNER_ENABLE: true,

  HEO_SITE_CREATE_TIME: '2024-07-02', // 建站日期，用于计算网站运行的第几天

  // 首页顶部通知条滚动内容，如不需要可以留空 []
  HEO_NOTICE_BAR: [
    { title: '欢迎来到奇怪的博客', url: 'https://blog.stavmb.me' },
    { title: '可以点点查看站主的信息喵～', url: 'https://blog.stavmb.me/about' },
    { title: '可以随便逛逛呀～', url: 'https://blog.stavmb.me/links' }
  ],

  // 英雄区左右侧组件颠倒位置
  HEO_HERO_REVERSE: false,
  // 博客主体区左右侧组件颠倒位置
  HEO_HERO_BODY_REVERSE: false,

  // 英雄区(首页顶部大卡)
  HEO_HERO_TITLE_1: '分享可爱的事情',
  HEO_HERO_TITLE_2: 'To look up future',
  HEO_HERO_TITLE_3: 'Stavmb',
  HEO_HERO_TITLE_4: '点击进入',
  HEO_HERO_TITLE_5: '神奇的小房间',
  HEO_HERO_TITLE_LINK: 'https://blog.stavmb.me/',
  // 英雄区遮罩文字
  HEO_HERO_COVER_TITLE: '随便逛逛',

  // 英雄区显示三个置顶分类
  HEO_HERO_CATEGORY_1: { title: '猫猫推荐', url: '/tag/suggest' },
  HEO_HERO_CATEGORY_2: { title: '实用教程', url: '/tag/trending' },
  HEO_HERO_CATEGORY_3: { title: '生活记录', url: '/tag/diary' },

  // 英雄区右侧推荐文章标签, 例如 [推荐] , 最多六篇文章; 若留空白''，则推荐最近更新文章
  HEO_HERO_RECOMMEND_POST_TAG: '',
  HEO_HERO_RECOMMEND_POST_SORT_BY_UPDATE_TIME: true, // 推荐文章排序，为`true`时将强制按最后修改时间倒序
  HERO_RECOMMEND_COVER: 'https://www.dmoe.cc/random.php', // 英雄区右侧图片

  // 右侧个人资料卡牌欢迎语，点击可自动切换
  HEO_INFOCARD_GREETINGS: [
    '你好！我是',
    '喵喵喵？～',
    '啊哈哈。。。',
    '还在点？（疑惑）',
    '不要再点了！生气了～',
    '呜呜呜～',
    
  ],

  // 个人资料底部按钮
  HEO_INFO_CARD_URL1: '/about',
  HEO_INFO_CARD_ICON1: 'fas fa-user',
  HEO_INFO_CARD_URL2: 'https://github.com/systaven',
  HEO_INFO_CARD_ICON2: 'fab fa-github',
  HEO_INFO_CARD_URL3: 'https://blog.stavmb.me/about',
  HEO_INFO_CARD_TEXT3: '了解更多',

  // 用户技能图标
  HEO_GROUP_ICONS: [
    {
      title_1: 'face-smile-solid-full',
      img_1: '/images/heo/icon/face-smile-solid-full.svg',
      color_1: '#FFD9EF',
      title_2: 'bilibili-brands-solid-full',
      img_2: '/images/heo/icon/bilibili-brands-solid-full.svg',
      color_2: '#FFF0F8'
    },
    {
      title_1: 'envelope-solid-full',
      img_1: '/images/heo/icon/envelope-solid-full.svg',
      color_1: '#FFB8E3',
      title_2: 'shield-cat-solid-full',
      img_2: '/images/heo/icon/shield-cat-solid-full.svg',
      color_2: '#F76FC2'
    },
    {
      title_1: 'trophy-solid-full',
      img_1: '/images/heo/icon/trophy-solid-full.svg',
      color_1: '#FFF0F8',
      title_2: 'gamepad-solid-full',
      img_2: '/images/heo/icon/gamepad-solid-full.svg',
      color_2: '#FFF0F8'
    },
    {
      title_1: 'heart-solid-full',
      img_1: '/images/heo/icon/heart-solid-full.svg',
      color_1: '#FFB8E3',
      title_2: 'heart-regular-full',
      img_2: '/images/heo/icon/heart-regular-full.svg',
      color_2: '#2E031B'
    }
  ],

  HEO_SOCIAL_CARD: false, // 是否显示右侧，点击加入社群按钮
  HEO_SOCIAL_CARD_TITLE_1: '交流频道',
  HEO_SOCIAL_CARD_TITLE_2: '加入我们的社群讨论分享',
  HEO_SOCIAL_CARD_TITLE_3: '点击加入社群',
  HEO_SOCIAL_CARD_URL: 'https://blog.stavmb.me/article/how-to-question',

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
  HEO_POST_LIST_PREVIEW: true, // 读取文章预览
  HEO_POST_LIST_IMG_CROSSOVER: true, // 博客列表图片左右交错

  HEO_ARTICLE_ADJACENT: true, // 显示上一篇下一篇文章推荐
  HEO_ARTICLE_COPYRIGHT: true, // 显示文章版权声明
  HEO_ARTICLE_NOT_BY_AI: false, // 显示非AI写作
  HEO_ARTICLE_RECOMMEND: true, // 文章关联推荐

  HEO_WIDGET_LATEST_POSTS: true, // 显示最新文章卡
  HEO_WIDGET_ANALYTICS: true, // 显示统计卡
  HEO_WIDGET_TO_TOP: true,
  HEO_WIDGET_TO_COMMENT: true, // 跳到评论区
  HEO_WIDGET_DARK_MODE: true, // 夜间模式
  HEO_WIDGET_TOC: true // 移动端悬浮目录
}
export default CONFIG
