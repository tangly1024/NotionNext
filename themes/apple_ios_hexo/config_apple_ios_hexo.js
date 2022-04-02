const CONFIG_ANDYSPRO = {
  HOME_BANNER_ENABLE: true,
  HOME_BANNER_GREETINGS: [
    'Hi，我是一個工程師！',
    'Hi，我喜歡寫 React！',
    'Hi，我喜歡寫 TypeScript！',
    'Hi，我喜歡 Apple 產品！',
    'Hi，我是一位運動員',
    'Hi，我喜歡軟式網球',
    '歡迎來到我的 Blog🎉',
    '歡迎觀看我的 YouTube ❤️'
  ], // 首頁大圖標語文字
  HOME_BANNER_IMAGE: './bg_image.jpg', // see /public/bg_image.jpg

  // 菜单配置
  MENU_CATEGORY: true, // 显示分类
  MENU_TAG: true, // 显示标签
  MENU_ARCHIVE: true, // 显示归档
  MENU_SEARCH: true, // 显示搜索

  POST_LIST_COVER: true, // 文章封面
  POST_LIST_SUMMARY: true, // 文章摘要
  POST_LIST_PREVIEW: true, // 读取文章预览
  NAV_TYPE: 'autoCollapse', // ['fixed','autoCollapse','normal'] 分别是固定屏幕顶部、屏幕顶部自动折叠，不固定

  ARTICLE_ADJACENT: true, // 显示上一篇下一篇文章推荐
  ARTICLE_COPYRIGHT: true, // 显示文章版权声明
  ARTICLE_RECOMMEND: true, // 文章关联推荐

  WIDGET_LATEST_POSTS: true, // 显示最新文章卡
  WIDGET_ANALYTICS: false, // 显示统计卡
  WIDGET_TO_TOP: true,
  WIDGET_TO_COMMENT: true, // 跳到评论区
  WIDGET_DARK_MODE: true, // 夜间模式
  WIDGET_TOC: true // 移动端悬浮目录
}
export default CONFIG_ANDYSPRO
