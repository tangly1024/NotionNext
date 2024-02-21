const CONFIG = {

  INDEX_PAGE: 'about', // 文档首页显示的文章，请确此路径包含在您的notion数据库中

  AUTO_SORT: false, // 是否自动按分类名 归组排序文章；自动归组可能会打乱您Notion中的文章顺序

  // 菜单
  MENU_CATEGORY: false, // 显示分类
  MENU_TAG: false, // 显示标签
  MENU_ARCHIVE: false, // 显示归档
  MENU_SEARCH: false, // 显示搜索

  // Widget
  WIDGET_REVOLVER_MAPS: process.env.NEXT_PUBLIC_WIDGET_REVOLVER_MAPS || 'false', // 地图插件
  WIDGET_TO_TOP: true // 跳回顶部
}
export default CONFIG
