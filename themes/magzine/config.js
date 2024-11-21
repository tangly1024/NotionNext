const CONFIG = {
  // 首屏信息栏按钮文字
  MAGZINE_HOME_BANNER_ENABLE: false, // 首屏右上角的宣传位
  MAGZINE_HOME_BUTTON: false,
  MAGZINE_HOME_BUTTON_URL: '/about',
  MAGZINE_HOME_BUTTON_TEXT: '了解更多',

  MAGZINE_HOME_HIDDEN_CATEGORY: '分享杂文', //不希望在首页展示的文章分类，用英文逗号隔开

  MAGZINE_HOME_TITLE: '立即开创您的在线业务。完全免费。',
  MAGZINE_HOME_DESCRIPTION:
    '借助NotionNext，获得助您开创、经营和扩展业务所需的全部工具和帮助。',
  MAGZINE_HOME_TIPS: 'AI时代来临，这是属于超级个体的狂欢盛宴！',
  // Style
  MAGZINE_RIGHT_PANEL_DARK: process.env.NEXT_PUBLIC_MAGZINE_RIGHT_DARK || true, // 右侧面板深色模式

  MAGZINE_POST_LIST_COVER: true, // 文章列表显示图片封面
  MAGZINE_POST_LIST_PREVIEW: true, // 列表显示文章预览
  MAGZINE_POST_LIST_CATEGORY: true, // 列表显示文章分类
  MAGZINE_POST_LIST_TAG: true, // 列表显示文章标签

  MAGZINE_POST_DETAIL_CATEGORY: true, // 文章显示分类
  MAGZINE_POST_DETAIL_TAG: true, // 文章显示标签

  // 文章页面联系卡
  MAGZINE_SOCIAL_CARD: true, // 是否显示右侧，点击加入社群按钮
  MAGZINE_SOCIAL_CARD_TITLE_1: 'Valhalla官方频道',
  MAGZINE_SOCIAL_CARD_TITLE_2: '加入社群',
  MAGZINE_SOCIAL_CARD_TITLE_3: '点击加入英灵殿',
  MAGZINE_SOCIAL_CARD_URL: 'https://docs.tangly1024.com/article/chat-community',



  // 旧版本顶部菜单
  MAGZINE_MENU_CATEGORY: false, // 显示分类
  MAGZINE_MENU_TAG: true, // 显示标签
  MAGZINE_MENU_ARCHIVE: false, // 显示归档
  MAGZINE_MENU_SEARCH: true, // 显示搜索

  MAGZINE_WIDGET_TO_TOP: true // 跳回顶部
}
export default CONFIG
