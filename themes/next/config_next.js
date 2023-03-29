const CONFIG_NEXT = {

  HOME_BANNER: false, // 首页是否显示大图及标语 [true,false]
  HOME_BANNER_Strings: ['Hi，我是一个程序员', 'Hi，我是一个打工人', 'Hi，我是一个干饭人', '欢迎来到我的博客🎉'], // 首页大图标语文字

  NAV_TYPE: 'normal', // ['fixed','autoCollapse','normal'] 分别是固定屏幕顶部并始终显示、固定屏幕顶部且滚动时隐藏，不固定屏幕顶部

  POST_LIST_COVER: true, // 列表显示文章封面
  POST_LIST_COVER_DEFAULT: true, // 封面为空时用站点背景做默认封面
  POST_LIST_SUMMARY: true, // 文章摘要
  POST_LIST_PREVIEW: true, // 读取文章预览
  POST_LIST_IMG_CROSSOVER: true, // 博客列表图片左右交错

  POST_HEADER_IMAGE_VISIBLE: false, // 文章详情页是否显示封面图

  // 右侧组件
  RIGHT_BAR: true, // 是否显示右侧栏
  RIGHT_LATEST_POSTS: true, // 右侧栏最新文章
  RIGHT_CATEGORY_LIST: true, // 右侧边栏文章分类列表
  RIGHT_TAG_LIST: true, // 右侧边栏标签分类列表
  RIGHT_AD: true, // 右侧广告

  // 菜单
  MENU_HOME: true, // 显示首页
  MENU_CATEGORY: true, // 显示分类
  MENU_TAG: true, // 显示标签
  MENU_ARCHIVE: true, // 显示归档
  MENU_SEARCH: true, // 显示搜索

  WIDGET_TO_TOP: true, // 是否显示回顶
  WIDGET_TO_BOTTOM: false, // 显示回底
  WIDGET_DARK_MODE: true, // 显示日间/夜间模式切换
  WIDGET_TOC: true, // 移动端显示悬浮目录

  ARTICLE_SHARE: process.env.NEXT_PUBLIC_ARTICLE_SHARE || false, // 文章分享功能
  ARTICLE_RELATE_POSTS: true, // 相关文章推荐
  ARTICLE_COPYRIGHT: true // 文章版权声明

}

export default CONFIG_NEXT
