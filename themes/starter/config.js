/**
 * 另一个落地页主题
 */
const CONFIG = {

  // 默认只展示Logo文字，如果设置了logo图片，会在文字左侧显示图标
  STARTER_LOGO: 'https://cdn.nakeu.cn/static/logo/logo.png', // 普通logo图片 示例：/images/starter/logo/logo.svg
  STARTER_LOGO_WHITE: 'https://cdn.nakeu.cn/static/logo/logo.png', // 透明底浅色logo 示例： /images/starter/logo/logo-white.svg

  // MENU ， 菜单部分不在此处配置，请在Notion数据库中添加MENU

  // 英雄区块导航
  STARTER_HERO_ENABLE: true, // 开启英雄区
  STARTER_HERO_TITLE_1: 'NanKo Inc', // 英雄区文字
  STARTER_HERO_TITLE_2: '南科网络成立于2023年，总部位于中国天津。公司一直秉承科技向善的宗旨。南科网络还提供云计算、广告、金融科技等一系列企业服务。', // 英雄区文字
  // 英雄区两个按钮，如果TEXT留空则隐藏按钮
  STARTER_HERO_BUTTON_1_TEXT: '', // 英雄区按钮
  STARTER_HERO_BUTTON_1_URL: '', // 英雄区按钮
  STARTER_HERO_BUTTON_2_TEXT: '', // 英雄区按钮
  STARTER_HERO_BUTTON_2_URL: '', // 英雄区按钮
  STARTER_HERO_BUTTON_2_ICON: '', // 英雄区按钮2的图标，不需要则留空

  STARTER_HERO_PREVIEW_IMAGE: 'https://img.tucang.cc/api/image/show/2acdf8c5a8b46c8381175c8abf0a11a0', // 产品预览图 ，默认读取public目录下图片

  // 顶部右侧导航暗流
  STARTER_NAV_BUTTON_1_TEXT: 'Sign In',
  STARTER_NAV_BUTTON_1_URL: '',

  STARTER_NAV_BUTTON_2_TEXT: 'Sign Up',
  STARTER_NAV_BUTTON_2_URL: '',

  // 特性区块
  STARTER_FEATURE_ENABLE: true, // 特性区块开关
  STARTER_FEATURE_TITLE: '特性', // 特性
  STARTER_FEATURE_TEXT_1: ' 便捷的使用体验', // 特性
  STARTER_FEATURE_TEXT_2: '即开即用', // 特性

  STARTER_FEATURE_1_TITLE_1: '企业与科技', // 特性1
  STARTER_FEATURE_1_TEXT_1: '数字化助手，助力产业升级', // 特性1
  STARTER_FEATURE_1_BUTTON_TEXT: '了解更多', // 特性1
  STARTER_FEATURE_1_BUTTON_URL: '', // 特性1

  STARTER_FEATURE_2_TITLE_1: '现在与未来', // 特性2
  STARTER_FEATURE_2_TEXT_1: '探索面向未来的创新科技', // 特性2
  STARTER_FEATURE_2_BUTTON_TEXT: '了解更多', // 特性2
  STARTER_FEATURE_2_BUTTON_URL: '', // 特性2

  STARTER_FEATURE_3_TITLE_1: '责任与信任', // 特性3
  STARTER_FEATURE_3_TEXT_1: ' 聚合微小善行，以科技让世界更美好', // 特性3
  STARTER_FEATURE_3_BUTTON_TEXT: '了解更多', // 特性3
  STARTER_FEATURE_3_BUTTON_URL: '', // 特性3

  STARTER_FEATURE_4_TITLE_1: '用户与生活', // 特性4
  STARTER_FEATURE_4_TEXT_1: '让生活更便捷更多彩', // 特性4
  STARTER_FEATURE_4_BUTTON_TEXT: '了解更多', // 特性4
  STARTER_FEATURE_4_BUTTON_URL: '', // 特性4

  // 首页ABOUT区块
  STARTER_ABOUT_ENABLE: true, // ABOUT区块开关
  STARTER_ABOUT_TITLE: '一套轻量实用的解决方案',
  STARTER_ABOUT_TEXT: '我们使用最新的技术，只为给您最好的体验<br /> <br /> 功能强大的 NanKo_System。',
  STARTER_ABOUT_BUTTON_TEXT: '了解更多',
  STARTER_ABOUT_BUTTON_URL: '/details',
  STARTER_ABOUT_IMAGE_1: 'https://img.tucang.cc/api/image/show/a8a0e597f2acd9e98a0f6d24077bfc45',
  STARTER_ABOUT_IMAGE_2: 'https://img.tucang.cc/api/image/show/74e88b835701e67910ba71cd0c85919d',
  STARTER_ABOUT_TIPS_1: '7000+',
  STARTER_ABOUT_TIPS_2: '忠实用户',
  STARTER_ABOUT_TIPS_3: '正在使用我们的产品',

  // 首页价格区块
  STARTER_PRICING_ENABLE: true, // 价格区块开关
  STARTER_PRICING_TITLE: '价格表',
  STARTER_PRICING_TEXT_1: '很棒的定价计划',
  STARTER_PRICING_TEXT_2: '我们制定了灵活的付费模式，您可以按需选择。',

  STARTER_PRICING_1_TITLE: '入门版',
  STARTER_PRICING_1_PRICE: '19.9',
  STARTER_PRICING_1_PRICE_CURRENCY: '$',
  STARTER_PRICING_1_PRICE_PERIOD: '每月',
  STARTER_PRICING_1_HEADER: '功能点',
  STARTER_PRICING_1_FEATURES: '入门套餐,免费更新,帮助手册', // 英文逗号隔开
  STARTER_PRICING_1_BUTTON_TEXT: '立即购买',
  STARTER_PRICING_1_BUTTON_URL: '',

  STARTER_PRICING_2_TAG: '推荐',
  STARTER_PRICING_2_TITLE: '基础版',
  STARTER_PRICING_2_PRICE: '39.9',
  STARTER_PRICING_2_PRICE_CURRENCY: '$',
  STARTER_PRICING_2_PRICE_PERIOD: '每月',
  STARTER_PRICING_2_HEADER: '功能点',
  STARTER_PRICING_2_FEATURES: '包含入门版,项目源码,内部社群,技术咨询,SEO优化', // 英文逗号隔开
  STARTER_PRICING_2_BUTTON_TEXT: '立即购买',
  STARTER_PRICING_2_BUTTON_URL: '',

  STARTER_PRICING_3_TITLE: '高级版',
  STARTER_PRICING_3_PRICE: '59.9',
  STARTER_PRICING_3_PRICE_CURRENCY: '$',
  STARTER_PRICING_3_PRICE_PERIOD: '每月',
  STARTER_PRICING_3_HEADER: '功能点',
  STARTER_PRICING_3_FEATURES: '包含基础版,功能定制开发', // 英文逗号隔开
  STARTER_PRICING_3_BUTTON_TEXT: '立即购买',
  STARTER_PRICING_3_BUTTON_URL: '',

  // 首页用户测评区块
  STARTER_TESTIMONIALS_ENABLE: true, // 测评区块开关
  STARTER_TESTIMONIALS_TITLE: '用户反馈',
  STARTER_TESTIMONIALS_TEXT_1: '我们的用户怎么说',
  STARTER_TESTIMONIALS_TEXT_2: '数千位用户选择NanKo',
  STARTER_TESTIMONIALS_STAR_ICON: '/images/starter/testimonials/icon-star.svg', // 评分图标

  // 这里不支持CONFIG和环境变量，需要一一修改此处代码。
  STARTER_TESTIMONIALS_ITEMS: [
    {
      STARTER_TESTIMONIALS_ITEM_TEXT: '之前尝试过第三方平台，实现效果一般，个性化程度远不如这个方法，已经用起来了！ ',
      STARTER_TESTIMONIALS_ITEM_AVATAR: 'https://cdn.nakeu.cn/static/www.nakeu.cn/team-pic/1.JPG',
      STARTER_TESTIMONIALS_ITEM_NICKNAME: '单调',
      STARTER_TESTIMONIALS_ITEM_DESCRIPTION: '站长',
      STARTER_TESTIMONIALS_ITEM_URL: ''
    },
    {
      STARTER_TESTIMONIALS_ITEM_TEXT: '很喜欢这个工具，我的需求是跨平台使用，这个项目有帮助到我。',
      STARTER_TESTIMONIALS_ITEM_AVATAR: 'https://cdn.nakeu.cn/static/www.nakeu.cn/team-pic/2.JPG',
      STARTER_TESTIMONIALS_ITEM_NICKNAME: '听风',
      STARTER_TESTIMONIALS_ITEM_DESCRIPTION: '站长',
      STARTER_TESTIMONIALS_ITEM_URL: ''
    },
    {
      STARTER_TESTIMONIALS_ITEM_TEXT: '呜呜呜，经过一个下午的努力，终于把工具部署好啦，非常感谢NanKo的框架和教程，这是我有生之年用过的最好用的在线音乐播放器。',
      STARTER_TESTIMONIALS_ITEM_AVATAR: 'https://cdn.nakeu.cn/static/www.nakeu.cn/team-pic/3.JPG',
      STARTER_TESTIMONIALS_ITEM_NICKNAME: '难诉',
      STARTER_TESTIMONIALS_ITEM_DESCRIPTION: '站长',
      STARTER_TESTIMONIALS_ITEM_URL: ''
    },
    {
      STARTER_TESTIMONIALS_ITEM_TEXT: '感谢提供这么好的项目哈哈 之前一直不知道怎么部署(别的项目好难好复杂)这个相对非常简单 新手非常友好哦',
      STARTER_TESTIMONIALS_ITEM_AVATAR: 'https://cdn.nakeu.cn/static/www.nakeu.cn/team-pic/4.JPG',
      STARTER_TESTIMONIALS_ITEM_NICKNAME: '行止',
      STARTER_TESTIMONIALS_ITEM_DESCRIPTION: '站长',
      STARTER_TESTIMONIALS_ITEM_URL: ''
    },
    {
      STARTER_TESTIMONIALS_ITEM_TEXT: '非常感谢 NanKo 的项目，这一直是我期待的。',
      STARTER_TESTIMONIALS_ITEM_AVATAR: 'https://cdn.nakeu.cn/static/www.nakeu.cn/team-pic/5.JPG',
      STARTER_TESTIMONIALS_ITEM_NICKNAME: '旧冬',
      STARTER_TESTIMONIALS_ITEM_DESCRIPTION: '站长',
      STARTER_TESTIMONIALS_ITEM_URL: ''
    },
    {
      STARTER_TESTIMONIALS_ITEM_TEXT: '用好久了，太感谢了',
      STARTER_TESTIMONIALS_ITEM_AVATAR: 'https://cdn.nakeu.cn/static/www.nakeu.cn/team-pic/6.JPG',
      STARTER_TESTIMONIALS_ITEM_NICKNAME: '诀别',
      STARTER_TESTIMONIALS_ITEM_DESCRIPTION: '站长',
      STARTER_TESTIMONIALS_ITEM_URL: ''
    }
  ],

  //   FAQ 常见问题模块
  STARTER_FAQ_ENABLE: true, // 常见问题模块开关
  STARTER_FAQ_TITLE: '常见问题解答',
  STARTER_FAQ_TEXT_1: '有任何问题吗？请看这里',
  STARTER_FAQ_TEXT_2: '我们收集了常见的用户疑问',

  STARTER_FAQ_1_QUESTION: 'NanKo的项目有帮助文档吗？',
  STARTER_FAQ_1_ANSWER: '我们的项目绝大部分都有帮助文档。',

  STARTER_FAQ_2_QUESTION: '部署后要如何修改配置？',
  STARTER_FAQ_2_ANSWER: '请登录后台在环境变量中修改相应配置。',

  STARTER_FAQ_3_QUESTION: '站点部署失败，更新失败？',
  STARTER_FAQ_3_ANSWER: '通常是配置修改错误导致，请检查配置或者重试操作步骤，或者通过NanKo后台的Deployments中找到错误日志，并向客服发起工单',

  STARTER_FAQ_4_QUESTION: '登录状态没有实时同步？',
  STARTER_FAQ_4_ANSWER: '先检查 NanKo_System 状态是否正常，其次由于 NanKo项目 的每个页面都有独立缓存，刷新网页后即可解决',

  // 团队成员区块
  STARTER_TEAM_ENABLE: true, // 团队成员区块开关
  STARTER_TEAM_TITLE: '团队成员',
  STARTER_TEAM_TEXT_1: '我们的团队',
  STARTER_TEAM_TEXT_2: 'NanKoYo 有众多成员，感谢每一位贡献者',

  // 这里不支持CONFIG和环境变量，需要一一修改此处代码。
  STARTER_TEAM_ITEMS: [
    {
      STARTER_TEAM_ITEM_AVATAR: 'https://cdn.nakeu.cn/static/www.nakeu.cn/team-pic/7.JPG',
      STARTER_TEAM_ITEM_NICKNAME: 'NanKo',
      STARTER_TEAM_ITEM_DESCRIPTION: '主要创办人'
    },
    {
      STARTER_TEAM_ITEM_AVATAR: 'https://cdn.nakeu.cn/static/www.nakeu.cn/team-pic/8.JPG',
      STARTER_TEAM_ITEM_NICKNAME: 'Cute Baby',
      STARTER_TEAM_ITEM_DESCRIPTION: '南科售后负责人'
    },
    {
      STARTER_TEAM_ITEM_AVATAR: 'https://cdn.nakeu.cn/static/www.nakeu.cn/team-pic/9.PNG',
      STARTER_TEAM_ITEM_NICKNAME: 'Break feeling',
      STARTER_TEAM_ITEM_DESCRIPTION: '南科服务负责人'
    },
    {
      STARTER_TEAM_ITEM_AVATAR: 'https://cdn.nakeu.cn/static/www.nakeu.cn/team-pic/10.jpg',
      STARTER_TEAM_ITEM_NICKNAME: 'Tears',
      STARTER_TEAM_ITEM_DESCRIPTION: '南科技术负责人'
    },
    {
      STARTER_TEAM_ITEM_AVATAR: 'https://cdn.nakeu.cn/static/www.nakeu.cn/team-pic/11.png',
      STARTER_TEAM_ITEM_NICKNAME: 'Memorial.',
      STARTER_TEAM_ITEM_DESCRIPTION: '南科运维负责人'
    },
    {
      STARTER_TEAM_ITEM_AVATAR: 'https://cdn.nakeu.cn/static/www.nakeu.cn/team-pic/12.png',
      STARTER_TEAM_ITEM_NICKNAME: 'autism',
      STARTER_TEAM_ITEM_DESCRIPTION: '南科云开发负责人'
    },
    {
      STARTER_TEAM_ITEM_AVATAR: 'https://cdn.nakeu.cn/static/www.nakeu.cn/team-pic/13.png',
      STARTER_TEAM_ITEM_NICKNAME: 'liquor.',
      STARTER_TEAM_ITEM_DESCRIPTION: '南科数据库负责人'
    },
    {
      STARTER_TEAM_ITEM_AVATAR: 'https://cdn.nakeu.cn/static/www.nakeu.cn/team-pic/14.png',
      STARTER_TEAM_ITEM_NICKNAME: 'Decadence.',
      STARTER_TEAM_ITEM_DESCRIPTION: '南科接口负责人'
    },
    {
      STARTER_TEAM_ITEM_AVATAR: 'https://cdn.nakeu.cn/static/www.nakeu.cn/team-pic/15.png',
      STARTER_TEAM_ITEM_NICKNAME: 'lack of love',
      STARTER_TEAM_ITEM_DESCRIPTION: '南科内容负责人'
    },
    {
      STARTER_TEAM_ITEM_AVATAR: 'https://cdn.nakeu.cn/static/www.nakeu.cn/team-pic/16.png',
      STARTER_TEAM_ITEM_NICKNAME: 'Dream traveler',
      STARTER_TEAM_ITEM_DESCRIPTION: '南科设计负责人'
    },
    {
      STARTER_TEAM_ITEM_AVATAR: 'https://cdn.nakeu.cn/static/www.nakeu.cn/team-pic/17.png',
      STARTER_TEAM_ITEM_NICKNAME: 'stars.',
      STARTER_TEAM_ITEM_DESCRIPTION: '南科运营负责人'
    },
    {
      STARTER_TEAM_ITEM_AVATAR: 'https://cdn.nakeu.cn/static/www.nakeu.cn/team-pic/18.png',
      STARTER_TEAM_ITEM_NICKNAME: 'Run away',
      STARTER_TEAM_ITEM_DESCRIPTION: '南科前端负责人'
    },
    {
      STARTER_TEAM_ITEM_AVATAR: 'https://cdn.nakeu.cn/static/www.nakeu.cn/team-pic/19.png',
      STARTER_TEAM_ITEM_NICKNAME: 'Elaborate°',
      STARTER_TEAM_ITEM_DESCRIPTION: '南科后端负责人'
    },
    {
      STARTER_TEAM_ITEM_AVATAR: 'https://cdn.nakeu.cn/static/www.nakeu.cn/team-pic/20.png',
      STARTER_TEAM_ITEM_NICKNAME: 'Chilling heart',
      STARTER_TEAM_ITEM_DESCRIPTION:'南科CDN负责人'
    },
    {
      STARTER_TEAM_ITEM_AVATAR: 'https://cdn.nakeu.cn/static/www.nakeu.cn/team-pic/21.png',
      STARTER_TEAM_ITEM_NICKNAME: 'Midnight',
      STARTER_TEAM_ITEM_DESCRIPTION: '南科系统负责人'
    },
    {
      STARTER_TEAM_ITEM_AVATAR: 'https://cdn.nakeu.cn/static/www.nakeu.cn/team-pic/22.png',
      STARTER_TEAM_ITEM_NICKNAME: 'Trauma',
      STARTER_TEAM_ITEM_DESCRIPTION: '南科音乐负责人'
    }
    
  ],

  // 博客文章区块
  STARTER_BLOG_ENABLE: true, // 首页博文区块开关
  STARTER_BLOG_TITLE: '我们的博客',
  STARTER_BLOG_COUNT: 10, // 首页博文区块默认展示前3篇文章
  STARTER_BLOG_TEXT_1: '最近的新闻',
  STARTER_BLOG_TEXT_2: '这里会发布一些关于 NanKoYo 的最新动态，包括新的动向、新的未来计划，以及新功能的特性',

  // 联系模块
  STARTER_CONTACT_ENABLE: true, // 联系模块开关
  STARTER_CONTACT_TITLE: '联系我们',
  STARTER_CONTACT_TEXT: '告诉我们您遇到的问题',
  STARTER_CONTACT_LOCATION_TITLE: '我们的位置',
  STARTER_CONTACT_LOCATION_TEXT: '中国，天津',
  STARTER_CONTACT_EMAIL_TITLE: 'Email',
  STARTER_CONTACT_EMAIL_TEXT: 'nopely@nakeu.cn',

  // 嵌入外部表单
  STARTER_CONTACT_MSG_EXTERNAL_URL: 'https://noteforms.com/forms/feedback-yjrioz', // 基于NoteForm创建，将留言数据存在Notion中
  //   自定义留言表单，以下几个配置暂时废弃
  //   STARTER_CONTACT_MSG_TITLE: '向我们留言',
  //   STARTER_CONTACT_MSG_NAME: '姓名',
  //   STARTER_CONTACT_MSG_EMAIL: '邮箱地址',
  //   STARTER_CONTACT_MSG_PHONE: '联系电话',
  //   STARTER_CONTACT_MSG_TEXT: '消息内容',
  //   STARTER_CONTACT_MSG_SEND: '发送消息',
  //   STARTER_CONTACT_MSG_THANKS: '感谢您的留言',

  // 合作伙伴的图标
  STARTER_BRANDS_ENABLE: true, // 合作伙伴开关
  STARTER_BRANDS: [
    {
      IMAGE: '/images/starter/brands/graygrids.svg',
      IMAGE_WHITE: '/images/starter/brands/graygrids-white.svg',
      URL: 'https://graygrids.com/',
      TITLE: 'graygrids'
    },
    {
      IMAGE: '/images/starter/brands/lineicons.svg',
      IMAGE_WHITE: '/images/starter/brands/lineicons-white.svg',
      URL: 'https://lineicons.com/',
      TITLE: 'lineicons'
    },
    {
      IMAGE: '/images/starter/brands/uideck.svg',
      IMAGE_WHITE: '/images/starter/brands/uideck-white.svg',
      URL: 'https://uideck.com/',
      TITLE: 'uideck'
    },
    {
      IMAGE: '/images/starter/brands/ayroui.svg',
      IMAGE_WHITE: '/images/starter/brands/ayroui-white.svg',
      URL: 'https://ayroui.com/',
      TITLE: 'ayroui'
    },
    {
      IMAGE: '/images/starter/brands/tailgrids.svg',
      IMAGE_WHITE: '/images/starter/brands/tailgrids-white.svg',
      URL: '"https://tailgrids.com/',
      TITLE: 'tailgrids'
    }
  ],

  STARTER_FOOTER_SLOGAN: '南科网络成立于2023年，总部位于中国天津。公司一直秉承科技向善的宗旨。南科还提供云计算、广告、金融科技等一系列企业服务。',

  // 页脚三列菜单组
  STARTER_FOOTER_LINK_GROUP: [
    {
      TITLE: '关于我们',
      LINK_GROUP: [
        { TITLE: '官方主页', URL: '/#home' },
        { TITLE: '帮助支持', URL: '/Help_support' },
        { TITLE: '合作申请', URL: '/Cooperative_Application' }
      ]
    },
    {
      TITLE: '联系我们',
      LINK_GROUP: [
        { TITLE: '抖音', URL: 'https://www.douyin.com/user/MS4wLjABAAAA5k2jQdQ4rCvA5G85rLqVWIm2FrBuFU4JghRM-_xhGAg?enter_from=search_result&enter_method=search_result&extra_params=%7B%22search_params%22%3A%7B%22search_result_id%22%3A%22515038887289182%22%2C%22relation_tag%22%3A0%2C%22log_pb%22%3A%7B%22impr_id%22%3A%2220240412192923ECD82AC0CA33390B43D0%22%7D%2C%22search_type%22%3A%22user%22%2C%22impr_id%22%3A%2220240412192923ECD82AC0CA33390B43D0%22%2C%22search_id%22%3A%2220240412192923ECD82AC0CA33390B43D0%22%2C%22search_keyword%22%3A%22%20YLSF0304040%22%7D%7D' },
        { TITLE: 'bilibili', URL: 'https://b23.tv/QXkewsV' },
        { TITLE: 'Twitter', URL: 'https://twitter.com/NanKoYo' }
      ]
    },
    {
      TITLE: '友情链接',
      LINK_GROUP: [
        { TITLE: '南科开放接口', URL: 'https://open-api.nakeu.cn/' },
        { TITLE: '南科系统状态', URL: 'https://status.nakeu.cn/' },
        { TITLE: '南科机器认证', URL: 'https://robot.nakeu.cn/' },
        { TITLE: '南科Layui框架', URL: 'https://layui.nakeu.cn/' },
        { TITLE: '南科音乐解锁', URL: 'https://unlock.nakeu.cn/' },
        { TITLE: '南科在线博客', URL: 'https://blog.nakeu.cn/' },
        { TITLE: '南科在线工具', URL: 'https://tools.nakeu.cn/' },
        { TITLE: '南科在线音乐', URL: 'https://music.nakeu.cn/' },
        { TITLE: '南科在线热榜 ', URL: 'https://hot.nakeu.cn/' }
        
      ]
    }
  ],

  STARTER_FOOTER_BLOG_LATEST_TITLE: '最新文章',

  STARTER_FOOTER_PRIVACY_POLICY_TEXT: '隐私政策',
  STARTER_FOOTER_PRIVACY_POLICY_URL: '/privacy-policy',

  STARTER_FOOTER_PRIVACY_LEGAL_NOTICE_TEXT: '法律声明',
  STARTER_FOOTER_PRIVACY_LEGAL_NOTICE_URL: '/legacy-notice',

  STARTER_FOOTER_PRIVACY_TERMS_OF_SERVICE_TEXT: '服务协议',
  STARTER_FOOTER_PRIVACY_TERMS_OF_SERVICE_URL: '/terms-of-use',

  // 404页面的提示语
  STARTER_404_TITLE: '我们似乎找不到您要找的页面。',
  STARTER_404_TEXT: '抱歉！您要查找的页面不存在。可能已经移动或删除。',
  STARTER_404_BACK: '回到主页',

  STARTER_POST_REDIRECT_ENABLE: true, // 默認開啟重定向
  STARTER_POST_REDIRECT_URL: 'https://group.nakeu.cn', // 重定向域名
  STARTER_NEWSLETTER: process.env.NEXT_PUBLIC_THEME_STARTER_NEWSLETTER || true // 是否开启邮件订阅 请先配置mailchimp功能 https://docs.tangly1024.com/article/notion-next-mailchimp
}
export default CONFIG
