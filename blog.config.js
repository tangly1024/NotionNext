const BLOG = {
  title: '小唐笔记', // 站点标题
  description: '分享编程技术与记录生活', // 站点描述
  author: 'tangly1024', // 作者
  bio: '一个普通的干饭人🍚', // 作者简介
  email: 'tlyong1992@hotmail.com', // 联系邮箱
  link: 'https://tangly1024.com', // 网站地址
  keywords: ['Notion', '写作', '博客'], // 网站关键词
  lang: 'zh-CN', // ['zh-CN','en-US'] default lang => see /lib/lang.js for more.
  beian: '闽ICP备20010331号', // 备案号
  notionPageId: process.env.NOTION_PAGE_ID || 'bee1fccfa3bd47a1a7be83cc71372d83', // Important page_id！！！
  notionAccessToken: process.env.NOTION_ACCESS_TOKEN || '', // Useful if you prefer not to make your database public
  appearance: 'auto', // ['light', 'dark', 'auto'],
  font: 'font-serif tracking-wider subpixel-antialiased', // 文章字体 ['font-sans', 'font-serif', 'font-mono'] @see https://www.tailwindcss.cn/docs/font-family
  lightBackground: '#eeeeee', // use hex value, don't forget '#' e.g #fffefc
  darkBackground: '#111827', // use hex value, don't forget '#'
  path: '', // leave this empty unless you want to deploy in a folder
  since: 2020, // if leave this empty, current year will be used.
  postListStyle: 'page', // ['page','scroll] 文章列表样式:页码分页、单页滚动加载
  postsPerPage: 6, // post counts per page
  previewLines: 12, // 预览博客行数
  sortByDate: false,
  socialLink: { // 社交链接，如不需要展示可以留空白，例如 weibo:''
    weibo: 'https://weibo.com/tangly1024',
    twitter: 'https://twitter.com/troy1024_1',
    github: 'https://github.com/tangly1024',
    telegram: 'https://t.me/tangly_1024'
  },
  comment: { // 评论插件，支持 gitalk, utterances, cusdis
    provider: 'gitalk', // 不需要则留空白
    gitalkConfig: {
      repo: 'NotionNext', // The repository of store comments
      owner: 'tangly1024',
      admin: ['tangly1024'],
      clientID: process.env.GITALK_ID || 'be7864a16b693e256f8f',
      clientSecret: process.env.GITALK_SECRET || 'dbd0f6d9ceea8940f6ed20936b415274b8fe66a2',
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
    gitter: '', // gitter聊天室
    DaoVoiceId: '', // DaoVoice http://dashboard.daovoice.io/get-started
    TidioId: '' // https://www.tidio.com/
  },
  // --- 高级设置
  analytics: { // 文章访问量统计
    busuanzi: true, // 展示网站阅读量、访问数 see http://busuanzi.ibruce.info/
    provider: 'ga', // 支持 Google Analytics and Ackee, please fill with 'ga' or 'ackee', leave it empty to disable it.
    baiduAnalytics: 'f683ef76f06bb187cbed5546f6f28f28', // e.g only need xxxxx -> https://hm.baidu.com/hm.js?[xxxxx]
    cnzzAnalytics: '', // 站长统计id only need xxxxxxxx -> https://s9.cnzz.com/z_stat.php?id=[xxxxxxxx]&web_id=[xxxxxxx]
    gaConfig: {
      measurementId: 'G-68EK0W049N' // e.g: G-XXXXXXXXXX
    },
    ackeeConfig: {
      tracker: '', // e.g 'https://ackee.tangly1024.net/tracker.js'
      dataAckeeServer: '', // e.g https://ackee.tangly1024.net , don't end with a slash
      domainId: '' // e.g '0e2257a8-54d4-4847-91a1-0311ea48cc7b'
    }
  },
  seo: {
    googleSiteVerification: '' // Remove the value or replace it with your own google site verification code
  },
  googleAdsenseId: 'ca-pub-2708419466378217', // 谷歌广告ID
  isProd: process.env.VERCEL_ENV === 'production'// distinguish between development and production environment (ref: https://vercel.com/docs/environment-variables#system-environment-variables)
}
// export default BLOG
module.exports = BLOG
