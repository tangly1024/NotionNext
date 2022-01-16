const CONFIG_NEXT = {

  HOME_BANNER: false, // 首页是否显示大图及标语 [true,false]
  HOME_BANNER_Strings: ['Hi，我是一个程序员', 'Hi，我是一个打工人', 'Hi，我是一个干饭人', '欢迎来到我的博客🎉'], // 首页大图标语文字
  HOME_BANNER_IMAGE: './bg_image.jpg', // 背景图地址

  POST_LIST_TYPE: 'page', // ['page','scroll] 文章列表样式:页码分页、单页滚动加载
  POST_LIST_COVER: false, // 文章列表显示封面图
  POST_LIST_PREVIEW: true, // 显示文章预览
  POST_LIST_SUMMARY: false, // 显示用户自定义摘要，有预览时优先只展示预览

  // 右侧组件
  RIGHT_BAR: false, // 是否显示右侧栏
  RIGHT_LATEST_POSTS: false, // 右侧栏最新文章
  RIGHT_CATEGORY_LIST: false, // 右侧边栏文章分类列表
  RIGHT_TAG_LIST: false, // 右侧边栏标签分类列表
  RIGHT_AD: false, // 右侧广告

  // 菜单
  MENU_ABOUT: false, // 显示关于
  MENU_CATEGORY: true, // 显示分类
  MENU_TAG: true, // 显示标签
  MENU_ARCHIVE: true, // 显示归档
  MENU_SEARCH: true, // 显示搜索

  // 悬浮挂件
  WIDGET_PET: false, // 是否显示宠物挂件
  WIDGET_PET_LINK: 'https://cdn.jsdelivr.net/npm/live2d-widget-model-wanko@1.0.5/assets/wanko.model.json', // 挂件模型地址 @see https://github.com/xiazeyu/live2d-widget-models
  WIDGET_TO_TOP: true, // 是否显示回顶
  WIDGET_TO_BOTTOM: false, // 显示回底
  WIDGET_DARK_MODE: false, // 显示日间/夜间模式切换
  WIDGET_TOC: true, // 移动端显示悬浮目录

  ARTICLE_SHARE: false, // 文章分享功能
  ARTICLE_RELATE_POSTS: true, // 相关文章推荐
  ARTICLE_COPYRIGHT: true, // 文章版权声明

  NAV_TYPE: 'fixed', // ['fixed','autoCollapse','normal'] 分别是固定屏幕顶部、屏幕顶部自动折叠，不固定

  appearance: 'auto', // ['light', 'dark', 'auto'],
  font: 'font-serif tracking-wider subpixel-antialiased', // 文章字体 ['font-sans', 'font-serif', 'font-mono'] @see https://www.tailwindcss.cn/docs/font-family
  lightBackground: '#eeeeee', // use hex value, don't forget '#' e.g #fffefc
  darkBackground: '#111827', // use hex value, don't forget '#'
  path: '', // leave this empty unless you want to deploy in a folder
  since: 2020, // if leave this empty, current year will be used.
  postListStyle: 'page', // ['page','scroll] 文章列表样式:页码分页、单页滚动加载
  postsPerPage: 6, // post counts per page
  sortByDate: false,
  topNavType: 'normal' // ['fixed','autoCollapse','normal'] 分别是固定顶部、固定底部滑动时自动折叠，不固定
}

export default CONFIG_NEXT
