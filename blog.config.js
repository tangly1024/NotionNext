const BLOG = {
  title: '小唐笔记',
  author: 'tangly1024',
  email: 'tlyong1992@hotmail.com',
  link: 'https://tangly1024.com',
  description: '分享编程技术与记录生活',
  keywords: ['Notion', '写作', '博客'],
  home: { // 首页
    showHomeBanner: true, // 首页是否显示大图及标语 [true,false]
    homeBannerStrings: ['Hi，我是一个程序员', 'Hi，我是一个打工人', 'Hi，我是一个干饭人', '欢迎来到我的博客🎉'], // 首页大图标语文字
    homeBannerImage: './bg_image.jpg' // 首图
  },
  lang: 'zh-CN', // ['zh-CN','en-US'] default lang => see /lib/lang.js for more.
  notionPageId: process.env.NOTION_PAGE_ID || 'bee1fccfa3bd47a1a7be83cc71372d83', // Important page_id！！！
  notionAccessToken: process.env.NOTION_ACCESS_TOKEN || '', // Useful if you prefer not to make your database public
  appearance: 'auto', // ['light', 'dark', 'auto'],
  font: 'font-sans tracking-wider subpixel-antialiased', // 文章字体 ['font-sans', 'font-serif', 'font-mono'] @see https://www.tailwindcss.cn/docs/font-family
  lightBackground: '#ffffff', // use hex value, don't forget '#' e.g #fffefc
  darkBackground: '#111827', // use hex value, don't forget '#'
  path: '', // leave this empty unless you want to deploy in a folder
  since: 2020, // if leave this empty, current year will be used.
  postsPerPage: 6, // post counts per page
  sortByDate: false,
  autoCollapsedNavBar: true, // the automatically collapsed navigation bar
  menu: { // menu config
    showAbout: false,
    showCategory: true,
    showTag: true,
    showArchive: true,
    showSearch: true
  },
  widget: {
    showPet: false, // 是否显示宠物挂件
    petLink: 'https://cdn.jsdelivr.net/npm/live2d-widget-model-wanko@1.0.5/assets/wanko.model.json', // 模型地址 @see https://github.com/xiazeyu/live2d-widget-models
    showToTop: true,
    showToBottom: true,
    showDarkMode: true,
    showToc: true,
    showShareBar: false,
    showRelatePosts: false,
    showCopyRight: false
  },
  socialLink: { // 社交链接
    weibo: 'https://weibo.com/tangly1024',
    twitter: 'https://twitter.com/troy1024_1',
    github: 'https://github.com/tangly1024',
    telegram: 'https://t.me/tangly_1024'
  },
  analytics: {
    provider: 'ga', // Currently we support Google Analytics and Ackee, please fill with 'ga' or 'ackee', leave it empty to disable it.
    ackeeConfig: {
      tracker: '', // e.g 'https://ackee.tangly1024.net/tracker.js'
      dataAckeeServer: '', // e.g https://ackee.tangly1024.net , don't end with a slash
      domainId: '' // e.g '0e2257a8-54d4-4847-91a1-0311ea48cc7b'
    },
    gaConfig: {
      measurementId: 'G-68EK0W049N' // e.g: G-XXXXXXXXXX
    },
    baiduAnalytics: 'f683ef76f06bb187cbed5546f6f28f28', // e.g only need xxxxx -> https://hm.baidu.com/hm.js?[xxxxx]
    busuanzi: true, // 展示网站阅读量访问数 see http://busuanzi.ibruce.info/
    cnzzAnalytics: '' // 站长统计id only need xxxxxxxx -> https://s9.cnzz.com/z_stat.php?id=[xxxxxxxx]&web_id=[xxxxxxx]
  },
  comment: { //  support provider: gitalk, utterances, cusdis
    provider: '', // leave it empty if you don't need any comment plugin
    gitalkConfig: {
      repo: 'NotionNext', // The repository of store comments
      owner: 'tangly1024',
      admin: ['tangly1024'],
      clientID: 'be7864a16b693e256f8f',
      clientSecret: 'dbd0f6d9ceea8940f6ed20936b415274b8fe66a2',
      distractionFreeMode: false
    },
    cusdisConfig: {
      appId: '445ba48e-f751-487f-b22f-cdbe3310d28f', // data-app-id
      host: 'https://cusdis.com', // data-host, change this if you're using self-hosted version
      scriptSrc: 'https://cusdis.com/js/cusdis.es.js' // change this if you're using self-hosted version
    },
    utterancesConfig: {
      repo: 'tangly1024/NotionNext'
    },
    DaoVoiceId: '', // DaoVoice http://dashboard.daovoice.io/get-started
    TidioId: '' // https://www.tidio.com/
  },
  seo: {
    googleSiteVerification: '' // Remove the value or replace it with your own google site verification code
  },
  googleAdsenseId: 'ca-pub-2708419466378217', // 谷歌广告ID
  isProd: process.env.VERCEL_ENV === 'production'// distinguish between development and production environment (ref: https://vercel.com/docs/environment-variables#system-environment-variables)
}
// export default BLOG
module.exports = BLOG
