/**
 * Endspace Theme - Endfield Style Configuration
 * 重要配置项，默认值均为当前效果
 * 
 * ============================================
 * 特殊页面配置说明 (Special Pages)
 * ============================================
 * 
 * 以下页面需要在 Notion 中配置菜单(Menu)：
 * - 【AboutMe 关于我页面】- 点击侧边栏头像跳转
 * - 【Portfolio 作品集页面】- 侧边栏导航项
 * - 【Friends 友链页面】- 侧边栏导航项
 * 
 * 配置步骤：
 * 1. 在 Notion 的菜单数据库中添加一个新条目
 * 2. 设置 Type 为 Menu
 * 3. 设置 Title 为你想要的菜单名称
 * 4. 设置 Slug 为对应的路径
 * 5. 在 Notion 中创建对应的页面内容
 * 具体可参考NotionNext的帮助手册：https://docs.tangly1024.com/article/notion-next-secondary-menu
 * 
 * 示例配置：
 * | Type | Title     | Slug       |
 * |------|-----------|------------|
 * | Menu | AboutMe   | /aboutme   |
 * | Menu | Portfolio | /portfolio |
 * | Menu | Friends   | /friends   |
 * 
 * 配置完成后，Portfolio 和 Friends 会自动出现在侧边栏导航中。
 */

const CONFIG = {
  // ============================================
  // 加载动画 (Loading Animation)
  // ============================================
  ENDSPACE_LOADING_COVER: true, // 是否显示加载动画
  
  // 加载动画显示的站点名称 (右侧竖排大字)
  ENDSPACE_LOADING_SITE_NAME: 'CLOUD09_SPACE', // 站点名称，显示在加载动画右侧
  
  // 加载进度文字 (不同阶段)
  ENDSPACE_LOADING_TEXT_INIT: 'INITIALIZING', // 初始化阶段显示的文字
  ENDSPACE_LOADING_TEXT_LOADING: 'LOADING', // 加载阶段显示的文字
  ENDSPACE_LOADING_TEXT_COMPLETE: 'READY', // 加载完成阶段显示的文字
  ENDSPACE_LOADING_TEXT_SWEEPING: 'LAUNCHING', // 扫描阶段显示的文字
  ENDSPACE_LOADING_TEXT_FADEOUT: 'WELCOME', // 淡出阶段显示的文字
  
  // 加载动画中的图片，可以使用public目录下的图片如'/images/logo.png'，也可以使用url如https://example.com/image.png
  ENDSPACE_LOADING_IMAGE: '/svg/cloud.svg', // 加载动画中显示的图片

  // ============================================
  // 水印文字配置 (Watermark Text)
  // ============================================
  // 首页标题栏背景滚动水印文字（大字循环动画）
  ENDSPACE_BANNER_WATERMARK_TEXT: 'CLOUD09_SPACE',
  // 文章详情页右上角水印文字
  ENDSPACE_ARTICLE_WATERMARK_TEXT: 'CLOUD09',

  // ============================================
  // 菜单配置 (Menu)
  // ============================================
  ENDSPACE_MENU_CATEGORY: true, // 显示分类菜单
  ENDSPACE_MENU_TAG: true, // 显示标签菜单
  ENDSPACE_MENU_ARCHIVE: true, // 显示归档菜单
  ENDSPACE_MENU_SEARCH: true, // 显示搜索菜单

  // ============================================
  // 文章列表 (Post List)
  // ============================================
  ENDSPACE_POST_LIST_COVER: true, // 文章列表是否显示封面图
  ENDSPACE_POST_LIST_PREVIEW: true, // 文章列表是否显示摘要预览

  // ============================================
  // 文章详情页 (Article Page)
  // ============================================
  ENDSPACE_ARTICLE_LAYOUT_VERTICAL: false, // 文章页是否使用垂直布局
  ENDSPACE_ARTICLE_ADJACENT: true // 是否显示上一篇/下一篇文章导航
}
export default CONFIG
