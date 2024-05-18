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
    STARTER_HERO_TITLE_1: '持续稳定且深入指导修行的答疑服务', // 英雄区文字
    STARTER_HERO_TITLE_2: '通过答疑服务，让您不再迷茫和焦虑', // 英雄区文字
    // 英雄区两个按钮，如果TEXT留空则隐藏按钮
    STARTER_HERO_BUTTON_1_TEXT: '我的博客', // 英雄区按钮
    STARTER_HERO_BUTTON_1_URL:
      'https://buxiantang.top/archive', // 英雄区按钮
    STARTER_HERO_BUTTON_2_TEXT: '在BiliBili上关注', // 英雄区按钮
    STARTER_HERO_BUTTON_2_URL: 'https://space.bilibili.com/265656567', // 英雄区按钮
    STARTER_HERO_BUTTON_2_ICON: '/images/starter/bilibili.svg', // 英雄区按钮2的图标，不需要则留空
  
    STARTER_HERO_PREVIEW_IMAGE: '/images/starter/hero/followers.png', // 产品预览图 ，默认读取public目录下图片
  
    // 顶部右侧导航暗流
    STARTER_NAV_BUTTON_1_TEXT: '',
    STARTER_NAV_BUTTON_1_URL: '',
  
    STARTER_NAV_BUTTON_2_TEXT: '',
    STARTER_NAV_BUTTON_2_URL: '',
  
    // 特性区块
    STARTER_FEATURE_ENABLE: true, // 特性区块开关
    STARTER_FEATURE_TITLE: '优势', // 特性
    STARTER_FEATURE_TEXT_1: '卜仙堂答疑服务的主要优势', // 特性
    STARTER_FEATURE_TEXT_2:
      '卜仙堂的愿景是帮助更多的六道修行者明悟修行之道，在修行路上越走越远，为隐态世界贡献一份微薄之力！ ', // 特性
  
    STARTER_FEATURE_1_TITLE_1: '价格优惠', // 特性1
    STARTER_FEATURE_1_TEXT_1: '考虑存在部分修行者窘困的经济现状，卜仙堂不会设高价；并且您在购买后的一个月内退出，可以为您退费', // 特性1
    STARTER_FEATURE_1_BUTTON_TEXT: '', // 特性1
    STARTER_FEATURE_1_BUTTON_URL: '', // 特性1
  
    STARTER_FEATURE_2_TITLE_1: '理法严谨清晰', // 特性2
    STARTER_FEATURE_2_TEXT_1: '我们的修行理念是“秉万法虽异而归宗”', // 特性2
    STARTER_FEATURE_2_BUTTON_TEXT: '', // 特性2
    STARTER_FEATURE_2_BUTTON_URL:  '', // 特性2
  
    STARTER_FEATURE_3_TITLE_1: '充足的实修经验', // 特性3
    STARTER_FEATURE_3_TEXT_1: '我们修行方法是“学”、“悟”、“证”、“行”', // 特性3
    STARTER_FEATURE_3_BUTTON_TEXT: '', // 特性3
    STARTER_FEATURE_3_BUTTON_URL: '', // 特性3
  
    STARTER_FEATURE_4_TITLE_1: '安全可靠', // 特性4
    STARTER_FEATURE_4_TEXT_1: '我们不会圈堂劫财及限制自由', // 特性4
    STARTER_FEATURE_4_BUTTON_TEXT: '', // 特性4
    STARTER_FEATURE_4_BUTTON_URL: '', // 特性4
  
    // 首页ABOUT区块
    STARTER_ABOUT_ENABLE: true, // ABOUT区块开关
    STARTER_ABOUT_TITLE: '持续稳定且深入指导修行的答疑服务',
    STARTER_ABOUT_TEXT:
      '卜仙堂的愿景是帮助更多的六道修行者明悟修行之道，在修行路上越走越远，为隐态世界贡献一份微薄之力！ <br /> <br /> 因为我们一切以世界本质出发，积累知晓的实修经验，您可以放心的学习了解佛道仙易及丹道理论知识，我们会耐心且专业的回答各种疑问。 <br /> <br />我们希望您能通过答疑服务，掌握“普法”、“查事”两大技能。',
    STARTER_ABOUT_BUTTON_TEXT: '了解更多',
    STARTER_ABOUT_BUTTON_URL: 'https://buxiantang.top/post/buxiantang-Service',
    STARTER_ABOUT_IMAGE_1: '/images/starter/about/wechatex.png',
    STARTER_ABOUT_IMAGE_2: '/images/starter/about/about-image-0.png',
    STARTER_ABOUT_TIPS_1: '160k+',
    STARTER_ABOUT_TIPS_2: '阅读/观看量',
    STARTER_ABOUT_TIPS_3: '已经形成',
  
    // 首页价格区块
    STARTER_PRICING_ENABLE: true, // 价格区块开关
    STARTER_PRICING_TITLE: '价格计划表',
    STARTER_PRICING_TEXT_1: '高性价比的定价计划',
    STARTER_PRICING_TEXT_2:
      '我们制定了灵活的付费模式，您可以按需选择。',

    STARTER_PRICING_1_TITLE: '结缘版',
    STARTER_PRICING_1_PRICE: '90',
    STARTER_PRICING_1_PRICE_CURRENCY: '￥',
    STARTER_PRICING_1_PRICE_PERIOD: '每次',
    STARTER_PRICING_1_HEADER: '内容',
    STARTER_PRICING_1_FEATURES: '点堂查事,解梦,其他答疑解惑,', // 英文逗号隔开
    STARTER_PRICING_1_BUTTON_TEXT: '立即购买',
    STARTER_PRICING_1_BUTTON_URL:
      'https://tangly1024.lemonsqueezy.com/checkout/buy/c1a38a65-362e-44c5-8065-733fee39eb54',

    STARTER_PRICING_2_TITLE: '入门版',
    STARTER_PRICING_2_PRICE: '360',
    STARTER_PRICING_2_PRICE_CURRENCY: '￥',
    STARTER_PRICING_2_PRICE_PERIOD: '每年',
    STARTER_PRICING_2_HEADER: '内容',
    STARTER_PRICING_2_FEATURES: '赠送玄门六爻讲义,内部社群,佛法、道法答疑,经文含义解析,仙道相关,解梦原理,', // 英文逗号隔开
    STARTER_PRICING_2_BUTTON_TEXT: '立即购买',
    STARTER_PRICING_2_BUTTON_URL:
      'https://tangly1024.lemonsqueezy.com/checkout/buy/c1a38a65-362e-44c5-8065-733fee39eb54',
  
    STARTER_PRICING_3_TAG: '推荐',
    STARTER_PRICING_3_TITLE: '普惠版',
    STARTER_PRICING_3_PRICE: '1000',
    STARTER_PRICING_3_PRICE_CURRENCY: '￥',
    STARTER_PRICING_3_PRICE_PERIOD: '每年',
    STARTER_PRICING_3_HEADER: '内容',
    STARTER_PRICING_3_FEATURES: '包含入门版,六爻传授,免费查事,丹道答疑', // 英文逗号隔开
    STARTER_PRICING_3_BUTTON_TEXT: '立即购买',
    STARTER_PRICING_3_BUTTON_URL:
      'https://tangly1024.lemonsqueezy.com/checkout/buy/590ad70a-c3b7-4caf-94ec-9ca27bde06d4',
  
    STARTER_PRICING_4_TITLE: '终生版',
    STARTER_PRICING_4_PRICE: '4800',
    STARTER_PRICING_4_PRICE_CURRENCY: '￥',
    STARTER_PRICING_4_PRICE_PERIOD: '永久',
    STARTER_PRICING_4_HEADER: '功能点',
    STARTER_PRICING_4_FEATURES: '包含普惠版,所有内部书籍免费赠送', // 英文逗号隔开
    STARTER_PRICING_4_BUTTON_TEXT: '立即购买',
    STARTER_PRICING_4_BUTTON_URL:
      'https://tangly1024.lemonsqueezy.com/checkout/buy/df924d66-09dc-42a4-a632-a6b0c5cc4f28',
  
    // 首页用户测评区块
    STARTER_TESTIMONIALS_ENABLE: true, // 测评区块开关
    STARTER_TESTIMONIALS_TITLE: '同修反馈',
    STARTER_TESTIMONIALS_TEXT_1: '我们的付费同修怎么说',
    STARTER_TESTIMONIALS_TEXT_2:
      '大量的修行者通过我们的答疑服务，学习掌握了自然万物生灭轮转规律，以及佛道两门的修行方法，为现在和将来行道上奠定了基础亦或更上一层！',
    STARTER_TESTIMONIALS_STAR_ICON: '/images/starter/testimonials/icon-star.svg', // 评分图标
  
    // 这里不支持CONFIG和环境变量，需要一一修改此处代码。
    STARTER_TESTIMONIALS_ITEMS: [
      {
        STARTER_TESTIMONIALS_ITEM_TEXT:
          '感谢大佬的答疑！之前接触过各种道门法术，却永远不知道究竟修行是什么，让我打开了新的思维大门！ ',
        STARTER_TESTIMONIALS_ITEM_AVATAR:
          '/images/author1.svg',
        STARTER_TESTIMONIALS_ITEM_NICKNAME: 'Ryan_G',
        STARTER_TESTIMONIALS_ITEM_DESCRIPTION: 'Ryan`Log 站长',
        STARTER_TESTIMONIALS_ITEM_URL: 'https://blog.gaoran.xyz/'
      },
      {
        STARTER_TESTIMONIALS_ITEM_TEXT:
          '很喜欢这个主题，本代码小白用三天台风假期搭建出来了，还根据大佬的教程弄了自定义域名，十分感谢，已请喝咖啡~',
        STARTER_TESTIMONIALS_ITEM_AVATAR:
          '/images/author2.svg',
        STARTER_TESTIMONIALS_ITEM_NICKNAME: 'Asenkits',
        STARTER_TESTIMONIALS_ITEM_DESCRIPTION: '阿森的百宝袋 站长',
        STARTER_TESTIMONIALS_ITEM_URL: 'https://asenkits.top/'
      },
      {
        STARTER_TESTIMONIALS_ITEM_TEXT:
          '呜呜呜，经过一个下午的努力，终于把博客部署好啦，非常感谢Tangly1024大佬的框架和教程，这是我有生之年用过的最好用的博客框架┭┮﹏┭┮。从今之后，我就可以在自己的博客里bb啦，( •̀ ω •́ )y ',
        STARTER_TESTIMONIALS_ITEM_AVATAR:
          '/images/author3.svg',
        STARTER_TESTIMONIALS_ITEM_NICKNAME: 'DWIND',
        STARTER_TESTIMONIALS_ITEM_DESCRIPTION: '且听风吟 站长',
        STARTER_TESTIMONIALS_ITEM_URL: 'https://www.dwind.top/'
      },
      {
        STARTER_TESTIMONIALS_ITEM_TEXT:
          '感谢提供这么好的项目哈哈 之前一直不知道怎么部署(别的项目好难好复杂)这个相对非常简单 新手非常友好哦',
        STARTER_TESTIMONIALS_ITEM_AVATAR:
          '/images/author4.svg',
        STARTER_TESTIMONIALS_ITEM_NICKNAME: '迪升disheng ',
        STARTER_TESTIMONIALS_ITEM_DESCRIPTION: 'AI资源分享 Blog',
        STARTER_TESTIMONIALS_ITEM_URL: 'https://blog.disheng.org/'
      },
      {
        STARTER_TESTIMONIALS_ITEM_TEXT:
          '灰常感谢大佬的博客项目，能将博客和notion结合起来，这一直是我挺期待的博客模式。',
        STARTER_TESTIMONIALS_ITEM_AVATAR:
          '/images/author5.svg',
        STARTER_TESTIMONIALS_ITEM_NICKNAME: 'AnJhon',
        STARTER_TESTIMONIALS_ITEM_DESCRIPTION: 'Anjhon`s Blog 站长',
        STARTER_TESTIMONIALS_ITEM_URL: 'https://www.anjhon.top'
      },
      {
        STARTER_TESTIMONIALS_ITEM_TEXT: '用好久了，太感谢了',
        STARTER_TESTIMONIALS_ITEM_AVATAR:
          '/images/author6.svg',
        STARTER_TESTIMONIALS_ITEM_NICKNAME: 'LUCEN',
        STARTER_TESTIMONIALS_ITEM_DESCRIPTION: 'LUCEN考验辅导 站长',
        STARTER_TESTIMONIALS_ITEM_URL: 'https://www.lucenczz.top/'
      }
    ],
  
    //   FAQ 常见问题模块
    STARTER_FAQ_ENABLE: true, // 常见问题模块开关
    STARTER_FAQ_TITLE: '常见问题解答',
    STARTER_FAQ_TEXT_1: '有任何问题吗？请看这里',
    STARTER_FAQ_TEXT_2: '我们收集了常见的用户疑问',
  
    STARTER_FAQ_1_QUESTION: 'NotionNext有帮助文档吗？',
    STARTER_FAQ_1_ANSWER:
      'NotionNext提供了<a href="https://docs.tangly1024.com/about" className="underline">帮助文档</a>，操作<a href="https://www.bilibili.com/video/BV1fM4y1L7Qi/" className="underline">演示视频</a>，以及<a href="https://docs.tangly1024.com/article/chat-community" className="underline">交流社群</a>来协助您完成网站的搭建部署',
  
    STARTER_FAQ_2_QUESTION: '部署后要如何编写文章？',
    STARTER_FAQ_2_ANSWER:
      '您可以在Notion中之间添加或修改类型为Post的页面，内容将被实时同步在站点中，详情参考<a className="underline" href="https://docs.tangly1024.com/article/start-to-write">《帮助文档》</a>',
  
    STARTER_FAQ_3_QUESTION: '站点部署失败，更新失败？',
    STARTER_FAQ_3_ANSWER:
      '通常是配置修改错误导致，请检查配置或者重试操作步骤，或者通过Vercel后台的Deployments中找到错误日志，并向网友求助',
  
    STARTER_FAQ_4_QUESTION: '文章没有实时同步？',
    STARTER_FAQ_4_ANSWER:
      '先检查Notion_Page_ID是否正确配置，其次由于博客的每个页面都有独立缓存，刷新网页后即可解决',
  
    // 团队成员区块
    STARTER_TEAM_ENABLE: true, // 团队成员区块开关
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
    STARTER_BLOG_TITLE: '卜仙堂的博客',
    STARTER_BLOG_COUNT: 3, // 首页博文区块默认展示前3篇文章
    STARTER_BLOG_TEXT_1: '最近的动态',
    STARTER_BLOG_TEXT_2:
      '这里会发布一些关于卜仙堂的最新动态，包括我的计划、新的内容、新的博文！',
  
    // 联系模块
    STARTER_CONTACT_ENABLE: true, // 联系模块开关
    STARTER_CONTACT_TITLE: '联系我们',
    STARTER_CONTACT_TEXT: '告诉我们您遇到的问题',
    STARTER_CONTACT_LOCATION_TITLE: '我们的位置',
    STARTER_CONTACT_LOCATION_TEXT: '中国，陕西',
    STARTER_CONTACT_EMAIL_TITLE: '我们如何帮助您？',
    STARTER_CONTACT_EMAIL_TEXT: 'tiengming@qq.com',
  
    // 嵌入外部表单
    STARTER_CONTACT_MSG_EXTERNAL_URL: 'https://noteforms.com/forms/yfctc7', // 基于NoteForm创建，将留言数据存在Notion中
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
  
    STARTER_FOOTER_SLOGAN: '我们通过技术为品牌和公司创造数字体验。',
  
    // 页脚三列菜单组
    STARTER_FOOTER_LINK_GROUP: [
      {
        TITLE: '关于我们',
        LINK_GROUP: [
          { TITLE: '官方主页', URL: '/#home' },
          { TITLE: '操作文档', URL: 'https://docs.tangly1024.com/about' },
          {
            TITLE: '帮助支持',
            URL: 'https://docs.tangly1024.com/article/how-to-question'
          },
          {
            TITLE: '合作申请',
            URL: 'https://docs.tangly1024.com/article/my-service'
          }
        ]
      },
      {
        TITLE: '功能特性',
        LINK_GROUP: [
          {
            TITLE: '部署指南',
            URL: 'https://docs.tangly1024.com/article/vercel-deploy-notion-next'
          },
          {
            TITLE: '升级指南',
            URL: 'https://docs.tangly1024.com/article/how-to-update-notionnext'
          },
          { TITLE: '最新版本', URL: 'https://docs.tangly1024.com/article/latest' }
        ]
      },
      {
        TITLE: 'Notion写作',
        LINK_GROUP: [
          {
            TITLE: 'Notion开始写作',
            URL: 'https://docs.tangly1024.com/article/start-to-write'
          },
          {
            TITLE: '快捷键提升效率',
            URL: 'https://docs.tangly1024.com/article/notion-short-key'
          },
          {
            TITLE: '中国大陆使用Notion',
            URL: 'https://docs.tangly1024.com/article/notion-faster'
          }
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
    STARTER_POST_REDIRECT_URL: 'https://blog.tangly1024.com', // 重定向域名
    STARTER_NEWSLETTER: process.env.NEXT_PUBLIC_THEME_STARTER_NEWSLETTER || false // 是否开启邮件订阅 请先配置mailchimp功能 https://docs.tangly1024.com/article/notion-next-mailchimp
  }
  export default CONFIG
