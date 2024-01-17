const CONFIG = {
  HEO_HOME_BANNER_ENABLE: true,

  HEO_SITE_CREATE_TIME: '2022-12-21', // 建站日期，用于计算网站运行的第几天

  // 首页顶部通知条滚动内容，如不需要可以留空 []
  HEO_NOTICE_BAR: [
    { title: '欢迎来到虾滑主页', url: 'https://shredxhub.com'},
    { title: '去Voting板块，万一我们谈下来了呢', url: 'https://roadmap.shredxhub.com/'}
  ],

  // 英雄区(首页顶部大卡)
  HEO_HERO_TITLE_1: 'Yard Sale|掉裝備',
  HEO_HERO_TITLE_2: '冲粉|Milk Run|',
  HEO_HERO_TITLE_3: 'Shredxhub.com',
  HEO_HERO_TITLE_4: '正式运营！',
  HEO_HERO_TITLE_5: '虾滑Treasure Hunt完结撒花',
  HEO_HERO_TITLE_LINK: 'https://shredxhub.com',

  // 英雄区显示三个置顶分类
  HEO_HERO_CATEGORY_1: { title: '福利折扣', url: '/tag/福利折扣' },
  HEO_HERO_CATEGORY_2: { title: '虾滑集锦', url: '/tag/虾滑集锦' },
  HEO_HERO_CATEGORY_3: { title: '实用教程', url: '/tag/实用教程' },

  // 英雄区右侧推荐文章标签, 例如 [推荐] , 最多六篇文章; 若留空白''，则推荐最近更新文章
  HEO_HERO_RECOMMEND_POST_TAG: '推荐',
  HEO_HERO_RECOMMEND_POST_SORT_BY_UPDATE_TIME: false, // 推荐文章排序，为`true`时将强制按最后修改时间倒序
  //   HERO_RECOMMEND_COVER: 'https://cdn.pixabay.com/photo/2015/10/30/20/13/sunrise-1014712_1280.jpg', // 英雄区右侧图片

  // 右侧个人资料卡牌欢迎语，点击可自动切换
  HEO_INFOCARD_GREETINGS: [
    '你好，这里有',
    '🔍 分享与热心帮助',
    '🤝 chill和无所谓',
    '🏃 技术交流行动派',
    '🏠 空翻平花交流营',
    '🤖️ 户外活动爱好者',
    '🧱 团队小组发动机'
  ],
  HEO_INFO_CARD_URL: 'https://shredxhub.com', // 个人资料底部按钮链接

  // 用户技能图标
  HEO_GROUP_ICONS: [
    {
      title_1: 'Slopes',
      img_1: '/images/heo/slopes.png',
      color_1: '#E8F3F9',
      title_2: '滑呗',
      img_2: '/images/heo/huabei.png',
      color_2: '#ffffff'
    },
    {
      title_1: 'Fatmap',
      img_1: '/images/heo/fatmap.png',
      color_1: '#57b6e6',
      title_2: 'Snow-Forecast',
      img_2: '/images/heo/smow-forecast.png',
      color_2: '#4082c3'
    },
    {
      title_1: 'Fusend',
      img_1: '/images/heo/fusend.png',
      color_1: '#ffffff',
      title_2: 'Gopro',
      img_2: '/images/heo/gopro.png',
      color_2: '#ffffff'
    },
    {
      title_1: 'TwoRoamers',
      img_1: '/images/heo/tworoamers.png',
      color_1: '#eb6840',
      title_2: 'Insta360',
      img_2: '/images/heo/insta360.png',
      color_2: '#8f55ba'
    },
    {
      title_1: 'Shredhub',
      img_1: '/images/heo/xiahua.png',
      color_1: '#f29e39',
      title_2: 'Waze',
      img_2: '/images/heo/waze.png',
      color_2: '#2c51db'
    },
    {
      title_1: 'Ikon',
      img_1: '/images/heo/Ikon.png',
      color_1: '#f7cb4f',
      title_2: 'Epic',
      img_2: '/images/heo/epic.png',
      color_2: '#e9572b'
    },
    {
      title_1: 'CASI',
      img_1: '/images/heo/casi.png',
      color_1: '#df5b40',
      title_2: 'CSIA',
      img_2: '/images/heo/csia.png',
      color_2: '#1f1f1f'
    }
  ],

  HEO_SOCIAL_CARD: true, // 是否显示右侧，点击加入社群按钮
  HEO_SOCIAL_CARD_TITLE_1: '交流频道',
  HEO_SOCIAL_CARD_TITLE_2: '加入我们的社群讨论分享',
  HEO_SOCIAL_CARD_TITLE_3: '点击加入社群',
  HEO_SOCIAL_CARD_URL: 'https://linktr.ee/shredx_hub',

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
