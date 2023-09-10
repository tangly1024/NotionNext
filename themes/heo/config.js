const CONFIG = {
  HEO_HOME_BANNER_ENABLE: true,

  SITE_CREATE_TIME: '2023-09-10', // 建站日期，用于计算网站运行的第几天

  // 首页顶部通知条滚动内容，如不需要可以留空 []
  NOTICE_BAR: [{ title: '欢迎来到我的博客', url: 'https://notion.zhuba.xyz' }],

  // 英雄区(首页顶部大卡)
  HERO_TITLE_1: '分享编程',
  HERO_TITLE_2: '与思维认知',
  HERO_TITLE_3: 'ZHUBA.XYZ',
  HERO_TITLE_LINK: 'https://notion.zhuba.xyz',

  // 英雄区显示三个置顶分类
  HEO_HERO_CATEGORY_1: { title: '必看精选', url: '/tag/必看精选' },
  HEO_HERO_CATEGORY_2: { title: '热门文章', url: '/tag/热门文章' },
  HEO_HERO_CATEGORY_3: { title: '实用教程', url: '/tag/实用教程' },

  // 英雄区右侧推荐文章标签, 例如 [推荐] , 最多六篇文章; 若留空白''，则推荐最近更新文章
  HEO_HERO_RECOMMEND_POST_TAG: '推荐',
  HEO_HERO_RECOMMEND_POST_SORT_BY_UPDATE_TIME: false, // 推荐文章排序，为`true`时将强制按最后修改时间倒序
  //   HERO_RECOMMEND_COVER: 'https://cdn.pixabay.com/photo/2015/10/30/20/13/sunrise-1014712_1280.jpg', // 英雄区右侧图片

  // 右侧个人资料卡牌欢迎语，点击可自动切换
  HEO_INFOCARD_GREETINGS: [
    '你好！我是',
    '🔍 分享与热心帮助',
    '🤝 专修交互与设计',
    '🏃 脚踏实地行动派',
    '🏠 智能家居小能手',
    '🤖️ 数码科技爱好者',
    '🧱 团队小组发动机'
  ],
  INFO_CARD_URL: 'https://github.com/zhuba-Ahhh', // 个人资料底部按钮链接

  // 用户技能图标
  HEO_GROUP_ICONS: [
    {
      title_1: 'React',
      img_1: '/images/svg/React.svg',
      color_1: '#41b883',
      title_2: 'Vue',
      img_2: 'https://vuejs.org/images/logo.png',
      color_2: '#61dafb'
    },
    {
      title_1: 'Vite',
      img_1: 'https://cn.vitejs.dev/logo-with-shadow.png',
      color_1: '#000000',
      title_2: 'Next.js',
      img_2:
        'https://camo.githubusercontent.com/f21f1fa29dfe5e1d0772b0efe2f43eca2f6dc14f2fede8d9cbef4a3a8210c91d/68747470733a2f2f6173736574732e76657263656c2e636f6d2f696d6167652f75706c6f61642f76313636323133303535392f6e6578746a732f49636f6e5f6c696768745f6261636b67726f756e642e706e67',
      color_2: '#646cff'
    },
    {
      title_1: 'TypeScript',
      img_1:
        'https://www.typescriptlang.org/icons/icon-144x144.png?v=8944a05a8b601855de116c8a56d3b3ae',
      color_1: '#007acc',
      title_2: 'JavaScript',
      img_2: 'https://www.runoob.com/wp-content/uploads/2013/07/js-logo.png',
      color_2: '#f7df1e'
    },
    {
      title_1: 'LESS',
      img_1: 'https://less.bootcss.com/public/img/less_logo.png',
      color_1: '#1d365d',
      title_2: 'Sass',
      img_2: 'https://www.sass.hk/images/sass.png',
      color_2: '#c69'
    },
    {
      title_1: 'ESLint',
      img_1: 'https://zh-hans.eslint.org/icon-512.png',
      color_1: '#ffffff',
      title_2: 'Webpack',
      img_2: 'https://www.webpackjs.com/favicon.f326220248556af65f41.ico',
      color_2: '#f7b93d'
    },
    {
      title_1: 'Git',
      img_1: '/images/heo/2023ffa5707c4e25b6beb3e6a3d286ede4c6071102.webp',
      color_1: '#df5b40',
      title_2: 'HTML',
      img_2: '/images/heo/202372b4d760fd8a497d442140c295655426070302.webp',
      color_2: '#e9572b'
    }
  ],

  SOCIAL_CARD: false, // 是否显示右侧，点击加入社群按钮
  SOCIAL_CARD_TITLE_1: '交流频道',
  SOCIAL_CARD_TITLE_2: '加入我们的社群讨论分享',
  SOCIAL_CARD_TITLE_3: '点击加入社群',
  SOCIAL_CARD_URL: 'https://docs.tangly1024.com/article/how-to-question',

  // *****  以下配置无效，只是预留开发 ****
  // 菜单配置
  HEO_MENU_INDEX: true, // 显示首页
  HEO_MENU_CATEGORY: true, // 显示分类
  HEO_MENU_TAG: true, // 显示标签
  HEO_MENU_ARCHIVE: true, // 显示归档
  HEO_MENU_SEARCH: true, // 显示搜索

  HEO_POST_LIST_COVER: true, // 列表显示文章封面
  HEO_POST_LIST_COVER_HOVER_ENLARGE: false, // 列表鼠标悬停放大

  POST_LIST_COVER_DEFAULT: true, // 封面为空时用站点背景做默认封面
  POST_LIST_SUMMARY: true, // 文章摘要
  POST_LIST_PREVIEW: true, // 读取文章预览
  POST_LIST_IMG_CROSSOVER: true, // 博客列表图片左右交错

  HEO_ARTICLE_ADJACENT: true, // 显示上一篇下一篇文章推荐
  HEO_ARTICLE_COPYRIGHT: true, // 显示文章版权声明
  HEO_ARTICLE_RECOMMEND: true, // 文章关联推荐

  WIDGET_LATEST_POSTS: true, // 显示最新文章卡
  WIDGET_ANALYTICS: true, // 显示统计卡
  WIDGET_TO_TOP: true,
  WIDGET_TO_COMMENT: true, // 跳到评论区
  WIDGET_DARK_MODE: true, // 夜间模式
  WIDGET_TOC: true // 移动端悬浮目录
}
export default CONFIG
