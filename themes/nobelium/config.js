const CONFIG = {
  NOBELIUM_NAV_NOTION_ICON: true, // 是否读取Notion图标作为站点头像 ; 否则默认显示黑色SVG方块

  // 特殊菜单
  NOBELIUM_MENU_RANDOM_POST: true, // 是否显示随机跳转文章按钮
  NOBELIUM_MENU_SEARCH_BUTTON: true, // 是否显示搜索按钮，该按钮支持Algolia搜索

  // 默认菜单配置 （开启自定义菜单后，以下配置则失效，请在Notion中自行配置菜单）
  NOBELIUM_MENU_CATEGORY: false, // 显示分类
  NOBELIUM_MENU_TAG: true, // 显示标签
  NOBELIUM_MENU_ARCHIVE: false, // 显示归档
  NOBELIUM_MENU_SEARCH: true, // 显示搜索
  NOBELIUM_MENU_RSS: false, // 显示订阅

  NOBELIUM_AUTO_COLLAPSE_NAV_BAR: true // 页头导航栏动画
}
export default CONFIG
