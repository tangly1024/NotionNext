const CONFIG = {
  MATERY_HOME_BANNER_ENABLE: true,
  // 3.14.1以后的版本中，欢迎语在blog.config.js中配置，用英文逗号','隔开多个。
  MATERY_HOME_BANNER_GREETINGS: [
    'Hi，我是一个程序员',
    'Hi，我是一个打工人',
    'Hi，我是一个干饭人',
    '欢迎来到我的博客🎉'
  ], // 首页大图标语文字

  MATERY_HOME_NAV_BUTTONS: true, // 首页是否显示分类大图标按钮
  MATERY_HOME_NAV_BACKGROUND_IMG_FIXED: false, // 首页背景图滚动时是否固定，true 则滚动时图片不懂； false则随鼠标滚动

  // 是否显示开始阅读按钮
  MATERY_SHOW_START_READING: true,

  // 菜单配置
  MATERY_MENU_CATEGORY: true, // 显示分类
  MATERY_MENU_TAG: true, // 显示标签
  MATERY_MENU_ARCHIVE: true, // 显示归档
  MATERY_MENU_SEARCH: true, // 显示搜索

  MATERY_POST_LIST_COVER: true, // 文章封面
  MATERY_POST_LIST_SUMMARY: true, // 文章摘要
  MATERY_POST_LIST_PREVIEW: true, // 读取文章预览

  MATERY_ARTICLE_ADJACENT: true, // 显示上一篇下一篇文章推荐
  MATERY_ARTICLE_COPYRIGHT: true, // 显示文章版权声明
  MATERY_ARTICLE_NOT_BY_AI: false, // 显示非AI写作
  MATERY_ARTICLE_RECOMMEND: true, // 文章关联推荐

  MATERY_WIDGET_LATEST_POSTS: true, // 显示最新文章卡
  MATERY_WIDGET_ANALYTICS: false, // 显示统计卡
  MATERY_WIDGET_TO_TOP: true,
  MATERY_WIDGET_TO_COMMENT: true, // 跳到评论区
  WIDGET_DARK_MODE: true, // 夜间模式
  MATERY_WIDGET_TOC: true // 移动端悬浮目录
}
export default CONFIG
