/**
 * Fukasawa & Commerce 主题功能配置
 * 优化点：细化动效控制、增加商超模式开关、语义化命名
 */
const CONFIG = {
  // --- 订阅配置 ---
  FUKASAWA_MAILCHIMP_FORM: false, // 邮件订阅表单 (启用后会在侧边栏显示)

  // --- 文章列表布局 ---
  FUKASAWA_POST_LIST_COVER: true,        // 文章列表显示图片封面
  FUKASAWA_POST_LIST_COVER_FORCE: true,  // 缺省封面时，自动使用站点背景图填充
  FUKASAWA_POST_LIST_PREVIEW: true,      // 显示文章摘要预览
  
  // --- 视觉动效控制 ---
  FUKASAWA_POST_LIST_ANIMATION: true,    // 博客列表淡入动画
  FUKASAWA_HOVER_LIFT: true,             // [新增] 卡片悬浮升起效果 (结合之前优化的 CSS)
  FUKASAWA_GLASS_MODE: true,             // [新增] 磨砂玻璃质感开关
  FUKASAWA_IMAGE_SHADOW: true,           // [新增] 图片深度阴影效果

  // --- 菜单与导航 ---
  FUKASAWA_MENU_CATEGORY: true,          // 侧边菜单：显示分类
  FUKASAWA_MENU_TAG: true,               // 侧边菜单：显示标签
  FUKASAWA_MENU_ARCHIVE: true,           // 侧边菜单：显示归档
  FUKASAWA_MENU_SEARCH: true,            // [新增] 侧边菜单：显示搜索框

  // --- 侧边栏交互 ---
  FUKASAWA_SIDEBAR_COLLAPSE_BUTTON: true,       // 侧边栏折叠切换按钮
  FUKASAWA_SIDEBAR_COLLAPSE_SATUS_DEFAULT: false, // 侧边栏默认保持收起 (移动端建议 false)
  FUKASAWA_SIDEBAR_COLLAPSE_ON_SCROLL: false,   // 阅读文章时滚动自动收起侧边栏
  FUKASAWA_SIDEBAR_FIXED: true,                 // [新增] 侧边栏是否固定（不随内容滚动）

  // --- 商超特有属性 (Commerce Extension) ---
  FUKASAWA_COMMERCE_PRODUCT_CENTER: true,       // 首页开启产品中心展示
  FUKASAWA_COMMERCE_NOTIC_BANNER: true,         // 显示品牌公告/简介
  FUKASAWA_COMMERCE_CATEGORY_STICKY: true       // 详情页分类目录吸顶
}

export default CONFIG
