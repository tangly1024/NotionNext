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
      'https://blog.buxiantang.top', // 英雄区按钮
    STARTER_HERO_BUTTON_2_TEXT: '在BiliBili上关注', // 英雄区按钮
    STARTER_HERO_BUTTON_2_URL: 'https://space.bilibili.com/265656567', // 英雄区按钮
    STARTER_HERO_BUTTON_2_ICON: '/images/starter/bilibili.png', // 英雄区按钮2的图标，不需要则留空
  
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
    STARTER_ABOUT_IMAGE_1: '/images/starter/about/wechatex.jpg',
    STARTER_ABOUT_IMAGE_2: '/images/starter/about/about-image-0.jpg',
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
        STARTER_TESTIMONIALS_ITEM_NICKNAME: '同修甲',
        STARTER_TESTIMONIALS_ITEM_DESCRIPTION: '',
        STARTER_TESTIMONIALS_ITEM_URL: ''
      },
      {
        STARTER_TESTIMONIALS_ITEM_TEXT:
          '答疑服务真是太棒了！每次交流都能感受到您的专业，我学习到了在别的地方学不到的知识。非常感谢您的帮助！',
        STARTER_TESTIMONIALS_ITEM_AVATAR:
          '/images/author2.svg',
        STARTER_TESTIMONIALS_ITEM_NICKNAME: '同修乙',
        STARTER_TESTIMONIALS_ITEM_DESCRIPTION: '',
        STARTER_TESTIMONIALS_ITEM_URL: ''
      },
      {
        STARTER_TESTIMONIALS_ITEM_TEXT:
          '虽然我不太善于表达，但您的答疑服务真的让我受益良多。感谢您的耐心解答，让我对佛道仙易有了更清晰的认识',
        STARTER_TESTIMONIALS_ITEM_AVATAR:
          '/images/author3.svg',
        STARTER_TESTIMONIALS_ITEM_NICKNAME: '同修丙',
        STARTER_TESTIMONIALS_ITEM_DESCRIPTION: '',
        STARTER_TESTIMONIALS_ITEM_URL: ''
      },
      {
        STARTER_TESTIMONIALS_ITEM_TEXT:
          '感谢您的答疑服务，让我在修行路上更加坚定。您的专业解答让我受益匪浅，对佛道仙易有了更深刻的理解。',
        STARTER_TESTIMONIALS_ITEM_AVATAR:
          '/images/author4.svg',
        STARTER_TESTIMONIALS_ITEM_NICKNAME: '同修丁',
        STARTER_TESTIMONIALS_ITEM_DESCRIPTION: '',
        STARTER_TESTIMONIALS_ITEM_URL: ''
      },
      {
        STARTER_TESTIMONIALS_ITEM_TEXT:
          '您的答疑服务简直就是我修行路上的指路明灯！每一次的交流都让我茅塞顿开，我对佛道仙易的兴趣更是倍增。',
        STARTER_TESTIMONIALS_ITEM_AVATAR:
          '/images/author5.svg',
        STARTER_TESTIMONIALS_ITEM_NICKNAME: '同修戊',
        STARTER_TESTIMONIALS_ITEM_DESCRIPTION: '',
        STARTER_TESTIMONIALS_ITEM_URL: ''
      },
      {
        STARTER_TESTIMONIALS_ITEM_TEXT: '解答很详细，这让我感到非常安心，学习到了修行的方法。',
        STARTER_TESTIMONIALS_ITEM_AVATAR:
          '/images/author6.svg',
        STARTER_TESTIMONIALS_ITEM_NICKNAME: '同修己',
        STARTER_TESTIMONIALS_ITEM_DESCRIPTION: '',
        STARTER_TESTIMONIALS_ITEM_URL: ''
      }
    ],
  
    //   FAQ 常见问题模块
    STARTER_FAQ_ENABLE: true, // 常见问题模块开关
    STARTER_FAQ_TITLE: '常见问题解答',
    STARTER_FAQ_TEXT_1: '有任何问题吗？请看这里',
    STARTER_FAQ_TEXT_2: '我们收集了常见的用户疑问',
  
    STARTER_FAQ_1_QUESTION: '加入了年付答疑服务的提问是有次数的吗？',
    STARTER_FAQ_1_ANSWER:
      '年付答疑服务是不限制提问次数的，凡有疑问，均可提问，我们会尽可能从问题的底层逻辑讲起，让您充分理解问题的本质，从而更好的应对类似问题',
  
    STARTER_FAQ_2_QUESTION: '我可以通过答疑服务的学习，掌握查事技能、解梦技能，然后自己收费行道吗？',
    STARTER_FAQ_2_ANSWER:
      '卜仙堂的愿景是修行人能够掌握修行方法，可以完成修行回溯的过程，这些技能是应该学习的行道工具，我们不关心您将来收费与否',
  
    STARTER_FAQ_3_QUESTION: '我可以安心的退出答疑服务么？',
    STARTER_FAQ_3_ANSWER:
      '卜仙堂的答疑服务是没有自由限制的，当您提出退出意向时，我们会直接终止答疑服务。我们承诺，我们不会像其他传承那样存在圈堂收编行为',
  
    STARTER_FAQ_4_QUESTION: '卜仙堂有法事化解服务吗？',
    STARTER_FAQ_4_ANSWER:
      '卜仙堂的修行准则是“天道法”，服务的出发点是合乎天道。现在及将来，我们都不会有法事服务',
  
    // 团队成员区块
    STARTER_TEAM_ENABLE: true, // 团队成员区块开关
    STARTER_TEAM_TITLE: '合作伙伴',
    STARTER_TEAM_TEXT_1: '卜仙堂的答疑团队',
    STARTER_TEAM_TEXT_2:
      '<a className="underline" href="https://buxiantang.top">卜仙堂</a>的答疑服务离不开合作伙伴的共同努力',
  
    // 这里不支持CONFIG和环境变量，需要一一修改此处代码。
    STARTER_TEAM_ITEMS: [
      {
        STARTER_TEAM_ITEM_AVATAR:
          '/images/starter/team/jinshan.png',
        STARTER_TEAM_ITEM_NICKNAME: '金山道人',
        STARTER_TEAM_ITEM_DESCRIPTION: ''
      },
      {
        STARTER_TEAM_ITEM_AVATAR: '/images/starter/team/otherteam.png',
        STARTER_TEAM_ITEM_NICKNAME: '欢迎您的加入',
        STARTER_TEAM_ITEM_DESCRIPTION: ''
      },
      {
        STARTER_TEAM_ITEM_AVATAR: '',
        STARTER_TEAM_ITEM_NICKNAME: '',
        STARTER_TEAM_ITEM_DESCRIPTION: ''
      },
      {
        STARTER_TEAM_ITEM_AVATAR: '',
        STARTER_TEAM_ITEM_NICKNAME: '',
        STARTER_TEAM_ITEM_DESCRIPTION: ''
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
    STARTER_CONTACT_MSG_EXTERNAL_URL: 'https://noteforms.com/forms/juh6wg', // 基于NoteForm创建，将留言数据存在Notion中
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
  
    STARTER_FOOTER_SLOGAN: '我们通过答疑方式为隐态世界做贡献！',
  
    // 页脚三列菜单组
    STARTER_FOOTER_LINK_GROUP: [
      {
        TITLE: '关于',
        LINK_GROUP: [
          { TITLE: '官方主页', URL: '/#home' },
          { TITLE: '关于卜仙堂',
            URL: 'https://www.buxiantang.top/post/about'
          },
        ]
      },
      {
        TITLE: '服务特性',
        LINK_GROUP: [
          {
            TITLE: '答疑价格',
            URL: '/#pricing'
          },
          {
            TITLE: '服务优势',
            URL: '#features'
          },
        ]
      },
    ],
  
    STARTER_FOOTER_BLOG_LATEST_TITLE: '最新文章',
  
    STARTER_FOOTER_PRIVACY_POLICY_TEXT: '',
    STARTER_FOOTER_PRIVACY_POLICY_URL: '',
  
    STARTER_FOOTER_PRIVACY_LEGAL_NOTICE_TEXT: '',
    STARTER_FOOTER_PRIVACY_LEGAL_NOTICE_URL: '',
  
    STARTER_FOOTER_PRIVACY_TERMS_OF_SERVICE_TEXT: '',
    STARTER_FOOTER_PRIVACY_TERMS_OF_SERVICE_URL: '',
  
    // 404页面的提示语
    STARTER_404_TITLE: '我们似乎找不到您要找的页面。',
    STARTER_404_TEXT: '抱歉！您要查找的页面不存在。可能已经移动或删除。',
    STARTER_404_BACK: '回到主页',
  
    STARTER_POST_REDIRECT_ENABLE: true, // 默認開啟重定向
    STARTER_POST_REDIRECT_URL: 'https://buxiantang.top', // 重定向域名
    STARTER_NEWSLETTER: process.env.NEXT_PUBLIC_THEME_STARTER_NEWSLETTER || false // 是否开启邮件订阅 请先配置mailchimp功能 https://docs.tangly1024.com/article/notion-next-mailchimp
  }
  export default CONFIG
