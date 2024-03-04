/**
 * 另一个落地页主题
 */
const CONFIG = {

  // 默认只展示Logo文字，如果设置了logo图片，会在文字左侧显示图标
  STARTER_LOGO: '', // 普通logo图片 示例：/images/starter/logo/logo.svg
  STARTER_LOGO_WHITE: '', // 透明底浅色logo 示例： /images/starter/logo/logo-white.svg

  // MENU ， 菜单部分不在此处配置，请在Notion数据库中添加MENU

  // 英雄区块导航
  STARTER_HERO_TITLE_1: 'Wata Home Appliances', // 英雄区文字
  STARTER_HERO_TITLE_2: 'Professional Supplier of Home Appliances', // 英雄区文字
  STARTER_HERO_TITLE_3: ' ', // 英雄区文字
  STARTER_HERO_PREVIEW_IMAGE: '/images/starter/hero/hero-image.webp', // 产品预览图 ，默认读取public目录下图片


  // 特性区块
  STARTER_FEATURE_TITLE: ' ', // 特性
  STARTER_FEATURE_TEXT_1: 'Wata Services', // 特性
  STARTER_FEATURE_TEXT_2: 'We deliver top-quality home appliances to enhance your everyday living, ensuring reliability, efficiency, and comfort in every purchase', // 特性

  STARTER_FEATURE_1_TITLE_1: 'Home Appliances', // 特性1
  STARTER_FEATURE_1_TEXT_1: '8 Years experiences and business relationship in Chinese home appliances industry', // 特性1
  STARTER_FEATURE_1_BUTTON_TEXT: 'More', // 特性1
  STARTER_FEATURE_1_BUTTON_URL: 'https://github.com/tangly1024/NotionNext', // 特性1

  STARTER_FEATURE_2_TITLE_1: 'Spare Parts', // 特性2
  STARTER_FEATURE_2_TEXT_1: 'All kind spare parts and tools for air conditioner and HVAC, and production lines for home appliances', // 特性2
  STARTER_FEATURE_2_BUTTON_TEXT: 'More', // 特性2
  STARTER_FEATURE_2_BUTTON_URL: 'https://docs.tangly1024.com/article/notion-next-themes', // 特性2

  STARTER_FEATURE_3_TITLE_1: 'Shipping Forwarder', // 特性3
  STARTER_FEATURE_3_TEXT_1: 'We have excellent support for shipping freight to global sea ports', // 特性3
  STARTER_FEATURE_3_BUTTON_TEXT: 'More', // 特性3
  STARTER_FEATURE_3_BUTTON_URL: 'https://docs.tangly1024.com/article/next-js', // 特性3

  STARTER_FEATURE_4_TITLE_1: 'Sourcing', // 特性4
  STARTER_FEATURE_4_TEXT_1: 'We also have sourcing services for customers, such as dictionary, consumer goods and so on', // 特性4
  STARTER_FEATURE_4_BUTTON_TEXT: 'More', // 特性4
  STARTER_FEATURE_4_BUTTON_URL: 'https://docs.tangly1024.com/about', // 特性4

  // 首页ABOUT区块
  STARTER_ABOUT_TITLE: 'sss',
  STARTER_ABOUT_TEXT: 'NotionNext的愿景是帮助非技术人员的小白，最低成本、最快速地搭建自己的网站，帮助您将自己的产品与故事高效地传达给世界。 <br /> <br /> 功能强大的Notion笔记，简单快速的Vercel托管平台，组成一个简单的网站',
  STARTER_ABOUT_BUTTON_TEXT: '了解更多',
  STARTER_ABOUT_BUTTON_URL: 'https://docs.tangly1024.com/about',
  STARTER_ABOUT_IMAGE_1: '/images/starter/about/about-image-01.jpg',
  STARTER_ABOUT_IMAGE_2: '/images/starter/about/about-image-02.jpg',
  STARTER_ABOUT_TIPS_1: '20+',
  STARTER_ABOUT_TIPS_2: 'Countries',
  STARTER_ABOUT_TIPS_3: 'Shipped',
  

  STARTER_TESTIMONIALS_TITLE: '',
  STARTER_TESTIMONIALS_TEXT_1: 'Clients Feedback',
  STARTER_TESTIMONIALS_TEXT_2: 'Help hundreds clients get competitive products from Wata',
  STARTER_TESTIMONIALS_STAR_ICON: '/images/starter/testimonials/icon-star.svg', // 评分图标

  // 这里不支持CONFIG和环境变量，需要一一修改此处代码。
  STARTER_TESTIMONIALS_ITEMS: [
    {
      STARTER_TESTIMONIALS_ITEM_TEXT: 'I am incredibly impressed with the exceptional customer service and the wide range of high-quality home appliances available on this website. It's my go-to destination for all my household needs! ',
     
      STARTER_TESTIMONIALS_ITEM_NICKNAME: 'Richard_G',
     
    },
    {
      STARTER_TESTIMONIALS_ITEM_TEXT: 'The user-friendly interface and seamless shopping experience make buying appliances online a breeze. Plus, the fast delivery exceeded my expectations. Highly recommended!',
      STARTER_TESTIMONIALS_ITEM_NICKNAME: 'Asenkits',
     
    },
    {
      STARTER_TESTIMONIALS_ITEM_TEXT: 'mpressed by the seamless shopping experience on this trading company's website. From browsing to checkout, everything was intuitive and efficient. Plus, their fast delivery made getting my new appliances a breeze. Will definitely be a returning customer',
      STARTER_TESTIMONIALS_ITEM_NICKNAME: 'DWIND',
    
    },
   
  ],




  // 博客文章区块
  STARTER_BLOG_TITLE: '',
  STARTER_BLOG_COUNT: 3, // 首页博文区块默认展示前3篇文章
  STARTER_BLOG_TEXT_1: 'Articles',
  STARTER_BLOG_TEXT_2: 'Here we will share some tips about the home appliances',

  // 联系模块
  STARTER_CONTACT_TITLE: 'Contact Us',
  STARTER_CONTACT_TEXT: 'How could we help you?',
  STARTER_CONTACT_LOCATION_TITLE: 'Our Bases',
  STARTER_CONTACT_LOCATION_TEXT: 'Ningbo, Guangzhou,HongKong',
  STARTER_CONTACT_EMAIL_TITLE: 'Email to us',
  STARTER_CONTACT_EMAIL_TEXT: 'info@watahome.com',

  // 嵌入外部表单
  STARTER_CONTACT_MSG_EXTERNAL_URL: 'https://noteforms.com/forms/yfctc7', // 基于NoteForm创建，将留言数据存在Notion中
  //   自定义留言表单
  //   STARTER_CONTACT_MSG_TITLE: 'Message us',
  //   STARTER_CONTACT_MSG_NAME: 'Name',
  //   STARTER_CONTACT_MSG_EMAIL: 'Email',
  //   STARTER_CONTACT_MSG_PHONE: 'Contact',
  //   STARTER_CONTACT_MSG_TEXT: 'Content',
  //   STARTER_CONTACT_MSG_SEND: 'Send',
  //   STARTER_CONTACT_MSG_THANKS: 'Thank you',

  

  STARTER_FOOTER_SLOGAN: 'Striving to provide the most suitable home appliances to our clients',

  // 页脚三列菜单组
  STARTER_FOOTER_LINK_GROUP: [
   
 
    {
      TITLE: 'Services',
      LINK_GROUP: [
        { TITLE: 'Home Appliances', URL: 'https://docs.tangly1024.com/article/vercel-deploy-notion-next' },
        { TITLE: 'Spare Parts', URL: 'https://docs.tangly1024.com/article/how-to-update-notionnext' },
        { TITLE: 'Shipping Forwarder', URL: 'https://docs.tangly1024.com/article/latest' }
        { TITLE: 'Sourcing', URL: 'https://docs.tangly1024.com/article/latest' }
      ]
    },
    {
      TITLE: 'Notion写作',
      LINK_GROUP: [
        { TITLE: 'About US', URL: 'https://docs.tangly1024.com/about' },
        
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
  STARTER_404_TITLE: 'Error 404。',
  STARTER_404_TEXT: 'Sorry! The page you are looking for doesn't exist. It may have been moved or deleted.',
  STARTER_404_BACK: 'Return to home page',

  STARTER_POST_REDIRECT_ENABLE: true, // 默認開啟重定向
  STARTER_POST_REDIRECT_URL: 'https://www.watahome.com', // 重定向域名
  STARTER_NEWSLETTER: process.env.NEXT_PUBLIC_THEME_STARTER_NEWSLETTER || false // 是否开启邮件订阅 请先配置mailchimp功能 https://docs.tangly1024.com/article/notion-next-mailchimp
}
export default CONFIG
