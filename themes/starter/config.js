/**
 * 另一个落地页主题
 */
const CONFIG = {
  // 默认只展示Logo文字，如果设置了logo图片，会在文字左侧显示图标
  STARTER_LOGO: '', // 普通logo图片 示例：/images/starter/logo/logo.svg
  STARTER_LOGO_WHITE: '', // 透明底浅色logo 示例： /images/starter/logo/logo-white.svg

  // MENU ， 菜单部分不在此处配置，请在Notion数据库中添加MENU

  // 英雄区块导航
  STARTER_HERO_ENABLE: true, // 开启英雄区
  STARTER_HERO_TITLE_1: 'Video translation made easy.', // 英雄区文字
  STARTER_HERO_TITLE_2: 'Upload your video or provide a URL and get subtitles in multiple languages with a single click. The platform supports over multiple languages and dialects.', // 英雄区文字
  // 英雄区两个按钮，如果TEXT留空则隐藏按钮

  STARTER_HERO_BUTTON_1_TEXT: 'Get Started', // 英雄区按钮
  STARTER_HERO_BUTTON_1_URL: 'https://.cc/transcriptionTasks', // 英雄区按钮
  STARTER_HERO_BUTTON_2_TEXT: 'Follow Us', // 英雄区按钮
  STARTER_HERO_BUTTON_2_URL: 'https://belliedmonkey.cc', // 英雄区按钮
  STARTER_HERO_BUTTON_2_ICON: '', // 英雄区按钮2的图标，不需要则留空


  STARTER_HERO_PREVIEW_IMAGE: '/images/starter/hero/hero-image.webp', // 产品预览图 ，默认读取public目录下图片

  // 顶部右侧导航暗流
  STARTER_NAV_BUTTON_1_TEXT: 'Sign In',
  STARTER_NAV_BUTTON_1_URL: 'https://dash.aragorn.cc/login',

  STARTER_NAV_BUTTON_2_TEXT: 'Get Started',
  STARTER_NAV_BUTTON_2_URL: 'https://dash.aragorn.cc/transcriptionTasks',

  // 特性区块
  STARTER_FEATURE_ENABLE: true, // 特性区块开关

  STARTER_FEATURE_TITLE: 'feature', // 特性
  STARTER_FEATURE_TEXT_1: 'main features', // 特性
  STARTER_FEATURE_TEXT_2: 'Upload your video or provide a URL and get subtitles in multiple languages with a single click. The platform supports over multiple languages and dialects.', // 特性

  STARTER_FEATURE_1_TITLE_1: 'Video Subtitle Generation', // 特性1
  STARTER_FEATURE_1_TEXT_1: 'Automatically generate subtitles for your video content.  ', // 特性1
  STARTER_FEATURE_1_BUTTON_TEXT: '', // 特性1
  STARTER_FEATURE_1_BUTTON_URL: '', // 特性1

  STARTER_FEATURE_2_TITLE_2: 'Subtitle Translation', // 特性2
  STARTER_FEATURE_2_TEXT_2: 'Translate your subtitles into multiple languages.', // 特性2
  STARTER_FEATURE_2_BUTTON_TEXT: '', // 特性2
  STARTER_FEATURE_2_BUTTON_URL: '', // 特性2

  STARTER_FEATURE_3_TITLE_3: 'Hardcoded Subtitle Video Export', // 特性3
  STARTER_FEATURE_3_TEXT_3: 'Export your video with hardcoded subtitles.', // 特性3
  STARTER_FEATURE_3_BUTTON_TEXT: '', // 特性3
  STARTER_FEATURE_3_BUTTON_URL: '', // 特性3

  STARTER_FEATURE_4_TITLE_4: 'Subtitle editing', // 特性4
  STARTER_FEATURE_4_TEXT_4: 'Edit, merge, and split your multilingual subtitles. ', // 特性4
  STARTER_FEATURE_4_BUTTON_TEXT: '', // 特性4
  STARTER_FEATURE_4_BUTTON_URL: '', // 特性4

  // 首页ABOUT区块
  STARTER_ABOUT_ENABLE: true, // ABOUT区块开关
  STARTER_ABOUT_TITLE: '一套轻量实用的建站解决方案',
  STARTER_ABOUT_TEXT:
    'NotionNext的愿景是帮助非技术人员的小白，最低成本、最快速地搭建自己的网站，帮助您将自己的产品与故事高效地传达给世界。 <br /> <br /> 功能强大的Notion笔记，简单快速的Vercel托管平台，组成一个简单的网站',
  STARTER_ABOUT_1_TITLE_1:'How it works',
  STARTER_ABOUT_1_TEXT_1:'See the platform in action. Watch the video to learn how to upload your content and generate subtitles in multiple languages.',
  STARTER_ABOUT_1_BUTTON_1_TEXT:'Get Started',
  STARTER_ABOUT_BUTTON_TEXT: '了解更多',
  STARTER_ABOUT_BUTTON_URL: 'https://docs.tangly1024.com/about',
  STARTER_ABOUT_IMAGE_1: '/images/starter/about/about-image-01.jpg',
  STARTER_ABOUT_IMAGE_2: '/images/starter/about/about-image-02.jpg',
  STARTER_ABOUT_TIPS_1: '7000+',
  STARTER_ABOUT_TIPS_2: '博客站点',
  STARTER_ABOUT_TIPS_3: '正在线上运行',

  // 首页价格区块
  STARTER_PRICING_ENABLE: false, // 价格区块开关
  STARTER_PRICING_TITLE: '价格表',
  STARTER_PRICING_TEXT_1: '很棒的定价计划',
  STARTER_PRICING_TEXT_2:
    '我们制定了灵活的付费模式，您可以按需选择。（NotionNext免费开源，这里仅演示产品订阅付费功能，请勿下单购买！）',

  STARTER_PRICING_1_TITLE: '入门版',
  STARTER_PRICING_1_PRICE: '19.9',
  STARTER_PRICING_1_PRICE_CURRENCY: '$',
  STARTER_PRICING_1_PRICE_PERIOD: '每月',
  STARTER_PRICING_1_HEADER: '功能点',
  STARTER_PRICING_1_FEATURES: '所有的主题,免费更新,帮助手册', // 英文逗号隔开
  STARTER_PRICING_1_BUTTON_TEXT: '立即购买',
  STARTER_PRICING_1_BUTTON_URL:
    'https://tangly1024.lemonsqueezy.com/checkout/buy/c1a38a65-362e-44c5-8065-733fee39eb54',

  STARTER_PRICING_2_TAG: '推荐',
  STARTER_PRICING_2_TITLE: '基础版',
  STARTER_PRICING_2_PRICE: '39.9',
  STARTER_PRICING_2_PRICE_CURRENCY: '$',
  STARTER_PRICING_2_PRICE_PERIOD: '每月',
  STARTER_PRICING_2_HEADER: '功能点',
  STARTER_PRICING_2_FEATURES: '包含入门版,项目源码,内部社群,技术咨询,SEO优化', // 英文逗号隔开
  STARTER_PRICING_2_BUTTON_TEXT: '立即购买',
  STARTER_PRICING_2_BUTTON_URL:
    'https://tangly1024.lemonsqueezy.com/checkout/buy/590ad70a-c3b7-4caf-94ec-9ca27bde06d4',

  STARTER_PRICING_3_TITLE: '高级版',
  STARTER_PRICING_3_PRICE: '59.9',
  STARTER_PRICING_3_PRICE_CURRENCY: '$',
  STARTER_PRICING_3_PRICE_PERIOD: '每月',
  STARTER_PRICING_3_HEADER: '功能点',
  STARTER_PRICING_3_FEATURES: '包含基础版,功能定制开发', // 英文逗号隔开
  STARTER_PRICING_3_BUTTON_TEXT: '立即购买',
  STARTER_PRICING_3_BUTTON_URL:
    'https://tangly1024.lemonsqueezy.com/checkout/buy/df924d66-09dc-42a4-a632-a6b0c5cc4f28',

  // 首页用户测评区块
  STARTER_TESTIMONIALS_ENABLE: false, // 测评区块开关
  STARTER_TESTIMONIALS_TITLE: '用户反馈',
  STARTER_TESTIMONIALS_TEXT_1: '我们的用户怎么说',
  STARTER_TESTIMONIALS_TEXT_2:
    '数千位站长选择用NotionNext搭建他们的网站,通过帮助手册、交流社群以及技术咨询，大家成功上线了自己的网站',
  STARTER_TESTIMONIALS_STAR_ICON: '/images/starter/testimonials/icon-star.svg', // 评分图标

  // 这里不支持CONFIG和环境变量，需要一一修改此处代码。
  STARTER_TESTIMONIALS_ITEMS: [
    {
      STARTER_TESTIMONIALS_ITEM_TEXT:
        '感谢大佬的方法。之前尝试过Super、Potion等国外的第三方平台，实现效果一般，个性化程度远不如这个方法，已经用起来了！ ',
      STARTER_TESTIMONIALS_ITEM_AVATAR:
        'https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F22de3fcb-d90d-4271-bc01-f815f476122b%2F4FE0A0C0-E487-4C74-BF8E-6F01A27461B8-14186-000008094BC289A6.jpg?table=collection&id=a320a2cc-6ebe-4a8d-95cc-ea94e63bced9&width=200',
      STARTER_TESTIMONIALS_ITEM_NICKNAME: 'Ryan_G',
      STARTER_TESTIMONIALS_ITEM_DESCRIPTION: 'Ryan`Log 站长',
      STARTER_TESTIMONIALS_ITEM_URL: 'https://blog.gaoran.xyz/'
    },
    {
      STARTER_TESTIMONIALS_ITEM_TEXT:
        '很喜欢这个主题，本代码小白用三天台风假期搭建出来了，还根据大佬的教程弄了自定义域名，十分感谢，已请喝咖啡~',
      STARTER_TESTIMONIALS_ITEM_AVATAR:
        'https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F0d33d169-f932-41ff-ac6b-88a923c08e02%2F%25E5%25A4%25B4%25E5%2583%258F.jfif?table=collection&id=7787658d-d5c0-4f34-8e32-60c523dfaba3&width=400',
      STARTER_TESTIMONIALS_ITEM_NICKNAME: 'Asenkits',
      STARTER_TESTIMONIALS_ITEM_DESCRIPTION: '阿森的百宝袋 站长',
      STARTER_TESTIMONIALS_ITEM_URL: 'https://asenkits.top/'
    },
    {
      STARTER_TESTIMONIALS_ITEM_TEXT:
        '呜呜呜，经过一个下午的努力，终于把博客部署好啦，非常感谢Tangly1024大佬的框架和教程，这是我有生之年用过的最好用的博客框架┭┮﹏┭┮。从今之后，我就可以在自己的博客里bb啦，( •̀ ω •́ )y ',
      STARTER_TESTIMONIALS_ITEM_AVATAR:
        'https://www.notion.so/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F6c096b44-beb9-48ee-8f92-1efdde47f3a3%2F338962f1-d352-49c7-9a1b-746e35a7005c%2Fhf.png?table=block&id=ce5a48a9-d77a-4843-a3d9-a78cd4f794ce&spaceId=6c096b44-beb9-48ee-8f92-1efdde47f3a3&width=100&userId=27074aef-7216-41ed-baef-d9b53addd870&cache=v2',
      STARTER_TESTIMONIALS_ITEM_NICKNAME: 'DWIND',
      STARTER_TESTIMONIALS_ITEM_DESCRIPTION: '且听风吟 站长',
      STARTER_TESTIMONIALS_ITEM_URL: 'https://www.dwind.top/'
    },
    {
      STARTER_TESTIMONIALS_ITEM_TEXT:
        '感谢提供这么好的项目哈哈 之前一直不知道怎么部署(别的项目好难好复杂)这个相对非常简单 新手非常友好哦',
      STARTER_TESTIMONIALS_ITEM_AVATAR:
        'https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fd52f6766-3e32-4c3d-8529-46e1f214360f%2Ffavicon.svg?table=collection&id=7d76aad5-a2c4-4d9a-887c-c7913fae4eed&width=400',
      STARTER_TESTIMONIALS_ITEM_NICKNAME: '迪升disheng ',
      STARTER_TESTIMONIALS_ITEM_DESCRIPTION: 'AI资源分享 Blog',
      STARTER_TESTIMONIALS_ITEM_URL: 'https://blog.disheng.org/'
    },
    {
      STARTER_TESTIMONIALS_ITEM_TEXT:
        '灰常感谢大佬的博客项目，能将博客和notion结合起来，这一直是我挺期待的博客模式。',
      STARTER_TESTIMONIALS_ITEM_AVATAR:
        'https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fafb21381-f51b-4fd0-9998-800dbeb64dbe%2Favatar.png?table=block&id=195935d2-0d8d-49fc-bd81-1db42ee50840&spaceId=6c096b44-beb9-48ee-8f92-1efdde47f3a3&width=100&userId=27074aef-7216-41ed-baef-d9b53addd870&cache=v2',
      STARTER_TESTIMONIALS_ITEM_NICKNAME: 'AnJhon',
      STARTER_TESTIMONIALS_ITEM_DESCRIPTION: 'Anjhon`s Blog 站长',
      STARTER_TESTIMONIALS_ITEM_URL: 'https://www.anjhon.top'
    },
    {
      STARTER_TESTIMONIALS_ITEM_TEXT: '用好久了，太感谢了',
      STARTER_TESTIMONIALS_ITEM_AVATAR:
        'https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fe4f391d7-7d65-4c05-a82c-c6e2c40f06e4%2Fa2a7641a26b367608c6ef28ce9b7e983_(2).png?table=block&id=a386eb0e-4c07-4b18-9ece-bba4e79ce21c&spaceId=6c096b44-beb9-48ee-8f92-1efdde47f3a3&width=100&userId=27074aef-7216-41ed-baef-d9b53addd870&cache=v2',
      STARTER_TESTIMONIALS_ITEM_NICKNAME: 'LUCEN',
      STARTER_TESTIMONIALS_ITEM_DESCRIPTION: 'LUCEN考验辅导 站长',
      STARTER_TESTIMONIALS_ITEM_URL: 'https://www.lucenczz.top/'
    }
  ],

  //   FAQ 常见问题模块
  STARTER_FAQ_ENABLE: true, // 常见问题模块开关
  STARTER_FAQ_TITLE: 'Frequently Asked Questions and Answers',
  STARTER_FAQ_TEXT_1: 'Do you have any questions? Please refer to here.',
  STARTER_FAQ_TEXT_2: 'We have collected common user questions.',


  STARTER_FAQ_1_QUESTION: 'How to experience Aragorn translation for free?',
  STARTER_FAQ_1_ANSWER: 'There is a link to the author\'s Twitter at the bottom of the page. Follow him and send him a private message to receive it.',

  STARTER_FAQ_2_QUESTION: 'What are the rules for deducting credits?',
  STARTER_FAQ_2_ANSWER: `<span style='white-space: pre-line;'>1 Aragorn credit is equivalent to one minute of video processing time. 
  Currently, there are three types of video processing in Aragorn: subtitle generation, subtitle translation, and hard subtitle video burning for export.
   Examples of the charging situations are as follows:

    * If you need to generate subtitles for a 10-minute video, it will consume 10 Aragorn credits.
    * If you want to generate subtitles and translate them for a 10-minute video, it will consume 20 Aragorn credits.
    * If you want to generate subtitles, translate them, and export the video with hard subtitles for a 10-minute video, it will consume 30 Aragorn credits.
  
  And so on. If the task fails, credits will be returned to your account.</span>`,

  STARTER_FAQ_3_QUESTION: 'How long are the uploaded videos, generated subtitles, and videos expired?',
  STARTER_FAQ_3_ANSWER: 'They are saved by default for one month. After one month, we will clean them up periodically.',

  STARTER_FAQ_4_QUESTION: 'What technology does Aragorn use for translation? Which languages are supported?',
  STARTER_FAQ_4_ANSWER: `Aragorn uses whisper (ASR) + ChatGPT-4 as the large model base + our own optimized model and professional terminology database for ASR processing and translation. 
  It supports 80+ languages. Currently, only some mainstream languages are available. 
  If the language you need is not yet offered, you can contact us through Twitter and Discord to request it, 
  and we will respond promptly.`,

  STARTER_FAQ_5_QUESTION: 'How to translate videos into multiple target languages?',
  STARTER_FAQ_5_ANSWER: `  Find the subtitle processing task you want to translate, click the translate button to enter the translation task management page, click the “New Translation Task” button, 
  then select the target language for translation, creating one translation task for each language at a time.`,

  STARTER_FAQ_6_QUESTION: 'How to export videos with hard subtitles?',
  STARTER_FAQ_6_ANSWER: `Find the subtitle processing task you want to translate, click the export button to enter the export task management page, 
  click the "New Export Task" button, then select the language to be burned, and click the OK button to proceed.`,


  // 团队成员区块
  STARTER_TEAM_ENABLE: false, // 团队成员区块开关
  STARTER_TEAM_TITLE: '团队成员',
  STARTER_TEAM_TEXT_1: '我们的开发者团队',
  STARTER_TEAM_TEXT_2:
    'NotionNext 由众多开源技术爱好者们共同合作完成，感谢每一位<a className="underline" href="https://github.com/tangly1024/NotionNext/graphs/contributors">贡献者</a>',

  // 这里不支持CONFIG和环境变量，需要一一修改此处代码。
  STARTER_TEAM_ITEMS: [
    {
      STARTER_TEAM_ITEM_AVATAR:
        'https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fa06c61bb-980e-4180-bc18-c15f92c78bb4%2Ftangly1024.jpg?table=collection&id=8e7acf17-de09-4fa1-abde-b5b80ad4a813&t=8e7acf17-de09-4fa1-abde-b5b80ad4a813&width=100&cache=v2',
      STARTER_TEAM_ITEM_NICKNAME: 'Tangly',
      STARTER_TEAM_ITEM_DESCRIPTION: 'Developer'
    },
    {
      STARTER_TEAM_ITEM_AVATAR: '/images/starter/team/team-01.png',
      STARTER_TEAM_ITEM_NICKNAME: 'Melissa Tatcher',
      STARTER_TEAM_ITEM_DESCRIPTION: 'Marketing Expert'
    },
    {
      STARTER_TEAM_ITEM_AVATAR: '/images/starter/team/team-02.png',
      STARTER_TEAM_ITEM_NICKNAME: 'Stuard Ferrel',
      STARTER_TEAM_ITEM_DESCRIPTION: 'Digital Marketer'
    },
    {
      STARTER_TEAM_ITEM_AVATAR: '/images/starter/team/team-03.png',
      STARTER_TEAM_ITEM_NICKNAME: 'Eva Hudson',
      STARTER_TEAM_ITEM_DESCRIPTION: 'Creative Designer'
    }
  ],

  // 博客文章区块
  STARTER_BLOG_ENABLE: true, // 首页博文区块开关
  STARTER_BLOG_TITLE: 'Our blog',
  STARTER_BLOG_COUNT: 3, // 首页博文区块默认展示前3篇文章

  STARTER_BLOG_TEXT_1: 'Recent news',
  STARTER_BLOG_TEXT_2: 'Here will be released some latest updates about Aragorn, including new developments, future plans, and features of new functions.',


  // 联系模块
  STARTER_CONTACT_ENABLE: false, // 联系模块开关
  STARTER_CONTACT_TITLE: 'contact us',
  STARTER_CONTACT_TEXT: 'Tell us about the problems you have encountered.',
  STARTER_CONTACT_LOCATION_TITLE: 'Our location',
  STARTER_CONTACT_LOCATION_TEXT: 'China, Hangzhou',
  STARTER_CONTACT_EMAIL_TITLE: 'How can we help you?',
  STARTER_CONTACT_EMAIL_TEXT: 'belliedmonkey@gmail.com',

  // 嵌入外部表单
  STARTER_CONTACT_MSG_EXTERNAL_URL: 'https://noteforms.com/forms/aragorn-ko2bln', // 基于NoteForm创建，将留言数据存在Notion中
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

  STARTER_FOOTER_SLOGAN: ' our mission: let people all over the world can communicate seamlessly without having to learn foreign languages',

  // 页脚三列菜单组
  STARTER_FOOTER_LINK_GROUP: [
    {

      TITLE: 'Contact Us',
      LINK_GROUP: [
        { TITLE: 'Discord', URL: 'https://discord.gg/term4cAft4' },
        { TITLE: 'Twitter', URL: 'https://twitter.com/belliedmonkey' },

      ]
    },
   

  ],

  STARTER_FOOTER_BLOG_LATEST_TITLE: 'Latest articles',

  STARTER_FOOTER_PRIVACY_POLICY_TEXT: 'Terms of Service',
  STARTER_FOOTER_PRIVACY_POLICY_URL: 'https://dash.aragorn.cc/policy/user-service.html',

  STARTER_FOOTER_PRIVACY_LEGAL_NOTICE_TEXT: 'Privacy Policy',
  STARTER_FOOTER_PRIVACY_LEGAL_NOTICE_URL: 'https://dash.aragorn.cc/policy/privacy-policy.html',

  STARTER_FOOTER_PRIVACY_TERMS_OF_SERVICE_TEXT: 'Cookies Policy',
  STARTER_FOOTER_PRIVACY_TERMS_OF_SERVICE_URL: 'https://dash.aragorn.cc/policy/cookies-policy.html',

  // 404页面的提示语
  STARTER_404_TITLE: 'We seem to be unable to find the page you are looking for.',
  STARTER_404_TEXT: 'Sorry! The page you are looking for does not exist. It may have been moved or deleted.',
  STARTER_404_BACK: 'Return to homepage.',

  STARTER_POST_REDIRECT_ENABLE: true, // 默認開啟重定向
  STARTER_POST_REDIRECT_URL: 'https://dash.aragorn.cc/transcriptionTasks', // 重定向域名
  STARTER_NEWSLETTER: process.env.NEXT_PUBLIC_THEME_STARTER_NEWSLETTER || false // 是否开启邮件订阅 请先配置mailchimp功能 https://docs.tangly1024.com/article/notion-next-mailchimp
}
export default CONFIG
