const CONFIG = {

  HOME_BANNER: true, // 首页是否显示大图及标语 [true,false]
  HOME_BANNER_Strings: ['Hi，我是一个程序员', 'Hi，我是一个打工人', 'Hi，我是一个干饭人', '欢迎来到我的博客🎉'], // 首页大图标语文字

  NAV_TYPE: 'normal', // ['fixed','autoCollapse','normal'] 分别是固定屏幕顶部并始终显示、固定屏幕顶部且滚动时隐藏，不固定屏幕顶部

  POST_LIST_COVER: false, // 文章列表显示封面图
  POST_LIST_PREVIEW: true, // 显示文章预览
  POST_LIST_SUMMARY: false, // 显示用户自定义摘要，有预览时优先只展示预览

  POST_HEADER_IMAGE_VISIBLE: false, // 文章详情页是否显示封面图

  // 右侧组件
  RIGHT_BAR: true, // 是否显示右侧栏
  RIGHT_LATEST_POSTS: true, // 右侧栏最新文章
  RIGHT_CATEGORY_LIST: true, // 右侧边栏文章分类列表
  RIGHT_TAG_LIST: true, // 右侧边栏标签分类列表
  RIGHT_AD: false, // 右侧广告

  // 菜单
  MENU_HOME: true, // 显示首页
  MENU_CATEGORY: true, // 显示分类
  MENU_TAG: true, // 显示标签
  MENU_ARCHIVE: true, // 显示归档
  MENU_SEARCH: true, // 显示搜索

  WIDGET_TO_TOP: true, // 是否显示回顶
  WIDGET_TO_BOTTOM: false, // 显示回底
  WIDGET_DARK_MODE: false, // 显示日间/夜间模式切换
  WIDGET_TOC: true, // 移动端显示悬浮目录

  ARTICLE_RELATE_POSTS: true, // 相关文章推荐
  ARTICLE_COPYRIGHT: true, // 文章版权声明
  ARTICLE_INFO: true // 显示文章信息

}

export default CONFIG
