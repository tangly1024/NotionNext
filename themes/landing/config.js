const CONFIG = {

  LANDING_INDEX_PAGE: 'about', // 文档首页显示的文章，请确此路径包含在您的notion数据库中

  LANDING_AUTO_SORT: process.env.NEXT_PUBLIC_GITBOOK_AUTO_SORT || true, // 是否自动按分类名 归组排序文章；自动归组可能会打乱您Notion中的文章顺序

  // 菜单
  LANDING_MENU_CATEGORY: true, // 显示分类
  LANDING_BOOK_MENU_TAG: true, // 显示标签
  LANDING_MENU_ARCHIVE: true, // 显示归档
  LANDING_MENU_SEARCH: true, // 显示搜索

  // Widget
  LANDING_WIDGET_REVOLVER_MAPS: process.env.NEXT_PUBLIC_WIDGET_REVOLVER_MAPS || 'false', // 地图插件
  LANDING_WIDGET_TO_TOP: true // 跳回顶部
}
export default CONFIG
