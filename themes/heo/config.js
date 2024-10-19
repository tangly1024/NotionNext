const CONFIG = {
  HEO_HOME_POST_TWO_COLS: true, // 首页博客两列显示，若为false则只显示一列
  HEO_LOADING_COVER: true, // 页面加载的遮罩动画

  HEO_HOME_BANNER_ENABLE: true,

  HEO_SITE_CREATE_TIME: '2006-11-10', // 建站日期，用于计算网站运行的第几天

  // 首页顶部通知条滚动内容，如不需要可以留空 []
  HEO_NOTICE_BAR: [
    { title: '林中小屋', url: 'https://www.lzy599.space' },
    { title: '赌书泼茶', url: 'https://www.lzy599.space' }
  ],

  // 英雄区左右侧组件颠倒位置
  HEO_HERO_REVERSE: false,
  // 博客主体区左右侧组件颠倒位置
  HEO_HERO_BODY_REVERSE: false,

  // 英雄区(首页顶部大卡)
  HEO_HERO_TITLE_1: '祝LZY',
  HEO_HERO_TITLE_2: '18岁生日快乐',
  HEO_HERO_TITLE_3: 'Happy everyday~',
  HEO_HERO_TITLE_4: '未来可期',
  HEO_HERO_TITLE_5: '虚世生白 吉祥止止',
  HEO_HERO_TITLE_LINK: 'https://www.lzy599.space',
  // 英雄区遮罩文字
  HEO_HERO_COVER_TITLE: '闲庭信步',

  // 英雄区显示三个置顶分类
  HEO_HERO_CATEGORY_1: { title: '小说', url: '/tag/小说' },
  HEO_HERO_CATEGORY_2: { title: '视频', url: '/tag/视频' },
  HEO_HERO_CATEGORY_3: { title: '音乐', url: '/tag/音乐' },

  // 英雄区右侧推荐文章标签, 例如 [推荐] , 最多六篇文章; 若留空白''，则推荐最近更新文章
  HEO_HERO_RECOMMEND_POST_TAG: '推荐',
  HEO_HERO_RECOMMEND_POST_SORT_BY_UPDATE_TIME: false, // 推荐文章排序，为`true`时将强制按最后修改时间倒序
  HERO_RECOMMEND_COVER: '/images/heo/birthday2.png', // 英雄区右侧图片

  // 右侧个人资料卡牌欢迎语，点击可自动切换
  HEO_INFOCARD_GREETINGS: [
    '云中谁寄锦书来？雁字回时，月满西楼。',
    '🔍 分享与热心帮助',
    '🤝 专修交互与设计',
    '🏃 脚踏实地行动派',
    '🏠 智能家居小能手',
    '🤖️ 数码科技爱好者',
    '🧱 团队小组发动机'
  ],

  // 个人资料底部按钮
  HEO_INFO_CARD_URL1: '/about',
  HEO_INFO_CARD_ICON1: 'fas fa-user',
  HEO_INFO_CARD_URL2: 'https://www.lzy599.space',
  HEO_INFO_CARD_ICON2: 'fab fa-github',
  HEO_INFO_CARD_URL3: 'https://www.lzy599.space',
  HEO_INFO_CARD_TEXT3: '了解更多',

  // 用户技能图标
  HEO_GROUP_ICONS: [
    {
      title_1: 'Music',
      img_1: '/images/heo/music.png',
      color_1: '#989bf8',
      title_2: 'Piano',
      img_2: '/images/heo/piano.png',
      color_2: '#ffffff'
    },
    {
      title_1: 'Read',
      img_1: '/images/heo/book.png',
      color_1: '#57b6e6',
      title_2: 'Volleyball',
      img_2: '/images/heo/volleyball.png',
      color_2: '#4082c3'
    },
    {
      title_1: 'Meat',
      img_1: '/images/heo/meat.png',
      color_1: '#ffffff',
      title_2: 'Food',
      img_2: '/images/heo/fast-food.png',
      color_2: '#ffffff'
    },
    {
      title_1: 'Swimming',
      img_1: '/images/heo/swimming.png',
      color_1: '#eb6840',
      title_2: 'Pc',
      img_2: '/images/heo/pc.png',
      color_2: '#8f55ba'
    },
    {
      title_1: 'Wechat',
      img_1: '/images/heo/wechat.png',
      color_1: '#f29e39',
      title_2: 'Moon',
      img_2: '/images/heo/moon.png',
      color_2: '#2c51db'
    },
    {
      title_1: 'Sleep',
      img_1: '/images/heo/sleep.png',
      color_1: '#f7cb4f',
      title_2: 'Love',
      img_2: '/images/heo/love.png',
      color_2: '#e9572b'
    },
    {
      title_1: 'Snow',
      img_1: '/images/heo/snow.png',
      color_1: '#df5b40',
      title_2: 'Doctor',
      img_2: '/images/heo/doctor.png',
      color_2: '#1f1f1f'
    }
  ],

  HEO_SOCIAL_CARD: false, // 是否显示右侧，点击加入社群按钮
  HEO_SOCIAL_CARD_TITLE_1: '别看啦',
  HEO_SOCIAL_CARD_TITLE_2: '喜欢你',
  HEO_SOCIAL_CARD_TITLE_3: '点击喜欢+1',
  HEO_SOCIAL_CARD_URL: 'https://www.lzy599.space',

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
