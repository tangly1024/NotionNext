const CONFIG_HEXO = {
  HOME_BANNER_ENABLE: true,
  HOME_BANNER_GREETINGS: ['Hi，I was a student in life sciences and medical engineering','Hi，I am now a researcher in the field of interdisciplinary informatics', 'Hi，I am also an internet entrepreneur in the field of mental health', 'Hi，I am about to become a business consultant for a Fortune 500 company', 'Welcome to my brain🧠'], // 首页大图标语文字

  HOME_NAV_BUTTONS: true, // 首页是否显示分类大图标按钮
  HOME_NAV_BACKGROUND_IMG_FIXED: true, // 首页背景图滚动时是否固定，true 则滚动时图片不懂； false则随鼠标滚动

  // 菜单配置
  MENU_INDEX: true, // 显示首页
  MENU_CATEGORY: true, // 显示分类
  MENU_TAG: true, // 显示标签
  MENU_ARCHIVE: true, // 显示归档
  MENU_SEARCH: true, // 显示搜索

  POST_LIST_COVER: true, // 列表显示文章封面
  POST_LIST_COVER_HOVER_ENLARGE: false, // 列表鼠标悬停放大

  POST_LIST_COVER_DEFAULT: true, // 封面为空时用站点背景做默认封面
  POST_LIST_SUMMARY: true, // 文章摘要
  POST_LIST_PREVIEW: false, // 读取文章预览
  POST_LIST_IMG_CROSSOVER: true, // 博客列表图片左右交错

  ARTICLE_ADJACENT: true, // 显示上一篇下一篇文章推荐
  ARTICLE_COPYRIGHT: true, // 显示文章版权声明
  ARTICLE_RECOMMEND: true, // 文章关联推荐

  WIDGET_LATEST_POSTS: true, // 显示最新文章卡
  WIDGET_ANALYTICS: true, // 显示统计卡
  WIDGET_TO_TOP: true,
  WIDGET_TO_COMMENT: true, // 跳到评论区
  WIDGET_DARK_MODE: true, // 夜间模式
  WIDGET_TOC: true // 移动端悬浮目录
}
export default CONFIG_HEXO
