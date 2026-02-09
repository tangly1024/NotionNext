const CONFIG = {
  HEO_HOME_BANNER_ENABLE: true,

  HEO_SITE_CREATE_TIME: '2021-09-21', // 建站日期，用于计算网站运行的第几天

  // 首页顶部通知条滚动内容，如不需要可以留空 []
  HEO_NOTICE_BAR: [
    { title: '欢迎来到我的博客', url: 'https://note.xinfaye.top' },
   // { title: '访问文档中心获取更多帮助', url: 'https://docs.tangly1024.com' }
  ],

  // 英雄区左右侧组件颠倒位置
  HEO_HERO_REVERSE: false,
  // 博客主体区左右侧组件颠倒位置
  HEO_HERO_BODY_REVERSE: false,

  // 英雄区(首页顶部大卡)
  HEO_HERO_TITLE_1: '公考上岸',
  HEO_HERO_TITLE_2: '奋力一搏',
  HEO_HERO_TITLE_3: 'NOTE.XINFAYE.TOP',
  // 右侧
  HEO_HERO_TITLE_4: '2026公考',
  HEO_HERO_TITLE_5: '网课学习',
  HEO_HERO_TITLE_LINK: 'https://note.xinfaye.top/article/1d4465b8-4d75-800b-b8dd-e2a8ff75bf43',

  // 英雄区显示三个置顶分类
  HEO_HERO_CATEGORY_1: { title: '必看精选', url: '/tag/必看精选' },
  HEO_HERO_CATEGORY_2: { title: '热门文章', url: '/tag/热门文章' },
  HEO_HERO_CATEGORY_3: { title: '实用教程', url: '/tag/实用教程' },

  // 英雄区右侧推荐文章标签, 例如 [推荐] , 最多六篇文章; 若留空白''，则推荐最近更新文章
  HEO_HERO_RECOMMEND_POST_TAG: '推荐',
  HEO_HERO_RECOMMEND_POST_SORT_BY_UPDATE_TIME: true, // 推荐文章排序，为`true`时将强制按最后修改时间倒序
  //  HERO_RECOMMEND_COVER: 'https://pic2.ziyuan.wang/user/Herman/2024/11/20230115_123006_67fadf59534c1.jpg', // 英雄区右侧图片

  // 右侧个人资料卡牌欢迎语，点击可自动切换
  HEO_INFOCARD_GREETINGS: [
    '学不可以已',
    '轻装策马青云路',
    '人生从此驭长风'
  ],

  // 个人资料底部按钮
  HEO_INFO_CARD_URL1: '/about',
  HEO_INFO_CARD_ICON1: 'fas fa-user',
  HEO_INFO_CARD_URL2: 'https://xinfaye.top',
  HEO_INFO_CARD_ICON2: 'fab fa-weixin',
  HEO_INFO_CARD_URL3: 'https://pic2.ziyuan.wang/2023/05/26/08eda9a4c3b92.jpg',
  HEO_INFO_CARD_TEXT3: '了解更多',

  // 用户技能图标
  HEO_GROUP_ICONS: [
    {
      title_1: 'leida',
      img_1: '/images/heo/leida.png',
      color_1: '#009B8C',
      title_2: 'xingguang',
      img_2: '/images/heo/xingguang.png',
      color_2: '#F3BE26'
    },
    {
      title_1: 'huatu',
      img_1: '/images/heo/huatu.png',
      color_1: '#FF3F47',
      title_2: 'zhonggong',
      img_2: '/images/heo/zhonggong.png',
      color_2: '#E60012'
    },
    {
      title_1: 'fenbi',
      img_1: '/images/heo/fenbi.png',
      color_1: '#0099FF',
      title_2: 'banyuetan',
      img_2: '/images/heo/banyuetan.png',
      color_2: '#C61420'
    },
    {
      title_1: 'sihai',
      img_1: '/images/heo/sihai.png',
      color_1: '#1DDA64',
      title_2: 'buzhi',
      img_2: '/images/heo/buzhi.png',
      color_2: '#DAE5F5'
    },
    {
      title_1: 'gaotu',
      img_1: '/images/heo/gaotu.png',
      color_1: '#F5232D',
      title_2: 'gongwuyuan',
      img_2: '/images/heo/gongwuyuan.png',
      color_2: '#8A0102'
    },
    {
      title_1: 'xintujing',
      img_1: '/images/heo/xintujing.png',
      color_1: '#126EFD',
      title_2: 'tidian',
      img_2: '/images/heo/tidian.png',
      color_2: '#24C5AB'
    }
  ],

  HEO_SOCIAL_CARD: true, // 是否显示右侧，点击加入社群按钮
  HEO_SOCIAL_CARD_TITLE_1: '交流频道',
  HEO_SOCIAL_CARD_TITLE_2: '关注公众号讨论分享',
  HEO_SOCIAL_CARD_TITLE_3: '点击关注公众号',
  HEO_SOCIAL_CARD_URL: 'https://pic2.ziyuan.wang/2023/05/31/78005f49ee989.png',

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
