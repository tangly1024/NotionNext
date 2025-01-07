const CONFIG = {
  // 首屏信息栏按钮文字
  MAGZINE_HOME_BANNER_ENABLE: true, // 首屏右上角的宣传位
  MAGZINE_HOME_BUTTON: true,
  MAGZINE_HOME_BUTTON_URL: '/about',
  MAGZINE_HOME_BUTTON_TEXT: '了解更多',

  MAGZINE_HOME_HIDDEN_CATEGORY: '分享杂文', //不希望在首页展示的文章分类，用英文逗号隔开

  MAGZINE_HOME_TITLE: 'Know more about AI/AR/VR Glasses and XR',
  MAGZINE_HOME_DESCRIPTION:
    'Focused on AI/AR/VR Glasses reviews and usage tips, XR-related content and software reviews',
  MAGZINE_HOME_TIPS: 'Through AI and AR, the virtual and the real will be combined.',

  // 首页底部推荐文章标签, 例如 [推荐] , 最多六篇文章; 若留空白''，则推荐最近更新文章
  MAGZINE_RECOMMEND_POST_TAG: 'Recommend',
  MAGZINE_RECOMMEND_POST_COUNT: 6,
  MAGZINE_RECOMMEND_POST_TITLE: 'Recommended Article',
  MAGZINE_RECOMMEND_POST_SORT_BY_UPDATE_TIME: false, // 推荐文章排序，为`true`时将强制按最后修改时间倒序

  // Style
  MAGZINE_RIGHT_PANEL_DARK: process.env.NEXT_PUBLIC_MAGZINE_RIGHT_DARK || false, // 右侧面板深色模式

  MAGZINE_POST_LIST_COVER: true, // 文章列表显示图片封面
  MAGZINE_POST_LIST_PREVIEW: true, // 列表显示文章预览
  MAGZINE_POST_LIST_CATEGORY: true, // 列表显示文章分类
  MAGZINE_POST_LIST_TAG: true, // 列表显示文章标签

  MAGZINE_POST_DETAIL_CATEGORY: true, // 文章显示分类
  MAGZINE_POST_DETAIL_TAG: true, // 文章显示标签

  // 文章页面联系卡
  MAGZINE_SOCIAL_CARD: true, // 是否显示右侧，点击加入社群按钮
  MAGZINE_SOCIAL_CARD_TITLE_1: 'Communication Channel',
  MAGZINE_SOCIAL_CARD_TITLE_2: 'Join community discussions and share',
  MAGZINE_SOCIAL_CARD_TITLE_3: 'Click to join the community',
  MAGZINE_SOCIAL_CARD_URL: 'https://docs.tangly1024.com/article/chat-community',

  // 页脚菜单
  MAGZINE_FOOTER_LINKS: [
    {
      name: '友情链接',
      menus: [
        {
          title: 'Tangly的学习笔记',
          href: 'https://blog.tangly1024.com'
        },
        {
          title: 'NotionNext',
          href: 'https://www.tangly1024.com'
        }
      ]
    },
    {
      name: '开发者',
      menus: [
        { title: 'Github', href: 'https://github.com/tangly1024/NotionNext' },
        {
          title: '开发帮助',
          href: 'https://docs.tangly1024.com/article/how-to-develop-with-notion-next'
        },
        {
          title: '功能反馈',
          href: 'https://github.com/tangly1024/NotionNext/issues/new/choose'
        },
        {
          title: '技术讨论',
          href: 'https://github.com/tangly1024/NotionNext/discussions'
        },
        {
          title: '关于作者',
          href: 'https://blog.tangly1024.com/about'
        }
      ]
    },
    {
      name: '支持',
      menus: [
        {
          title: '站长社群',
          href: 'https://docs.tangly1024.com/article/chat-community'
        },
        {
          title: '咨询与定制',
          href: 'https://docs.tangly1024.com/article/my-service'
        },
        {
          title: '升级手册',
          href: 'https://docs.tangly1024.com/article/my-service'
        },
        {
          title: '安装教程',
          href: 'https://docs.tangly1024.com/article/how-to-update-notionnext'
        },
        { title: 'SEO推广', href: 'https://seo.tangly1024.com/' }
      ]
    },
    {
      name: '解决方案',
      menus: [
        { title: '建站工具', href: 'https://www.tangly1024.com/' },
        { title: 'NotionNext', href: 'https://docs.tangly1024.com/about' }
      ]
    }
  ],

  // 旧版本顶部菜单
  MAGZINE_MENU_CATEGORY: true, // 显示分类
  MAGZINE_MENU_TAG: true, // 显示标签
  MAGZINE_MENU_ARCHIVE: true, // 显示归档
  MAGZINE_MENU_SEARCH: true, // 显示搜索

  MAGZINE_WIDGET_TO_TOP: true // 跳回顶部
}
export default CONFIG
