const CONFIG_MEDIUM = {

  POST_LIST_COVER: true, // 文章列表显示图片封面
  POST_LIST_PREVIEW: true, // 显示文章预览

  // 菜单
  MENU_ABOUT: true, // 显示关于
  MENU_CATEGORY: true, // 显示分类
  MENU_TAG: true, // 显示标签
  MENU_ARCHIVE: true, // 显示归档
  MENU_SEARCH: true, // 显示搜索

  // Widget
  WIDGET_REVOLVER_MAPS: process.env.NEXT_PUBLIC_WIDGET_REVOLVER_MAPS || 'false', // 地图插件
  WIDGET_TO_TOP: true // 跳回顶部
}
export default CONFIG_MEDIUM
