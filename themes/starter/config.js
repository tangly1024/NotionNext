/**
 * 另一个落地页主题
 */
const CONFIG = {
  // 默认只展示Logo文字，如果设置了logo图片，会在文字左侧显示图标
  STARTER_LOGO: '/images/starter/logo/logo.svg', // 普通logo图片 示例：/images/starter/logo/logo.svg
  STARTER_LOGO_WHITE: '/images/starter/logo/logo.svg', // 透明底浅色logo 示例： /images/starter/logo/logo-white.svg

  // MENU ， 菜单部分不在此处配置，请在Notion数据库中添加MENU

  // 英雄区块导航
  STARTER_HERO_ENABLE: true, // 开启英雄区
  STARTER_HERO_TITLE_1: 'ChinAfrica', // 英雄区文字
  STARTER_HERO_TITLE_2: '-express- Trading And Logistics Company', // 英雄区文字
  STARTER_HERO_TITLE_3: 'Assist with product acquisition, Quality Control and Shipping between China and Africa.', // 英雄区文字
  // 英雄区两个按钮，如果TEXT留空则隐藏按钮
  STARTER_HERO_BUTTON_1_TEXT: '', // 英雄区按钮
  STARTER_HERO_BUTTON_1_URL:
    'https://www.chin-a-frica.store/article/example-2', // 英雄区按钮
  STARTER_HERO_BUTTON_2_TEXT: '', // 英雄区按钮
  STARTER_HERO_BUTTON_2_URL: 'https://www.facebook.com/profile.php?id=61568479663391&mibextid=LQQJ4d', // 英雄区按钮
  STARTER_HERO_BUTTON_2_ICON: '', // 英雄区按钮2的图标，不需要则留空

  // 英雄区配图，如需隐藏，改为空值即可 ''
  STARTER_HERO_PREVIEW_IMAGE: '/images/starter/hero/hero-image.webp', // 产品预览图 ，默认读取public目录下图片
  STARTER_HERO_BANNER_IMAGE: '', // hero区下方的全宽图

  // 顶部右侧导航暗流
  STARTER_NAV_BUTTON_1_TEXT: '',
  STARTER_NAV_BUTTON_1_URL: '',

  STARTER_NAV_BUTTON_2_TEXT: '',
  STARTER_NAV_BUTTON_2_URL: '',

  // 特性区块
  STARTER_FEATURE_ENABLE: false, // 特性区块开关
  STARTER_FEATURE_TITLE: '特性', // 特性
  STARTER_FEATURE_TEXT_1: 'NotionNext的主要特性', // 特性
  STARTER_FEATURE_TEXT_2:
    'NotionNext的愿景是帮助您简单、无感知地稳定地搭建自己的网站，放大品牌的价值。 ', // 特性

  STARTER_FEATURE_1_TITLE_1: '免费且开源', // 特性1
  STARTER_FEATURE_1_TEXT_1: '项目源码在Github上完全开放共享，遵循MIT协议', // 特性1
  STARTER_FEATURE_1_BUTTON_TEXT: '了解更多', // 特性1
  STARTER_FEATURE_1_BUTTON_URL: 'https://github.com/tangly1024/NotionNext', // 特性1

  STARTER_FEATURE_2_TITLE_1: '多种主题定制', // 特性2
  STARTER_FEATURE_2_TEXT_1: '数十种主题,适用于不同场景，总有一款适合你', // 特性2
  STARTER_FEATURE_2_BUTTON_TEXT: '了解更多', // 特性2
  STARTER_FEATURE_2_BUTTON_URL:
    'https://docs.tangly1024.com/article/notion-next-themes', // 特性2

  STARTER_FEATURE_3_TITLE_1: '优秀的性能', // 特性3
  STARTER_FEATURE_3_TEXT_1: '基于NextJS开发，更快的响应速度，更好的SEO', // 特性3
  STARTER_FEATURE_3_BUTTON_TEXT: '了解更多', // 特性3
  STARTER_FEATURE_3_BUTTON_URL: 'https://docs.tangly1024.com/article/next-js', // 特性3

  STARTER_FEATURE_4_TITLE_1: '便捷的写作体验', // 特性4
  STARTER_FEATURE_4_TEXT_1: '只需在Notion笔记中编修，自动同步到网站', // 特性4
  STARTER_FEATURE_4_BUTTON_TEXT: '了解更多', // 特性4
  STARTER_FEATURE_4_BUTTON_URL: 'https://docs.tangly1024.com/about', // 特性4

  // 首页ABOUT区块
  STARTER_ABOUT_ENABLE: true, // ABOUT区块开关
  STARTER_ABOUT_TITLE: 'The most suitable logistics company for you!',
  STARTER_ABOUT_TEXT:
    'Assist you in procurement, transportation, customs clearance, tax payment, and arranging domestic transportation... <br /> <br /> With our help, international transportation is as convenient as express delivery!',
  STARTER_ABOUT_BUTTON_TEXT: 'Learn more',
  STARTER_ABOUT_BUTTON_URL: 'https://docs.tangly1024.com/about',
  STARTER_ABOUT_IMAGE_1: '/images/starter/about/about-image-01.jpg',
  STARTER_ABOUT_IMAGE_2: '/images/starter/about/about-image-02.jpg',
  STARTER_ABOUT_TIPS_1: '600+',
  STARTER_ABOUT_TIPS_2: 'Transportation company',
  STARTER_ABOUT_TIPS_3: 'Are currently collaborating with us',

  // 首页价格区块
  STARTER_PRICING_ENABLE: true, // 价格区块开关
  STARTER_PRICING_TITLE: 'Price list',
  STARTER_PRICING_TEXT_1: 'Company agent price',
  STARTER_PRICING_TEXT_2:
    'The following prices are based on shipping from China to South Africa as an example.',

  STARTER_PRICING_1_TITLE: 'Air transport',
  STARTER_PRICING_1_PRICE: '12.66',
  STARTER_PRICING_1_PRICE_CURRENCY: '＄',
  STARTER_PRICING_1_PRICE_PERIOD: '/kg',
  STARTER_PRICING_1_HEADER: '15~30 Days',
  STARTER_PRICING_1_FEATURES: 'Protective,Full tracking,High speed', // 英文逗号隔开
  STARTER_PRICING_1_BUTTON_TEXT: 'Ask now',
  STARTER_PRICING_1_BUTTON_URL:
    'https://tangly1024.lemonsqueezy.com/checkout/buy/c1a38a65-362e-44c5-8065-733fee39eb54',

  STARTER_PRICING_2_TAG: 'Recommend',
  STARTER_PRICING_2_TITLE: 'Sea shipping',
  STARTER_PRICING_2_PRICE: '4.99',
  STARTER_PRICING_2_PRICE_CURRENCY: '$',
  STARTER_PRICING_2_PRICE_PERIOD: '/kg',
  STARTER_PRICING_2_HEADER: '60~90 Days',
  STARTER_PRICING_2_FEATURES: 'Cheap,fewer restrictions,Large cargo volume,Not affected by weather', // 英文逗号隔开
  STARTER_PRICING_2_BUTTON_TEXT: 'Inquiry now',
  STARTER_PRICING_2_BUTTON_URL:
    'https://tangly1024.lemonsqueezy.com/checkout/buy/590ad70a-c3b7-4caf-94ec-9ca27bde06d4',

  STARTER_PRICING_3_TITLE: 'Customized',
  STARTER_PRICING_3_PRICE: '？',
  STARTER_PRICING_3_PRICE_CURRENCY: '',
  STARTER_PRICING_3_PRICE_PERIOD: '/kg',
  STARTER_PRICING_3_HEADER: '',
  STARTER_PRICING_3_FEATURES: 'Trucking,Luggage bag,Express delivery,...', // 英文逗号隔开
  STARTER_PRICING_3_BUTTON_TEXT: 'Free quote',
  STARTER_PRICING_3_BUTTON_URL:
    'https://tangly1024.lemonsqueezy.com/checkout/buy/df924d66-09dc-42a4-a632-a6b0c5cc4f28',

  // 首页用户测评区块
  STARTER_TESTIMONIALS_ENABLE: true, // 测评区块开关
  STARTER_TESTIMONIALS_TITLE: 'Customer feedback',
  STARTER_TESTIMONIALS_TEXT_1: 'What customers say',
  STARTER_TESTIMONIALS_TEXT_2:
    'Hundreds of customers choose to use Chinafrica to transport their goods, we help them complete luggage transportation, company procurement, bulk purchase...',
  STARTER_TESTIMONIALS_STAR_ICON: '/images/starter/testimonials/icon-star.svg', // 评分图标

  // 这里不支持CONFIG和环境变量，需要一一修改此处代码。
  STARTER_TESTIMONIALS_ITEMS: [
    {
      STARTER_TESTIMONIALS_ITEM_TEXT:
        'As a business owner in SA, finding a reliable freight forwarder is crucial. Chinafrica has been a game-changer for us！ ',
      STARTER_TESTIMONIALS_ITEM_AVATAR:
        'https://github.com/KaterinaJiang/1/blob/main/1.png?raw=true',
      STARTER_TESTIMONIALS_ITEM_NICKNAME: 'Thandiwe',
      STARTER_TESTIMONIALS_ITEM_DESCRIPTION: 'South Africa',
      STARTER_TESTIMONIALS_ITEM_URL: ''
    },
    {
      STARTER_TESTIMONIALS_ITEM_TEXT:
        'Chinafrica has made international shipping a breeze for us. Their team is knowledgeable, and they handle all the details, making the process stress-free.',
      STARTER_TESTIMONIALS_ITEM_AVATAR:
        'https://github.com/KaterinaJiang/-/blob/main/22.png?raw=true',
      STARTER_TESTIMONIALS_ITEM_NICKNAME: 'Wassana',
      STARTER_TESTIMONIALS_ITEM_DESCRIPTION: 'Thailand',
      STARTER_TESTIMONIALS_ITEM_URL: ''
    },
    {
      STARTER_TESTIMONIALS_ITEM_TEXT:
        'Chinafrica has been an invaluable partner for our company. Their expertise in international shipping has saved us time and money.',
      STARTER_TESTIMONIALS_ITEM_AVATAR:
        'https://github.com/KaterinaJiang/-/blob/main/3.png?raw=true',
      STARTER_TESTIMONIALS_ITEM_NICKNAME: 'Oliver',
      STARTER_TESTIMONIALS_ITEM_DESCRIPTION: 'UK',
      STARTER_TESTIMONIALS_ITEM_URL: ''
    },
    {
      STARTER_TESTIMONIALS_ITEM_TEXT:
        'They are always on time, and their customer support is excellent. It is reassuring to know that my shipments are always in good hands.',
      STARTER_TESTIMONIALS_ITEM_AVATAR:
        'https://github.com/KaterinaJiang/-/blob/main/4.png?raw=true',
      STARTER_TESTIMONIALS_ITEM_NICKNAME: 'Johnson ',
      STARTER_TESTIMONIALS_ITEM_DESCRIPTION: 'USA',
      STARTER_TESTIMONIALS_ITEM_URL: ''
    },
    {
      STARTER_TESTIMONIALS_ITEM_TEXT:
        'I highly recommend them to anyone in need of a reliable freight forwarding service！',
      STARTER_TESTIMONIALS_ITEM_AVATAR:
        'https://github.com/KaterinaJiang/-/blob/main/5.png?raw=true',
      STARTER_TESTIMONIALS_ITEM_NICKNAME: 'Lerato',
      STARTER_TESTIMONIALS_ITEM_DESCRIPTION: 'South Africa',
      STARTER_TESTIMONIALS_ITEM_URL: ''
    },
    {
      STARTER_TESTIMONIALS_ITEM_TEXT: 'They are efficient, reliable, and their prices are very fair.',
      STARTER_TESTIMONIALS_ITEM_AVATAR:
        'https://github.com/KaterinaJiang/-/blob/main/6.png?raw=true',
      STARTER_TESTIMONIALS_ITEM_NICKNAME: 'Doe',
      STARTER_TESTIMONIALS_ITEM_DESCRIPTION: 'USA',
      STARTER_TESTIMONIALS_ITEM_URL: ''
    }
  ],

  //   FAQ 常见问题模块
  STARTER_FAQ_ENABLE: true, // 常见问题模块开关
  STARTER_FAQ_TITLE: 'FAQ',
  STARTER_FAQ_TEXT_1: 'Have any questions?',
  STARTER_FAQ_TEXT_2: 'We have collected some frequently asked questions from users.',

  STARTER_FAQ_1_QUESTION: 'Can I ship cellphones？',
  STARTER_FAQ_1_ANSWER:
    'We provide cellphone shipping service, but it can only be delivered by Express, and there is no compensation if it is lost, so we do not recommend that you ship your phone.',

  STARTER_FAQ_2_QUESTION: 'Can I send brand good？',
  STARTER_FAQ_2_ANSWER:
    'Generally speaking, branded products can only be transported by sea (branded products do not include luxury goods and well-known brands, such as Nike and Adidas)',

  STARTER_FAQ_3_QUESTION: 'What are your charges？',
  STARTER_FAQ_3_ANSWER:
    'Our fees consist of two parts: shipping and service fees (service fees include customs clearance fees and courier fees within the destination country)',

  STARTER_FAQ_4_QUESTION: 'Why does shipping take so long？',
  STARTER_FAQ_4_ANSWER:
    'Due to the long distance of international shipping, there are often some uncontrollable conditions (such as weather factors, customs clearance inspection factors, etc.). In this case, your package may be slightly delayed in arriving at your side.',

  // 团队成员区块
  STARTER_TEAM_ENABLE: true, // 团队成员区块开关
  STARTER_TEAM_TITLE: 'Main shipping destinations',
  STARTER_TEAM_TEXT_1: 'Our destinations',
  STARTER_TEAM_TEXT_2:
    'We mainly transport goods from China to these regions. <br /> Other countries please contact our customer support.',

  // 这里不支持CONFIG和环境变量，需要一一修改此处代码。
  STARTER_TEAM_ITEMS: [
    {
      STARTER_TEAM_ITEM_AVATAR:
        '/images/starter/team/team-04.png',
      STARTER_TEAM_ITEM_NICKNAME: 'Africa',
      STARTER_TEAM_ITEM_DESCRIPTION: 'South Africa, Zimbabwe...'
    },
    {
      STARTER_TEAM_ITEM_AVATAR: '/images/starter/team/team-01.png',
      STARTER_TEAM_ITEM_NICKNAME: 'Asia',
      STARTER_TEAM_ITEM_DESCRIPTION: 'Thailand, Malaysia...'
    },
    {
      STARTER_TEAM_ITEM_AVATAR: '/images/starter/team/team-02.png',
      STARTER_TEAM_ITEM_NICKNAME: 'Europe',
      STARTER_TEAM_ITEM_DESCRIPTION: 'UK, France...'
    },
    {
      STARTER_TEAM_ITEM_AVATAR: '/images/starter/team/team-03.png',
      STARTER_TEAM_ITEM_NICKNAME: 'America and others',
      STARTER_TEAM_ITEM_DESCRIPTION: 'Ask us for details'
    }
  ],

  // 博客文章区块
  STARTER_BLOG_ENABLE: true, // 首页博文区块开关
  STARTER_BLOG_TITLE: 'Our blog',
  STARTER_BLOG_COUNT: 3, // 首页博文区块默认展示前3篇文章
  STARTER_BLOG_TEXT_1: 'Recent announcements',
  STARTER_BLOG_TEXT_2:
    'Here we will publish the latest news about Chinafrica, including the situation of international logistics, price changes, new suppliers, etc.',

  // 联系模块
  STARTER_CONTACT_ENABLE: true, // 联系模块开关
  STARTER_CONTACT_TITLE: 'Contact us',
  STARTER_CONTACT_TEXT: 'Tell us the problem you encountered',
  STARTER_CONTACT_LOCATION_TITLE: 'Our location',
  STARTER_CONTACT_LOCATION_TEXT: 'Hangzhou, China',
  STARTER_CONTACT_EMAIL_TITLE: 'How can we assist you？',
  STARTER_CONTACT_EMAIL_TEXT: 'chinafrica520@hotmail.com',

  // 嵌入外部表单
  STARTER_CONTACT_MSG_EXTERNAL_URL: 'https://noteforms.com/forms/chinafrica-yzlkgb', // 基于NoteForm创建，将留言数据存在Notion中
  //   自定义留言表单，以下几个配置暂时废弃
  //   STARTER_CONTACT_MSG_TITLE: '向我们留言',
  //   STARTER_CONTACT_MSG_NAME: '姓名',
  //   STARTER_CONTACT_MSG_EMAIL: '邮箱地址',
  //   STARTER_CONTACT_MSG_PHONE: '联系电话',
  //   STARTER_CONTACT_MSG_TEXT: '消息内容',
  //   STARTER_CONTACT_MSG_SEND: '发送消息',
  //   STARTER_CONTACT_MSG_THANKS: '感谢您的留言',

  // 合作伙伴的图标
  STARTER_BRANDS_ENABLE: false, // 合作伙伴开关
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

  STARTER_FOOTER_SLOGAN: 'Make the best choice for you.',

  // 页脚三列菜单组
  STARTER_FOOTER_LINK_GROUP: [
    {
      TITLE: 'About us ',
      LINK_GROUP: [
        { TITLE: 'Home', URL: '/#home' },
        { TITLE: 'Our story', URL: 'https://www.chin-a-frica.store/article/example-1' },
        {
          TITLE: 'What we do',
          URL: 'https://www.chin-a-frica.store/article/example-2'
        },
        {
          TITLE: 'Contact us',
          URL: 'https://www.chin-a-frica.store/article/example-3'
        }
      ]
    },
    {
      TITLE: 'About the service',
      LINK_GROUP: [
        {
          TITLE: 'Our rates',
          URL: 'https://www.chin-a-frica.store/article/example-4'
        },
        {
          TITLE: 'Areas we ship',
          URL: 'https://www.chin-a-frica.store/article/example-5'
        },
        { TITLE: 'Products we ship', URL: 'https://www.chin-a-frica.store/article/example-6' }
      ]
    },
    {
      TITLE: 'Cooperate',
      LINK_GROUP: [
        {
          TITLE: 'For Chinese merchants',
          URL: 'https://www.chin-a-frica.store/article/example-7'
        },
        {
          TITLE: 'For logistics companies',
          URL: 'https://www.chin-a-frica.store/article/example-8'
        },
        {
          TITLE: 'For corporate customers',
          URL: 'https://www.chin-a-frica.store/article/example-9'
        }
      ]
    }
  ],

  STARTER_FOOTER_BLOG_LATEST_TITLE: 'Latest Announcement',

  STARTER_FOOTER_PRIVACY_POLICY_TEXT: 'Privacy policy',
  STARTER_FOOTER_PRIVACY_POLICY_URL: '/privacy-policy',

  STARTER_FOOTER_PRIVACY_LEGAL_NOTICE_TEXT: 'Legal Notice',
  STARTER_FOOTER_PRIVACY_LEGAL_NOTICE_URL: '/legacy-notice',

  STARTER_FOOTER_PRIVACY_TERMS_OF_SERVICE_TEXT: 'Service Agreement',
  STARTER_FOOTER_PRIVACY_TERMS_OF_SERVICE_URL: '/terms-of-use',

  // 404页面的提示语
  STARTER_404_TITLE: 'We can not find the page you are looking for',
  STARTER_404_TEXT: 'Sorry！The page you are looking for does not exist. It may have been moved or deleted.',
  STARTER_404_BACK: 'Back to Home',

  // 页面底部的行动呼吁模块
  STARTER_CTA_ENABLE: false,
  STARTER_CTA_TITLE: '你还在等待什么呢？',
  STARTER_CTA_TITLE_2: '现在开始吧',
  STARTER_CTA_DESCRIOTN:
    '访问NotionNext的操作文档，我们提供了详细的教程，帮助你即刻搭建站点',
  STARTER_CTA_BUTTON: true, // 是否显示按钮
  STARTER_CTA_BUTTON_URL:
    'https://docs.tangly1024.com/article/vercel-deploy-notion-next',
  STARTER_CTA_BUTTON_TEXT: '开始体验',

  STARTER_POST_REDIRECT_ENABLE: true, // 默認開啟重定向
  STARTER_POST_REDIRECT_URL: 'https://blog.tangly1024.com', // 重定向域名
  STARTER_NEWSLETTER: process.env.NEXT_PUBLIC_THEME_STARTER_NEWSLETTER || false // 是否开启邮件订阅 请先配置mailchimp功能 https://docs.tangly1024.com/article/notion-next-mailchimp
}
export default CONFIG
