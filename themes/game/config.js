const CONFIG = {
  GAME_NAV_NOTION_ICON: true, // 是否读取Notion图标作为站点头像 ; 否则默认显示黑色SVG方块

  GAME_RECOMMEND_TAG: 'Recommend', // 打了此Tag，被视为推荐
  GAME_INDEX_EXPAND_RECOMMEND: true, // 首页列表是否将推荐游戏放大，否则随机放大。

  // 特殊菜单
  GAME_MENU_RANDOM_POST: true, // 是否显示随机跳转文章按钮
  GAME_MENU_SEARCH_BUTTON: true, // 是否显示搜索按钮，该按钮支持Algolia搜索

  // 默认菜单配置 （开启自定义菜单后，以下配置则失效，请在Notion中自行配置菜单）
  GAME_MENU_CATEGORY: false, // 显示分类
  GAME_MENU_TAG: true, // 显示标签
  GAME_MENU_ARCHIVE: false, // 显示归档
  GAME_MENU_SEARCH: true, // 显示搜索
  GAME_MENU_RSS: false // 显示订阅
}
export default CONFIG
