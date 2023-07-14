const CONFIG_GITBOOK = {

  INDEX_PAGE: 'about', // 文档首页显示的文章，请确此路径包含在您的notion数据库中

  // 菜单
  MENU_CATEGORY: true, // 显示分类
  MENU_TAG: true, // 显示标签
  MENU_ARCHIVE: true, // 显示归档
  MENU_SEARCH: true, // 显示搜索

  // Widget
  WIDGET_REVOLVER_MAPS: process.env.NEXT_PUBLIC_WIDGET_REVOLVER_MAPS || 'false', // 地图插件
  WIDGET_TO_TOP: true // 跳回顶部
}
export default CONFIG_GITBOOK
