/**
 * 另一个落地页主题
 */
const CONFIG = {
  PROXIO_WELCOME_COVER_ENABLE: true, //是否显示页面进入的欢迎文字
  PROXIO_WELCOME_TEXT: 'Click Anywhere to Start', // 欢迎文字，留空则不启用

  // 英雄区块导航
  PROXIO_HERO_ENABLE: true, // 开启英雄区
  PROXIO_HERO_TITLE_1: 'Explore the worlds I design.', // 英雄区文字
  PROXIO_HERO_TITLE_2: 'My goal is to dedicate all my life to creating engaging games that millions of people love.', // 英雄区文字
  // 英雄区两个按钮，如果TEXT留空则隐藏按钮
  PROXIO_HERO_BUTTON_1_TEXT: 'View All My Projects', // 英雄区按钮
  PROXIO_HERO_BUTTON_1_URL: '/archive', // 英雄区按钮
  PROXIO_HERO_BUTTON_2_TEXT: '', // 英雄区按钮
  PROXIO_HERO_BUTTON_2_URL: 'https://github.com/tangly1024/NotionNext', // 英雄区按钮
  PROXIO_HERO_BUTTON_2_ICON: '/images/starter/github-mark.svg', // 英雄区按钮2的图标，不需要则留空

  // 英雄区配图，如需隐藏，改为空值即可 ''
  PROXIO_HERO_BANNER_IMAGE: '', // hero区背景，默认是获取Notion背景，如需另外配置图片可以填写在这里
  PROXIO_HERO_BANNER_IFRAME_URL: '', // hero背景区内嵌背景网页 ，可以配置一个网页地址，例如动画网页https://my.spline.design/untitled-b0c6e886227646c34afc82cdc6de4ca2/

  // 文章区块
  PROXIO_BLOG_ENABLE: true, // 首页博文区块开关
  PROXIO_BLOG_TITLE: 'Featured Projects',
  PROXIO_BLOG_COUNT: 4, // 首页博文区块展示前4篇文章
  PROXIO_BLOG_TEXT_1: 'Explore my latest selected works',

  // 区块默认内容显示文章的summary文本，但也支持用自定义图片或logo德国替换掉占位显示内容
  PROXIO_BLOG_PLACEHOLDER_IMG_URL_1: '', // 填写要替换成的图片，支持图床或直接上传到项目中，示例  /images/feature-1.webp
  PROXIO_BLOG_PLACEHOLDER_IMG_URL_2: '',
  PROXIO_BLOG_PLACEHOLDER_IMG_URL_3: '',
  PROXIO_BLOG_PLACEHOLDER_IMG_URL_4: '',

  PROXIO_ANNOUNCEMENT_ENABLE: false, //公告文字区块

  // 特性区块
  PROXIO_FEATURE_ENABLE: true, // 特性区块开关
  PROXIO_FEATURE_TITLE: 'Why Choose Me',
  PROXIO_FEATURE_TEXT_1: 'I design systems that are thoughtful, engaging, and player-centered.',
  PROXIO_FEATURE_TEXT_2: 'My work emphasizes clarity, iteration, and collaboration across disciplines.',

  // 特性1
  PROXIO_FEATURE_1_ICON_CLASS: 'fa-solid fa-stopwatch', // fas图标
  PROXIO_FEATURE_1_ICON_IMG_URL: '', // 图片图标选填，默认是fas图标，如果需要图片图标可以填写图片地址，示例/avatar.png
  PROXIO_FEATURE_1_TITLE_1: 'Efficient Prototyping',
  PROXIO_FEATURE_1_TEXT_1:
    'I build fast, functional prototypes in Unity and Unreal to validate mechanics and iterate on gameplay loops.',

  PROXIO_FEATURE_2_ICON_CLASS: 'fa-solid fa-comments',
  PROXIO_FEATURE_2_ICON_IMG_URL: '',
  PROXIO_FEATURE_2_TITLE_1: 'Collaborative Workflow',
  PROXIO_FEATURE_2_TEXT_1: 'Experienced in working with artists and programmers, translating design intentions into clear documentation and actionable systems.',

  PROXIO_FEATURE_3_ICON_CLASS: 'fa-solid fa-search',
  PROXIO_FEATURE_3_ICON_IMG_URL: '',
  PROXIO_FEATURE_3_TITLE_1: 'Detail-Oriented Design',
  PROXIO_FEATURE_3_TEXT_1:
    'From puzzle pacing to interaction rules, I polish every detail to ensure coherent player experience and emotional impact.',

  PROXIO_FEATURE_BUTTON_TEXT: 'View All My Projects', // 按钮文字
  PROXIO_FEATURE_BUTTON_URL: '/archive', // 按钮跳转

  // 首页生涯区块
  PROXIO_CAREER_ENABLE: true, // 区块开关
  PROXIO_CAREER_TITLE: 'Career',
  PROXIO_CAREER_TEXT: 'Here is an overview of my academic and professional journey',

  // 生涯内容卡牌 ，title是标题 ，bio是备注，text是详情
  PROXIO_CAREERS: [
    {
      title: 'Hangzhou Dianzi University — B.Eng. in Digital Media Technology',
      bio: '2021 – 2025',
      text: 'During my undergraduate studies, I built a strong foundation in game development, system design, and computer graphics. I led multiple team projects, explored gameplay prototyping, and developed a passion for creating mechanics-driven and emotionally engaging interactive experiences.'
    },
    {
      title: 'Morefun Studios, Tencent Games — Game Client Development Intern',
      bio: '2024',
      text: 'At Tencent Morefun Studios, I contributed to Unity-based gameplay systems, implemented small-scale features, and collaborated closely with designers and programmers. I also independently designed and built a two-player co-op puzzle prototype, strengthening my understanding of production workflows and cross-disciplinary collaboration.'
    },
    {
      title: 'Northeastern University — M.S. in Game Science and Design',
      bio: '2025 – Present',
      text: 'Currently pursuing graduate studies focused on gameplay systems, research-driven design, and prototyping across Unity and Unreal Engine. My work explores mechanical depth, narrative pacing, and player psychology, supported by hands-on coursework, collaborative projects, and iterative design methods.'
    }
  ],

  // 首页用户测评区块
  PROXIO_TESTIMONIALS_ENABLE: true, // 测评区块开关
  PROXIO_TESTIMONIALS_TITLE: 'Player Reviews',
  PROXIO_TESTIMONIALS_TEXT_1: 'What players are saying about my game Phototaxis...',
  PROXIO_TESTIMONIALS_TEXT_2:
    'Phototaxis received encouraging feedback from players during the TapTap Spotlight GameJam.',

  // 用户测评处的跳转按钮
  PROXIO_TESTIMONIALS_BUTTON_URL: 'https://www.taptap.cn/app/725427',
  PROXIO_TESTIMONIALS_BUTTON_TEXT: 'Game Product Page',

  // 这里不支持CONFIG和环境变量，需要一一修改此处代码。
  PROXIO_TESTIMONIALS_ITEMS: [
    {
      PROXIO_TESTIMONIALS_ITEM_TEXT:
        'A really fun game — surprisingly addictive! Great atmosphere and gameplay combined. ',
      PROXIO_TESTIMONIALS_ITEM_AVATAR:
        '/avatar.png',
      PROXIO_TESTIMONIALS_ITEM_NICKNAME: 'D-00004',
      PROXIO_TESTIMONIALS_ITEM_DESCRIPTION: '',
      PROXIO_TESTIMONIALS_ITEM_URL: ''
    },
    {
      PROXIO_TESTIMONIALS_ITEM_TEXT:
        'One of the most creative pixel-style games I’ve played. Level design is engaging and emotional, with a satisfying challenge curve. Highly recommended — a free indie game worth playing!',
      PROXIO_TESTIMONIALS_ITEM_AVATAR:
        '/avatar.png',
      PROXIO_TESTIMONIALS_ITEM_NICKNAME: 'Asuka',
      PROXIO_TESTIMONIALS_ITEM_DESCRIPTION: '',
      PROXIO_TESTIMONIALS_ITEM_URL: ''
    },
    {
      PROXIO_TESTIMONIALS_ITEM_TEXT:
        'Such a charming game! The little moth is adorable. Creative mechanics, and the difficulty feels just right — even for someone like me who’s bad at action games, haha.',
      PROXIO_TESTIMONIALS_ITEM_AVATAR: '/avatar.png',
      PROXIO_TESTIMONIALS_ITEM_NICKNAME: 'MoMian',
      PROXIO_TESTIMONIALS_ITEM_DESCRIPTION: '',
      PROXIO_TESTIMONIALS_ITEM_URL: ''
    },
    {
      PROXIO_TESTIMONIALS_ITEM_TEXT:
        'Impressively creative. The level design is fun, challenging, and thoughtfully crafted. Even as a 2D pixel game, it has great gameplay value.',
      PROXIO_TESTIMONIALS_ITEM_AVATAR:
        '/avatar.png',
      PROXIO_TESTIMONIALS_ITEM_NICKNAME: 'Harute',
      PROXIO_TESTIMONIALS_ITEM_DESCRIPTION: '',
      PROXIO_TESTIMONIALS_ITEM_URL: ''
    },
    {
      PROXIO_TESTIMONIALS_ITEM_TEXT:
        'Very creative — love it! Keep it up!',
      PROXIO_TESTIMONIALS_ITEM_AVATAR: '/avatar.png',
      PROXIO_TESTIMONIALS_ITEM_NICKNAME: 'ErXiongBuZaiJia',
      PROXIO_TESTIMONIALS_ITEM_DESCRIPTION: '',
      PROXIO_TESTIMONIALS_ITEM_URL: ''
    },
    {
      PROXIO_TESTIMONIALS_ITEM_TEXT: 'Great concept and surprisingly fun to play.',
      PROXIO_TESTIMONIALS_ITEM_AVATAR: '/avatar.png',
      PROXIO_TESTIMONIALS_ITEM_NICKNAME: 'KungFuPanda',
      PROXIO_TESTIMONIALS_ITEM_DESCRIPTION: '',
      PROXIO_TESTIMONIALS_ITEM_URL: ''
    }
  ],

  //   FAQ 常见问题模块
  PROXIO_FAQ_ENABLE: false, // 常见问题模块开关
  PROXIO_FAQ_TITLE: '常见问题解答',
  PROXIO_FAQ_TEXT_1: '有任何问题吗？请看这里',
  PROXIO_FAQ_TEXT_2: '我们收集了常见的用户疑问',
  PROXIO_FAQS: [
    {
      q: 'NotionNext有帮助文档吗？',
      a: 'NotionNext提供了<a href="https://docs.tangly1024.com/about" className="underline">帮助文档</a>，操作<a href="https://www.bilibili.com/video/BV1fM4y1L7Qi/" className="underline">演示视频</a>，以及<a href="https://docs.tangly1024.com/article/chat-community" className="underline">交流社群</a>来协助您完成网站的搭建部署'
    },
    {
      q: '部署后要如何编写文章？',
      a: '您可以在Notion中之间添加或修改类型为Post的页面，内容将被实时同步在站点中，详情参考<a className="underline" href="https://docs.tangly1024.com/article/start-to-write">《帮助文档》</a>'
    },
    {
      q: '站点部署失败，更新失败？',
      a: '通常是配置修改错误导致，请检查配置或者重试操作步骤，或者通过Vercel后台的Deployments中找到错误日志，并向网友求助'
    },
    {
      q: '文章没有实时同步？',
      a: '先检查Notion_Page_ID是否正确配置，其次由于博客的每个页面都有独立缓存，刷新网页后即可解决'
    }
  ],

  // 关于作者区块
  PROXIO_ABOUT_ENABLE: true, // 关于作者区块区块开关
  PROXIO_ABOUT_TITLE: 'About me',
  PROXIO_ABOUT_TEXT_1: 'I am a Game Designer Focused on Systems, Interaction and Play Experience',
  PROXIO_ABOUT_TEXT_2:
    'With a background in Digital Media Technology and hands-on experience across Unity, Unreal Engine, and board game systems, I design thoughtful mechanics and player-centered gameplay loops. My work spans system design, gameplay prototyping, blueprint scripting, level design, and narrative interaction, aiming to create experiences that are mechanically engaging and emotionally resonant.',
  PROXIO_ABOUT_PHOTO_URL: '/Ricky.jpg',
  PROXIO_ABOUT_KEY_1: 'Game Design Experience (yrs)',
  PROXIO_ABOUT_VAL_1: '4+',
  PROXIO_ABOUT_KEY_2: 'Engines Worked In',
  PROXIO_ABOUT_VAL_2: 'Unity, Unreal Engine 5',
  PROXIO_ABOUT_KEY_3: 'Projects Completed',
  PROXIO_ABOUT_VAL_3: '10+',
  PROXIO_ABOUT_KEY_4: 'Game Experience (hrs)',
  PROXIO_ABOUT_VAL_4: ' 10000+',

  PROXIO_ABOUT_BUTTON_URL: 'https://www.linkedin.com/in/ruiqi-wang39',
  PROXIO_ABOUT_BUTTON_TEXT: 'About me',

  // 横向滚动文字
  PROXIO_BRANDS_ENABLE: true, // 滚动文字
  PROXIO_BRANDS: [
    'Gameplay Design',
    'System Design',
    'Programming',
    'Level Design'
  ],

  PROXIO_FOOTER_SLOGAN: 'Play with intention. Design with clarity.',

  // 页脚三列菜单组
  // 页脚菜单
  PROXIO_FOOTER_LINKS: [
    {
      name: '',
      menus: [
        {
          title: '',
          href: ''
        },
        {
          title: '',
          href: ''
        }
      ]
    },
    {
      name: '',
      menus: [
        { title: '', href: '' },
        {
          title: '',
          href: ''
        },
        {
          title: '',
          href: ''
        },
        {
          title: '',
          href: ''
        },
        {
          title: '',
          href: ''
        }
      ]
    }
  ],

  PROXIO_FOOTER_BLOG_LATEST_TITLE: 'Latest Projects',

  PROXIO_FOOTER_PRIVACY_POLICY_TEXT: 'Privacy Policy',
  PROXIO_FOOTER_PRIVACY_POLICY_URL: '/privacy-policy',

  PROXIO_FOOTER_PRIVACY_LEGAL_NOTICE_TEXT: 'Legacy Notice',
  PROXIO_FOOTER_PRIVACY_LEGAL_NOTICE_URL: '/legacy-notice',

  PROXIO_FOOTER_PRIVACY_TERMS_OF_SERVICE_TEXT: 'Users Terms',
  PROXIO_FOOTER_PRIVACY_TERMS_OF_SERVICE_URL: '/terms-of-use',

  // 404页面的提示语
  PROXIO_404_TITLE: 'Lost in the game world?',
  PROXIO_404_TEXT: 'Looks like this page couldn’t load. Let’s get you back to the main menu.',
  PROXIO_404_BACK: 'Return Home',

  // 页面底部的行动呼吁模块
  PROXIO_CTA_ENABLE: false,
  PROXIO_CTA_TITLE: '',
  PROXIO_CTA_TITLE_2: '',
  PROXIO_CTA_DESCRIPTION:
    '访问NotionNext的操作文档，我们提供了详细的教程，帮助你即刻搭建站点',
  PROXIO_CTA_BUTTON: true, // 是否显示按钮
  PROXIO_CTA_BUTTON_URL: '/about',
  PROXIO_CTA_BUTTON_TEXT: '联系我',

  PROXIO_POST_REDIRECT_ENABLE: false, // 默認開啟重定向
  PROXIO_POST_REDIRECT_URL: 'https://blog.tangly1024.com', // 重定向域名
  PROXIO_NEWSLETTER: process.env.NEXT_PUBLIC_THEME_PROXIO_NEWSLETTER || false // 是否开启邮件订阅 请先配置mailchimp功能 https://docs.tangly1024.com/article/notion-next-mailchimp
}
export default CONFIG
