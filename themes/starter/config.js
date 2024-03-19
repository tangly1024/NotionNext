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
  STARTER_HERO_TITLE_1: '开源且免费的基于 Notion 笔记的网站构建工具', // 英雄区文字
  STARTER_HERO_TITLE_2: '通过笔记无感知地建站、成倍放大您的价值', // 英雄区文字
  // 英雄区两个按钮，如果TEXT留空则隐藏按钮
  STARTER_HERO_BUTTON_1_TEXT: '开始体验', // 英雄区按钮
  STARTER_HERO_BUTTON_1_URL: 'https://docs.tangly1024.com/article/vercel-deploy-notion-next', // 英雄区按钮
  STARTER_HERO_BUTTON_2_TEXT: '在Github上关注', // 英雄区按钮
  STARTER_HERO_BUTTON_2_URL: 'https://github.com/Phillweston/Phillweston', // 英雄区按钮
  STARTER_HERO_BUTTON_2_ICON: '/images/starter/github.svg', // 英雄区按钮2的图标，不需要则留空
  STARTER_HERO_PREVIEW_IMAGE: '/images/starter/hero/hero-image.webp', // 产品预览图 ，默认读取public目录下图片

  // 顶部右侧导航暗流
  STARTER_NAV_BUTTON_1_TEXT: 'Sign In',
  STARTER_NAV_BUTTON_1_URL: '/signin',

  STARTER_NAV_BUTTON_2_TEXT: 'Sign Up',
  STARTER_NAV_BUTTON_2_URL: '/signup',

  // 特性区块
  STARTER_FEATURE_ENABLE: true, // 特性区块开关
  STARTER_FEATURE_TITLE: 'Expertise and Innovations', // 专业和创新
  STARTER_FEATURE_TEXT_1: 'Exploring the Frontier of Drone Technology and Intelligent Systems', // 探索无人机技术和智能系统的前沿
  STARTER_FEATURE_TEXT_2: 'Combining a deep understanding of electronic engineering from XiDian University with practical experience in drone and intelligent system development, I bring cutting-edge insights and innovations to the field.', // 结合西电的电子工程深入理解和无人机与智能系统开发的实践经验，我为该领域带来前沿洞察和创新。

  STARTER_FEATURE_1_TITLE_1: 'Open Source and Innovation', // 开源与创新
  STARTER_FEATURE_1_TEXT_1: 'Committed to open-source contributions, notably in Ardupilot, enhancing drone flight control systems with advanced algorithms.', // 致力于开源贡献，尤其是在 Ardupilot 中，通过高级算法增强无人机飞行控制系统。
  STARTER_FEATURE_1_BUTTON_TEXT: 'Discover More', // 发现更多
  STARTER_FEATURE_1_BUTTON_URL: 'https://github.com/XDU-Educational-UAV', // 链接到您的GitHub资料

  STARTER_FEATURE_2_TITLE_1: 'Innovative Drone Solutions', // 创新无人机解决方案
  STARTER_FEATURE_2_TEXT_1: 'From the "Qian Tian Yu Claw" to the "Yi Chi Co-Defense," my projects reflect innovative applications in line inspection and security.', // 从“乾天御爪”到“翼驰协防”，我的项目反映了线路检查和安全领域的创新应用。
  STARTER_FEATURE_2_BUTTON_TEXT: 'Learn More', // 了解更多
  STARTER_FEATURE_2_BUTTON_URL: 'https://phillweston.xyz/project', // 您的网站/项目页面链接

  STARTER_FEATURE_3_TITLE_1: 'Advanced Research and Development', // 高级研究与开发
  STARTER_FEATURE_3_TEXT_1: 'Engaged in cutting-edge research in autonomous flight, image processing, and AI-driven drone technology.', // 从事自主飞行、图像处理和人工智能驱动的无人机技术的前沿研究。
  STARTER_FEATURE_3_BUTTON_TEXT: 'Explore', // 探索
  STARTER_FEATURE_3_BUTTON_URL: 'https://phillweston.xyz/research', // 您的研究页面链接

  STARTER_FEATURE_4_TITLE_1: 'Practical and Theoretical Mastery', // 实践与理论精通
  STARTER_FEATURE_4_TEXT_1: 'Blending robust academic foundations with real-world applications, focusing on control systems, vision algorithms, and machine learning.', // 将扎实的学术基础与现实世界的应用相结合，专注于控制系统、视觉算法和机器学习。
  STARTER_FEATURE_4_BUTTON_TEXT: 'Read More', // 阅读更多
  STARTER_FEATURE_4_BUTTON_URL: 'https://docs.phillweston.com/about', // 您的关于页面链接

  // 首页ABOUT区块
  // Home Page ABOUT Section
  STARTER_ABOUT_ENABLE: true, // ABOUT区块开关
  STARTER_ABOUT_TITLE: 'Advancing the Future of Autonomous Drone Technology',
  STARTER_ABOUT_TEXT: 'My aspiration is to revolutionize the field of autonomous drones, making them more accessible, efficient, and versatile. I envision drones that not only navigate autonomously but also adapt intelligently to various environments and tasks. <br /><br /> By integrating advanced AI, machine learning, and robust control systems, my goal is to develop drones capable of complex operations, enhancing industries from agriculture to urban planning. The journey begins with innovative research, collaboration, and a passion for pushing technological boundaries.',
  STARTER_ABOUT_BUTTON_TEXT: 'Discover the Vision',
  STARTER_ABOUT_BUTTON_URL: 'https://docs.phillweston.com/about',
  STARTER_ABOUT_IMAGE_1: '/images/starter/about/about-image-01.jpg',
  STARTER_ABOUT_IMAGE_2: '/images/starter/about/about-image-02.jpg',
  STARTER_ABOUT_TIPS_1: 'Innovative',
  STARTER_ABOUT_TIPS_2: 'Drone Solutions',
  STARTER_ABOUT_TIPS_3: 'For a Smarter Tomorrow',

  // 首页价格区块
  STARTER_PRICING_ENABLE: true, // 价格区块开关
  STARTER_PRICING_TITLE: '价格表',
  STARTER_PRICING_TEXT_1: '很棒的定价计划',
  STARTER_PRICING_TEXT_2: '我们制定了灵活的付费模式，您可以按需选择。（NotionNext免费开源，这里仅演示产品订阅付费功能，请勿下单购买！）',

  STARTER_PRICING_1_TITLE: '入门版',
  STARTER_PRICING_1_PRICE: '19.9',
  STARTER_PRICING_1_PRICE_CURRENCY: '$',
  STARTER_PRICING_1_PRICE_PERIOD: '每月',
  STARTER_PRICING_1_HEADER: '功能点',
  STARTER_PRICING_1_FEATURES: '所有的主题,免费更新,帮助手册', // 英文逗号隔开
  STARTER_PRICING_1_BUTTON_TEXT: '立即购买',
  STARTER_PRICING_1_BUTTON_URL: 'https://tangly1024.lemonsqueezy.com/checkout/buy/c1a38a65-362e-44c5-8065-733fee39eb54',

  STARTER_PRICING_2_TAG: '推荐',
  STARTER_PRICING_2_TITLE: '基础版',
  STARTER_PRICING_2_PRICE: '39.9',
  STARTER_PRICING_2_PRICE_CURRENCY: '$',
  STARTER_PRICING_2_PRICE_PERIOD: '每月',
  STARTER_PRICING_2_HEADER: '功能点',
  STARTER_PRICING_2_FEATURES: '包含入门版,项目源码,内部社群,技术咨询,SEO优化', // 英文逗号隔开
  STARTER_PRICING_2_BUTTON_TEXT: '立即购买',
  STARTER_PRICING_2_BUTTON_URL: 'https://tangly1024.lemonsqueezy.com/checkout/buy/590ad70a-c3b7-4caf-94ec-9ca27bde06d4',

  STARTER_PRICING_3_TITLE: '高级版',
  STARTER_PRICING_3_PRICE: '59.9',
  STARTER_PRICING_3_PRICE_CURRENCY: '$',
  STARTER_PRICING_3_PRICE_PERIOD: '每月',
  STARTER_PRICING_3_HEADER: '功能点',
  STARTER_PRICING_3_FEATURES: '包含基础版,功能定制开发', // 英文逗号隔开
  STARTER_PRICING_3_BUTTON_TEXT: '立即购买',
  STARTER_PRICING_3_BUTTON_URL: 'https://tangly1024.lemonsqueezy.com/checkout/buy/df924d66-09dc-42a4-a632-a6b0c5cc4f28',

  STARTER_TESTIMONIALS_ENABLE: true, // 测评区块开关
  STARTER_TESTIMONIALS_TITLE: 'User Reviews',
  STARTER_TESTIMONIALS_TEXT_1: 'Hear What They Say',
  STARTER_TESTIMONIALS_TEXT_2: 'Experts and tech enthusiasts from various fields share their experiences with our intelligent drones and AI technology. Their success stories and feedback demonstrate the innovation and practicality of our project.',
  STARTER_TESTIMONIALS_STAR_ICON: '/images/starter/testimonials/icon-star.svg', // 评分图标

  // 这里不支持CONFIG和环境变量，需要一一修改此处代码。
  STARTER_TESTIMONIALS_ITEMS: [
    {
      STARTER_TESTIMONIALS_ITEM_TEXT: 'Impressive! Your AI-driven drone system outperforms anything I\'ve encountered. The accuracy and efficiency it brings to aerial tasks are unparalleled.',
      STARTER_TESTIMONIALS_ITEM_AVATAR: 'https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F22de3fcb-d90d-4271-bc01-f815f476122b%2F4FE0A0C0-E487-4C74-BF8E-6F01A27461B8-14186-000008094BC289A6.jpg?table=collection&id=a320a2cc-6ebe-4a8d-95cc-ea94e63bced9&width=200',
      STARTER_TESTIMONIALS_ITEM_NICKNAME: 'DroneTechExpert',
      STARTER_TESTIMONIALS_ITEM_DESCRIPTION: 'Industry Specialist',
      STARTER_TESTIMONIALS_ITEM_URL: 'https://industryexpert.blog'
    },
    {
      STARTER_TESTIMONIALS_ITEM_TEXT: 'As a tech enthusiast, I am blown away by the intelligent capabilities of your drones. Their autonomous navigation is a game-changer!',
      STARTER_TESTIMONIALS_ITEM_AVATAR: 'https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F0d33d169-f932-41ff-ac6b-88a923c08e02%2F%25E5%25A4%25B4%25E5%2583%258F.jfif?table=collection&id=7787658d-d5c0-4f34-8e32-60c523dfaba3&width=400',
      STARTER_TESTIMONIALS_ITEM_NICKNAME: 'TechGuru',
      STARTER_TESTIMONIALS_ITEM_DESCRIPTION: 'Technology Blogger',
      STARTER_TESTIMONIALS_ITEM_URL: 'https://techguru.blog'
    },
    {
      STARTER_TESTIMONIALS_ITEM_TEXT: 'The integration of AI in your drones has revolutionized the way we approach aerial surveillance. Truly innovative and cutting-edge!',
      STARTER_TESTIMONIALS_ITEM_AVATAR: 'https://www.notion.so/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F6c096b44-beb9-48ee-8f92-1efdde47f3a3%2F338962f1-d352-49c7-9a1b-746e35a7005c%2Fhf.png?table=block&id=ce5a48a9-d77a-4843-a3d9-a78cd4f794ce&spaceId=6c096b44-beb9-48ee-8f92-1efdde47f3a3&width=100&userId=27074aef-7216-41ed-baef-d9b53addd870&cache=v2',
      STARTER_TESTIMONIALS_ITEM_NICKNAME: 'AI Innovator',
      STARTER_TESTIMONIALS_ITEM_DESCRIPTION: 'AI Researcher',
      STARTER_TESTIMONIALS_ITEM_URL: 'https://aiinnovator.tech'
    },
    {
      STARTER_TESTIMONIALS_ITEM_TEXT: 'Your project sets a new standard in the drone industry. The autonomous features powered by AI are incredibly advanced yet user-friendly.',
      STARTER_TESTIMONIALS_ITEM_AVATAR: 'https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fd52f6766-3e32-4c3d-8529-46e1f214360f%2Ffavicon.svg?table=collection&id=7d76aad5-a2c4-4d9a-887c-c7913fae4eed&width=400',
      STARTER_TESTIMONIALS_ITEM_NICKNAME: 'FutureTechLeader',
      STARTER_TESTIMONIALS_ITEM_DESCRIPTION: 'Emerging Technologies Analyst',
      STARTER_TESTIMONIALS_ITEM_URL: 'https://futuretechleader.net'
    },
    {
      STARTER_TESTIMONIALS_ITEM_TEXT: 'Utilizing your intelligent drones has significantly enhanced our data collection efficiency. They\'re truly at the forefront of AI and drone technology!',
      STARTER_TESTIMONIALS_ITEM_AVATAR: 'https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fafb21381-f51b-4fd0-9998-800dbeb64dbe%2Favatar.png?table=block&id=195935d2-0d8d-49fc-bd81-1db42ee50840&spaceId=6c096b44-beb9-48ee-8f92-1efdde47f3a3&width=100&userId=27074aef-7216-41ed-baef-d9b53addd870&cache=v2',
      STARTER_TESTIMONIALS_ITEM_NICKNAME: 'DataWizard',
      STARTER_TESTIMONIALS_ITEM_DESCRIPTION: 'Data Analyst',
      STARTER_TESTIMONIALS_ITEM_URL: 'https://datawizard.analytics'
    },
    {
      STARTER_TESTIMONIALS_ITEM_TEXT: 'The versatility of your drones in different environmental conditions is outstanding. Their robust AI system demonstrates remarkable adaptability and precision.',
      STARTER_TESTIMONIALS_ITEM_AVATAR: 'https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fe4f391d7-7d65-4c05-a82c-c6e2c40f06e4%2Fa2a7641a26b367608c6ef28ce9b7e983_(2).png?table=block&id=a386eb0e-4c07-4b18-9ece-bba4e79ce21c&spaceId=6c096b44-beb9-48ee-8f92-1efdde47f3a3&width=100&userId=27074aef-7216-41ed-baef-d9b53addd870&cache=v2',
      STARTER_TESTIMONIALS_ITEM_NICKNAME: 'EnviroTech',
      STARTER_TESTIMONIALS_ITEM_DESCRIPTION: 'Environmental Scientist',
      STARTER_TESTIMONIALS_ITEM_URL: 'https://envirotech.science'
    }
  ],

  //   FAQ 常见问题模块
  STARTER_FAQ_ENABLE: true, // 常见问题模块开关
  STARTER_FAQ_TITLE: 'Frequently Asked Questions',
  STARTER_FAQ_TEXT_1: 'Got Questions? Find Answers Here',
  STARTER_FAQ_TEXT_2: 'We\'ve compiled some of the most common questions from our users',

  STARTER_FAQ_1_QUESTION: 'Do you provide resources for learning about your drone technology?',
  STARTER_FAQ_1_ANSWER: 'Yes, we offer comprehensive <a href="[LinkToYourDocs]" className="underline">documentation</a> and <a href="[LinkToDemoVideos]" className="underline">demonstration videos</a> that cover various aspects of our drone and AI technology. Additionally, you can join our <a href="[LinkToCommunity]" className="underline">community forum</a> for further assistance.',

  STARTER_FAQ_2_QUESTION: 'How can I stay updated on your latest research and projects?',
  STARTER_FAQ_2_ANSWER: 'Our website regularly updates with the latest information on our projects. You can also subscribe to our newsletter or follow us on social media for the most recent developments.',

  STARTER_FAQ_3_QUESTION: 'What should I do if I encounter issues with implementing your technology?',
  STARTER_FAQ_3_ANSWER: 'If you\'re facing technical difficulties, please review our troubleshooting guidelines first. If the issue persists, you can reach out to our support team or consult the user community for assistance.',

  STARTER_FAQ_4_QUESTION: 'Can your drone technology be customized for specific applications?',
  STARTER_FAQ_4_ANSWER: 'Absolutely! We offer customizable solutions tailored to a variety of applications. Contact us to discuss how our technology can meet your specific needs.',

  // 团队成员区块
  STARTER_TEAM_ENABLE: true, // 团队成员区块开关
  STARTER_TEAM_TITLE: 'Our Team',
  STARTER_TEAM_TEXT_1: 'Meet the Developers',
  STARTER_TEAM_TEXT_2: 'Our innovative solutions are the result of collaborative efforts by a passionate team of developers, researchers, and technology enthusiasts. A big thank you to each <a className="underline" href="[LinkToContributors]">contributor</a>.',

  // 这里不支持CONFIG和环境变量，需要一一修改此处代码。
  STARTER_TEAM_ITEMS: [
    {
      STARTER_TEAM_ITEM_AVATAR: 'https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fa06c61bb-980e-4180-bc18-c15f92c78bb4%2Ftangly1024.jpg?table=collection&id=8e7acf17-de09-4fa1-abde-b5b80ad4a813&t=8e7acf17-de09-4fa1-abde-b5b80ad4a813&width=100&cache=v2',
      STARTER_TEAM_ITEM_NICKNAME: 'Phillweston',
      STARTER_TEAM_ITEM_DESCRIPTION: 'Developer'
    },
    {
      STARTER_TEAM_ITEM_AVATAR: '/images/starter/team/team-01.png',
      STARTER_TEAM_ITEM_NICKNAME: 'TommyVCT',
      STARTER_TEAM_ITEM_DESCRIPTION: 'Marketing Expert'
    },
    {
      STARTER_TEAM_ITEM_AVATAR: '/images/starter/team/team-02.png',
      STARTER_TEAM_ITEM_NICKNAME: 'iPapaw',
      STARTER_TEAM_ITEM_DESCRIPTION: 'Digital Marketer'
    },
    {
      STARTER_TEAM_ITEM_AVATAR: '/images/starter/team/team-03.png',
      STARTER_TEAM_ITEM_NICKNAME: 'Frank Zhao',
      STARTER_TEAM_ITEM_DESCRIPTION: 'Creative Designer'
    }
  ],

  // 博客文章区块
  STARTER_BLOG_ENABLE: true, // 首页博文区块开关
  STARTER_BLOG_TITLE: 'My Blog',
  STARTER_BLOG_COUNT: 3, // Display the latest 3 articles in the blog section on the homepage
  STARTER_BLOG_TEXT_1: 'Recent News',
  STARTER_BLOG_TEXT_2: 'In this space, we\'ll share the latest advancements in our drone technology, discuss future innovations, and explore new features and functionalities shaping the world of autonomous flight.',

  // 联系模块
  STARTER_CONTACT_ENABLE: true, // 联系模块开关
  STARTER_CONTACT_TITLE: 'Contact Me',
  STARTER_CONTACT_TEXT: 'Tell us about the issues you are facing',
  STARTER_CONTACT_LOCATION_TITLE: 'My Location',
  STARTER_CONTACT_LOCATION_TEXT: 'Heilongjiang, China',
  STARTER_CONTACT_EMAIL_TITLE: 'How can we assist you?',
  STARTER_CONTACT_EMAIL_TEXT: 'lrt2436559745@gmail.com',

  // 嵌入外部表单
  STARTER_CONTACT_MSG_EXTERNAL_URL: 'https://noteforms.com/forms/contact-me-x5kl5r', // 基于NoteForm创建，将留言数据存在Notion中
  //   自定义留言表单
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

  STARTER_FOOTER_SLOGAN: 'A geek in the Unmanned Aircraft System field, a leader with a dream. Interested in control theory & aircraft navigation and decision.',

  // 页脚三列菜单组
  STARTER_FOOTER_LINK_GROUP: [
    {
      TITLE: 'About Me',
      LINK_GROUP: [
        { TITLE: 'Official Website', URL: '/#home' },
        { TITLE: 'Documentation', URL: 'https://docs.phillweston.com/about' },
        { TITLE: 'Help & Support', URL: 'https://docs.phillweston.com/article/how-to-question' },
        { TITLE: 'Partnership Application', URL: 'https://docs.phillweston.com/my-service' }
      ]
    },
    {
      TITLE: 'Case Studies',
      LINK_GROUP: [
        { TITLE: 'Disk Array Failure Prediction System', URL: 'https://docs.phillweston.com/article/lstm-deep-transfer-learning-disk-array-failure-prediction' },
        { TITLE: 'UAV Line Inspection System Based on Deep Learning', URL: 'https://docs.phillweston.com/article/deep-learning-drone-inspection-system' },
        { TITLE: 'Intelligent Aerial Surveillance System', URL: 'https://docs.phillweston.com/article/yichi-defense-system-comprehensive-control-dynamics' },
        { TITLE: 'High-altitude Paint Repair Drone', URL: 'https://docs.phillweston.com/article/weiyuan-wing-high-altitude-painting-drone' },
        { TITLE: 'Urban and Rural Intelligent Logistics UAV System', URL: 'https://docs.phillweston.com/article/hongyun-smart-logistics-drone-system-urban-rural' },
        { TITLE: 'Drone-based Intelligent Scenic Garbage Cleaning System', URL: 'https://docs.phillweston.com/article/drone-based-intelligent-scenic-area-waste-cleanup-system' },
        { TITLE: 'Remote All-round Real-time Environmental Monitoring System', URL: 'https://docs.phillweston.com/article/remote-full-spectrum-real-time-environment-monitoring-system' },
        { TITLE: 'UAV Integrated Education System', URL: 'https://docs.phillweston.com/article/smart-manufacturing-future-drone-integrated-education-system' },
        { TITLE: 'Guardian of the Sky Eye', URL: 'https://docs.phillweston.com/article/sky-eye-guardian' },
        { TITLE: 'Software-defined Radio-based Anti-drone System', URL: 'https://docs.phillweston.com/article/drone-nemesis-software-radio-based-anti-drone-system' },
      ]
    },
    {
      TITLE: 'For References',
      LINK_GROUP: [
        { TITLE: 'EE Vocabulary Preview', URL: 'https://docs.phillweston.com/article/ee-vocabulary-preview' },
        { TITLE: 'MEMS IMU Device Selection Reference Table (Partial)', URL: 'https://docs.phillweston.com/article/mems-imu-selection-reference-table' },
        { TITLE: 'List of Papers Related to Shadowsocks', URL: 'https://docs.phillweston.com/article/list-of-papers-related-to-shadowsocks' },
        { TITLE: '.NET Framework Regular Expressions', URL: 'https://docs.phillweston.com/article/dotnet-framework-regular-expressions' },
      ]
    }
  ],

  STARTER_FOOTER_BLOG_LATEST_TITLE: 'Latest Articles',

  STARTER_FOOTER_PRIVACY_POLICY_TEXT: 'Privacy Policy',
  STARTER_FOOTER_PRIVACY_POLICY_URL: '/privacy-policy',

  STARTER_FOOTER_PRIVACY_LEGAL_NOTICE_TEXT: 'Legacy Notice',
  STARTER_FOOTER_PRIVACY_LEGAL_NOTICE_URL: '/legacy-notice',

  STARTER_FOOTER_PRIVACY_TERMS_OF_SERVICE_TEXT: 'Terms of Use',
  STARTER_FOOTER_PRIVACY_TERMS_OF_SERVICE_URL: '/terms-of-use',

  // 404页面的提示语
  STARTER_404_TITLE: 'We seem to be unable to find the page you are looking for.',
  STARTER_404_TEXT: 'Sorry! The page you are looking for does not exist. It may have been moved or deleted.',
  STARTER_404_BACK: 'Back to Homepage',

  STARTER_POST_REDIRECT_ENABLE: true, // 默認開啟重定向
  STARTER_POST_REDIRECT_URL: 'https://docs.phillweston.com', // 重定向域名
  STARTER_NEWSLETTER: process.env.NEXT_PUBLIC_THEME_STARTER_NEWSLETTER || true // 是否开启邮件订阅 请先配置mailchimp功能 https://docs.tangly1024.com/article/notion-next-mailchimp
}
export default CONFIG
