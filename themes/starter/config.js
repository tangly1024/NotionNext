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
  STARTER_HERO_TITLE_1: 'Your Path to Success Starts Here', // 英雄区文字
  STARTER_HERO_TITLE_2:
    'Transform Your Mindset, Transform Your Life: Empowering Your Journey to Success with Insightful Content and Valuable Strategies at Mindset', // 英雄区文字
  // 英雄区两个按钮，如果TEXT留空则隐藏按钮
  STARTER_HERO_BUTTON_1_TEXT: 'Start your experience now!', // 英雄区按钮
  STARTER_HERO_BUTTON_1_URL: 'https://whop.com/mindset-community', // 英雄区按钮
  STARTER_HERO_BUTTON_2_TEXT: 'Discord Server', // 英雄区按钮
  STARTER_HERO_BUTTON_2_URL:
    'https://discord.com/servers/mindset-community-783713892131536927', // 英雄区按钮
  STARTER_HERO_BUTTON_2_ICON: null, // 英雄区按钮2的图标，不需要则留空

  STARTER_HERO_PREVIEW_IMAGE:
    'https://www.youtube.com/embed/WQgb9SQQ3rE?si=2D3Pbg7e89XKQ_9x', // 产品预览图 ，默认读取public目录下图片

  // 顶部右侧导航暗流
  STARTER_NAV_BUTTON_1_TEXT: 'Articles',
  STARTER_NAV_BUTTON_1_URL: '/archive',

  STARTER_NAV_BUTTON_2_TEXT: 'Join Now!',
  STARTER_NAV_BUTTON_2_URL: 'https://whop.com/mindset-community',

  // 特性区块
  STARTER_FEATURE_ENABLE: true, // 特性区块开关
  STARTER_FEATURE_TITLE: 'Features', // 特性
  STARTER_FEATURE_TEXT_1: 'The main features', // 特性
  STARTER_FEATURE_TEXT_2: null, // 特性

  STARTER_FEATURE_1_TITLE_1: 'Digital Content', // 特性1
  STARTER_FEATURE_1_TEXT_1:
    'Explore our digital content offering ebooks, resources, courses, and more!', // 特性1
  STARTER_FEATURE_1_BUTTON_TEXT: 'Learn More', // 特性1
  STARTER_FEATURE_1_BUTTON_URL: 'https://whop.com/mindset-community', // 特性1

  STARTER_FEATURE_2_TITLE_1: 'Events', // 特性2
  STARTER_FEATURE_2_TEXT_1:
    'Discover our upcoming events and join us for enriching experiences!', // 特性2
  STARTER_FEATURE_2_BUTTON_TEXT: 'Learn More', // 特性2
  STARTER_FEATURE_2_BUTTON_URL: 'https://whop.com/mindset-community', // 特性2

  STARTER_FEATURE_3_TITLE_1: 'Chat Access', // 特性3
  STARTER_FEATURE_3_TEXT_1:
    'Gain chat access for real-time communication and support.', // 特性3
  STARTER_FEATURE_3_BUTTON_TEXT: 'Learn More', // 特性3
  STARTER_FEATURE_3_BUTTON_URL: 'https://whop.com/mindset-community', // 特性3

  STARTER_FEATURE_4_TITLE_1: 'Challenges', // 特性4
  STARTER_FEATURE_4_TEXT_1: 'Take on our challenges and achieve new heights!', // 特性4
  STARTER_FEATURE_4_BUTTON_TEXT: 'Learn More', // 特性4
  STARTER_FEATURE_4_BUTTON_URL: 'https://whop.com/mindset-community', // 特性4

  // 首页ABOUT区块
  STARTER_ABOUT_ENABLE: true, // ABOUT区块开关
  STARTER_ABOUT_TITLE: 'Who are we?',
  STARTER_ABOUT_TEXT:
    'Welcome to Mindset, where we empower individuals to elevate their lives through insightful content. Discover practical strategies for financial success and holistic well-being, curated for personal and professional growth. Explore our finance articles for valuable insights on money management and investment strategies, tailored to guide you towards a secure financial future.',
  STARTER_ABOUT_BUTTON_TEXT: 'Learn More',
  STARTER_ABOUT_BUTTON_URL: 'https://mindset.onthewifi.com/about',
  STARTER_ABOUT_IMAGE_1: '/images/starter/about/about-image-01.jpg',
  STARTER_ABOUT_IMAGE_2: '/images/starter/about/about-image-02.jpg',
  STARTER_ABOUT_TIPS_1: '2000+',
  STARTER_ABOUT_TIPS_2: 'Members',
  STARTER_ABOUT_TIPS_3: 'Running online',

  // 首页价格区块
  STARTER_PRICING_ENABLE: true, // 价格区块开关
  STARTER_PRICING_TITLE: 'Price List',
  STARTER_PRICING_TEXT_1: null,
  STARTER_PRICING_TEXT_2: null,

  STARTER_PRICING_1_TITLE: 'Member Tier',
  STARTER_PRICING_1_PRICE: 'FREE',
  STARTER_PRICING_1_PRICE_CURRENCY: null,
  STARTER_PRICING_1_PRICE_PERIOD: null,
  STARTER_PRICING_1_HEADER: 'Access features',
  STARTER_PRICING_1_FEATURES: 'Chat Access, Unlocked Content', // 英文逗号隔开
  STARTER_PRICING_1_BUTTON_TEXT: 'Start Now',
  STARTER_PRICING_1_BUTTON_URL:
    'https://whop.com/checkout/plan_gEhXRPiJAAc8G?d2c=true',

  STARTER_PRICING_2_TAG: 'Popular',
  STARTER_PRICING_2_TITLE: 'Premium Member Tier',
  STARTER_PRICING_2_PRICE: '50',
  STARTER_PRICING_2_PRICE_CURRENCY: '$',
  STARTER_PRICING_2_PRICE_PERIOD: 'Monthly',
  STARTER_PRICING_2_HEADER: 'Access all features',
  STARTER_PRICING_2_FEATURES:
    'Chat Access,Courses,Digital Content,Early Content,Unlocked Content', // 英文逗号隔开
  STARTER_PRICING_2_BUTTON_TEXT: 'Join Now!',
  STARTER_PRICING_2_BUTTON_URL:
    'https://whop.com/checkout/plan_ABJqqwwzBoHc2?d2c=true',

  STARTER_PRICING_3_TITLE: 'Exclusive Member Tier',
  STARTER_PRICING_3_PRICE: '500',
  STARTER_PRICING_3_PRICE_CURRENCY: '$',
  STARTER_PRICING_3_PRICE_PERIOD: 'Monthly',
  STARTER_PRICING_3_HEADER: 'Access all features',
  STARTER_PRICING_3_FEATURES:
    'Chat Access,Courses,Digital Content,Early Content,Coaching,Unlocked Content', // 英文逗号隔开
  STARTER_PRICING_3_BUTTON_TEXT: 'Sign Up!',
  STARTER_PRICING_3_BUTTON_URL:
    'https://whop.com/checkout/plan_AOydhqLoQ7ks1?d2c=true',

  // 首页用户测评区块
  STARTER_TESTIMONIALS_ENABLE: true, // 测评区块开关
  STARTER_TESTIMONIALS_TITLE: 'Testimonials',
  STARTER_TESTIMONIALS_TEXT_1: 'What Our Members Are Saying',
  STARTER_TESTIMONIALS_TEXT_2: null,
  STARTER_TESTIMONIALS_STAR_ICON: '/images/starter/testimonials/icon-star.svg', // 评分图标

  // 这里不支持CONFIG和环境变量，需要一一修改此处代码。
  STARTER_TESTIMONIALS_ITEMS: [
    {
      STARTER_TESTIMONIALS_ITEM_TEXT:
        "OMG, I just gotta gush about Mindset! 🥰 It's seriously changed my life!  I felt so failed and overwhelmed, like I was drowning in an ocean of doubts and negativity. But then, poof, Mindset swooped in like a magical unicorn and sprinkled its positivity all over me!",
      STARTER_TESTIMONIALS_ITEM_AVATAR:
        'https://images-ext-1.discordapp.net/external/mEiRezeLg_zfQBzAkACwy6qStoV6Usn-NE1tlfFXlGI/%3Fsize%3D4096/https/cdn.discordapp.com/avatars/1191506786092581034/9aba0d57bac76854d3f56a943e78367b.png?format=webp&quality=lossless',
      STARTER_TESTIMONIALS_ITEM_NICKNAME: 'Marilyn',
      STARTER_TESTIMONIALS_ITEM_DESCRIPTION: 'Testimonial',
      STARTER_TESTIMONIALS_ITEM_URL: 'https://payhip.com/bunnyscolorstore'
    },
    {
      STARTER_TESTIMONIALS_ITEM_TEXT:
        "Joining Mindset has been a game-changer for me. The value I get from the exclusive content and resources is unmatched. It's like having a whole team of experts at my fingertips!",
      STARTER_TESTIMONIALS_ITEM_AVATAR:
        'https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F0d33d169-f932-41ff-ac6b-88a923c08e02%2F%25E5%25A4%25B4%25E5%2583%258F.jfif?table=collection&id=7787658d-d5c0-4f34-8e32-60c523dfaba3&width=400',
      STARTER_TESTIMONIALS_ITEM_NICKNAME: 'James',
      STARTER_TESTIMONIALS_ITEM_DESCRIPTION: 'Sample Testimonial',
      STARTER_TESTIMONIALS_ITEM_URL: 'https://mindset.onthewifi.com/'
    },
    {
      STARTER_TESTIMONIALS_ITEM_TEXT:
        "I can't imagine my life without this mindset community now. The connections I've made and the knowledge I've gained have enriched my life in ways I never thought possible. The regular events and resources keep me motivated and focused on my personal development journey. Grateful to be a part of such a supportive and uplifting community!",
      STARTER_TESTIMONIALS_ITEM_AVATAR:
        'https://www.notion.so/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F6c096b44-beb9-48ee-8f92-1efdde47f3a3%2F338962f1-d352-49c7-9a1b-746e35a7005c%2Fhf.png?table=block&id=ce5a48a9-d77a-4843-a3d9-a78cd4f794ce&spaceId=6c096b44-beb9-48ee-8f92-1efdde47f3a3&width=100&userId=27074aef-7216-41ed-baef-d9b53addd870&cache=v2',
      STARTER_TESTIMONIALS_ITEM_NICKNAME: 'Sarah',
      STARTER_TESTIMONIALS_ITEM_DESCRIPTION: 'Sample Testimonial',
      STARTER_TESTIMONIALS_ITEM_URL: 'https://mindset.onthewifi.com/'
    },
    {
      STARTER_TESTIMONIALS_ITEM_TEXT:
        'Being part of this mindset community has been incredibly transformative. The discussions, insights, and tools shared have helped me break through limiting beliefs and cultivate a growth mindset. I have found a sense of belonging and encouragement that has propelled me towards personal and professional growth. Highly recommended!',
      STARTER_TESTIMONIALS_ITEM_AVATAR:
        'https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fd52f6766-3e32-4c3d-8529-46e1f214360f%2Ffavicon.svg?table=collection&id=7d76aad5-a2c4-4d9a-887c-c7913fae4eed&width=400',
      STARTER_TESTIMONIALS_ITEM_NICKNAME: 'Alex ',
      STARTER_TESTIMONIALS_ITEM_DESCRIPTION: 'Sample Testimonial',
      STARTER_TESTIMONIALS_ITEM_URL: 'https://mindset.onthewifi.com/'
    },
    {
      STARTER_TESTIMONIALS_ITEM_TEXT:
        'I was hesitant to join at first, but I am so glad I did. The content and discussions within this mindset community have opened my eyes to new possibilities and helped me overcome self-doubt. The encouragement and guidance from fellow members have been invaluable in shaping my mindset for success. Truly a life-changing experience!',
      STARTER_TESTIMONIALS_ITEM_AVATAR:
        'https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fafb21381-f51b-4fd0-9998-800dbeb64dbe%2Favatar.png?table=block&id=195935d2-0d8d-49fc-bd81-1db42ee50840&spaceId=6c096b44-beb9-48ee-8f92-1efdde47f3a3&width=100&userId=27074aef-7216-41ed-baef-d9b53addd870&cache=v2',
      STARTER_TESTIMONIALS_ITEM_NICKNAME: 'Emily',
      STARTER_TESTIMONIALS_ITEM_DESCRIPTION: 'Sample Testimonial',
      STARTER_TESTIMONIALS_ITEM_URL: 'https://mindset.onthewifi.com/'
    },
    {
      STARTER_TESTIMONIALS_ITEM_TEXT: '用好久了，太感谢了',
      STARTER_TESTIMONIALS_ITEM_AVATAR:
        'https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fe4f391d7-7d65-4c05-a82c-c6e2c40f06e4%2Fa2a7641a26b367608c6ef28ce9b7e983_(2).png?table=block&id=a386eb0e-4c07-4b18-9ece-bba4e79ce21c&spaceId=6c096b44-beb9-48ee-8f92-1efdde47f3a3&width=100&userId=27074aef-7216-41ed-baef-d9b53addd870&cache=v2',
      STARTER_TESTIMONIALS_ITEM_NICKNAME: 'James',
      STARTER_TESTIMONIALS_ITEM_DESCRIPTION: 'Sample Testimonial',
      STARTER_TESTIMONIALS_ITEM_URL: 'https://mindset.onthewifi.com/'
    }
  ],

  //   FAQ 常见问题模块
  STARTER_FAQ_ENABLE: true, // 常见问题模块开关
  STARTER_FAQ_TITLE: 'Frequently Asked Questions (FAQ)',
  STARTER_FAQ_TEXT_1: 'Do you have any questions? Please see here.',
  STARTER_FAQ_TEXT_2:
    'These FAQs aim to address common queries and provide clarity.',

  STARTER_FAQ_1_QUESTION:
    'How do I access the chat feature as a member subscriber?',
  STARTER_FAQ_1_ANSWER:
    'As a member subscriber, you can access the chat feature by logging into your account and navigating to the community section where you can engage with other members in real-time discussions.',

  STARTER_FAQ_2_QUESTION: 'Are the courses available for all skill levels?',
  STARTER_FAQ_2_ANSWER:
    'Yes, our courses cater to a wide range of skill levels, from beginners to advanced learners. You can choose courses based on your interests and current proficiency to enhance your knowledge and skills.',

  STARTER_FAQ_3_QUESTION:
    'Can I download the digital books and resources for offline access?',
  STARTER_FAQ_3_ANSWER:
    'Yes, you can download our digital books and resources for offline access. Simply click on the download option next to the resource you wish to save and enjoy access anytime, anywhere.',

  STARTER_FAQ_4_QUESTION: 'How often do you release early access content?',
  STARTER_FAQ_4_ANSWER:
    'We regularly release early access content to our member subscribers to provide them with exclusive updates and insights. You can expect new content to be available for early access on a regular basis, keeping you informed and engaged.',

  // 团队成员区块
  STARTER_TEAM_ENABLE: false, // 团队成员区块开关
  STARTER_TEAM_TITLE: 'Team Members',
  STARTER_TEAM_TEXT_1: 'Our Development Team',
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
  STARTER_BLOG_TITLE: '我们的博客',
  STARTER_BLOG_COUNT: 3, // 首页博文区块默认展示前3篇文章
  STARTER_BLOG_TEXT_1: '最近的新闻',
  STARTER_BLOG_TEXT_2:
    '这里会发布一些关于NotionNext的最新动态，包括新的动向、新的未来计划，以及新功能的特性',

  // 联系模块
  STARTER_CONTACT_ENABLE: true, // 联系模块开关
  STARTER_CONTACT_TITLE: 'Contact Us',
  STARTER_CONTACT_TEXT: "Tell us about the issues you're experiencing.",
  STARTER_CONTACT_LOCATION_TITLE: 'Our Location',
  STARTER_CONTACT_LOCATION_TEXT: 'Wordwide',
  STARTER_CONTACT_EMAIL_TITLE: 'How can we assist you?',
  STARTER_CONTACT_EMAIL_TEXT: 'mindset.community.email@gmail.com',

  // 嵌入外部表单
  STARTER_CONTACT_MSG_EXTERNAL_URL:
    'https://noteforms.com/forms/noteforms-as9gc7', // 基于NoteForm创建，将留言数据存在Notion中
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

  STARTER_FOOTER_SLOGAN: '"Stay Focused, Stay Elevated, Mindset."',

  // 页脚三列菜单组
  STARTER_FOOTER_LINK_GROUP: [
    {
      TITLE: 'About Us',
      LINK_GROUP: [
        { TITLE: 'Homepage', URL: '/#home' },
        { TITLE: 'Contact Us', URL: '/contact-us' },
        { TITLE: 'Join Us', URL: '/?theme=starter' },
        { TITLE: 'Store', URL: 'https://payhip.com/mindsetstore' }
      ]
    },
    {
      TITLE: 'Social Media',
      LINK_GROUP: [
        {
          TITLE: 'Facebook',
          URL: 'https://www.facebook.com/people/Mindset-Community/61556389438584/'
        },
        { TITLE: 'ВКонтакте', URL: 'https://vk.com/mindset.community' },
        {
          TITLE: 'Discord',
          URL: 'https://discord.com/servers/mindset-community-783713892131536927'
        },
        { TITLE: 'Telegram', URL: 'https://t.me/mindset_community' },
        {
          TITLE: 'Instagram',
          URL: 'https://www.instagram.com/mindset.onthewifi/'
        },
        { TITLE: 'Twitter', URL: 'https://twitter.com/mindsetonwifi' },
        { TITLE: 'Tiktok', URL: 'https://www.tiktok.com/@mindset.onthewifi' }
      ]
    },
    {
      TITLE: 'Youtube',
      LINK_GROUP: [
        {
          TITLE: 'Health & Wellness',
          URL: 'https://www.youtube.com/@mindset.wellness.888'
        },
        {
          TITLE: 'Commerce',
          URL: 'https://www.youtube.com/@mindset.commerce.888'
        },
        {
          TITLE: 'Finance',
          URL: 'https://www.youtube.com/@mindset.finance.888'
        }
      ]
    }
  ],

  STARTER_FOOTER_BLOG_LATEST_TITLE: 'Latest Articles',

  STARTER_FOOTER_PRIVACY_POLICY_TEXT: 'Privacy Policy',
  STARTER_FOOTER_PRIVACY_POLICY_URL: '/privacy-policy',

  STARTER_FOOTER_PRIVACY_LEGAL_NOTICE_TEXT: 'Legal Disclaimer',
  STARTER_FOOTER_PRIVACY_LEGAL_NOTICE_URL: '/legacy-notice',

  STARTER_FOOTER_PRIVACY_TERMS_OF_SERVICE_TEXT: 'Terms of Service',
  STARTER_FOOTER_PRIVACY_TERMS_OF_SERVICE_URL: '/terms-of-use',

  // 404页面的提示语
  STARTER_404_TITLE:
    "We seem to be unable to find the page you're looking for.",
  STARTER_404_TEXT:
    "Sorry! The page you are looking for doesn't exist. It may have been moved or deleted.",
  STARTER_404_BACK: 'Back to Homepage',

  STARTER_POST_REDIRECT_ENABLE: true, // 默認開啟重定向
  STARTER_POST_REDIRECT_URL: 'https://mindset.onthewifi.com', // 重定向域名
  STARTER_NEWSLETTER: process.env.NEXT_PUBLIC_THEME_STARTER_NEWSLETTER || true // 是否开启邮件订阅 请先配置mailchimp功能 https://docs.tangly1024.com/article/notion-next-mailchimp
}
export default CONFIG
