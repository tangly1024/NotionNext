const CONFIG = {

  // Style
  MEDIUM_RIGHT_PANEL_DARK: process.env.NEXT_PUBLIC_MEDIUM_RIGHT_DARK || false, // 右侧面板深色模式

  MEDIUM_POST_LIST_COVER: true, // 文章列表显示图片封面
  MEDIUM_POST_LIST_PREVIEW: true, // 列表显示文章预览
  MEDIUM_POST_LIST_CATEGORY: true, // 列表显示文章分类
  MEDIUM_POST_LIST_TAG: true, // 列表显示文章标签

  MEDIUM_POST_DETAIL_CATEGORY: true, // 文章显示分类
  MEDIUM_POST_DETAIL_TAG: true, // 文章显示标签

  // 菜单
  MEDIUM_MENU_CATEGORY: true, // 显示分类
  MEDIUM_MENU_TAG: true, // 显示标签
  MEDIUM_MENU_ARCHIVE: true, // 显示归档
  MEDIUM_MENU_SEARCH: true, // 显示搜索

  // Widget
  MEDIUM_WIDGET_REVOLVER_MAPS: process.env.NEXT_PUBLIC_WIDGET_REVOLVER_MAPS || 'false', // 地图插件
  MEDIUM_WIDGET_TO_TOP: true // 跳回顶部
}
export default CONFIG
