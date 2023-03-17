const CONFIG_MEDIUM = {

  // Style
  RIGHT_PANEL_DARK: process.env.NEXT_PUBLIC_MEDIUM_RIGHT_DARK || false, // 右侧面板深色模式

  POST_LIST_COVER: true, // 文章列表显示图片封面
  POST_LIST_PREVIEW: true, // 列表显示文章预览
  POST_LIST_CATEGORY: true, // 列表显示文章分类
  POST_LIST_TAG: true, // 列表显示文章标签

  POST_DETAIL_CATEGORY: true, // 文章显示分类
  POST_DETAIL_TAG: true, // 文章显示标签

  // 菜单
  MENU_CATEGORY: true, // 显示分类
  MENU_TAG: true, // 显示标签
  MENU_ARCHIVE: true, // 显示归档
  MENU_SEARCH: true, // 显示搜索

  // Widget
  WIDGET_REVOLVER_MAPS: process.env.NEXT_PUBLIC_WIDGET_REVOLVER_MAPS || 'false', // 地图插件
  WIDGET_TO_TOP: true // 跳回顶部
}
export default CONFIG_MEDIUM
