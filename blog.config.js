// 注: 配置文件可以读取Vercel的环境变量，配置方式参考：https://docs.tangly1024.com/zh/features/personality
const BLOG = Object.assign({
  TITLE: 'NotionNext BLOG', // 站点标题
  DESCRIPTION: '这是一个由NotionNext生成的站点', // 站点描述
  AUTHOR: 'tangly1024', // 作者
  BIO: '一个普通的干饭人🍚', // 作者简介
  LINK: 'https://tangly1024.com', // 网站地址
  NOTION_PAGE_ID: '02ab3b8678004aa69e9e415905ef32a5', // Important page_id！！！Duplicate Template from  https://www.notion.so/tanghh/02ab3b8678004aa69e9e415905ef32a5
  NOTION_ACCESS_TOKEN: '', // Useful if you prefer not to make your database public
  KEYWORDS: 'Notion, 博客', // 网站关键词 英文逗号隔开
  LANG: 'zh-CN', // e.g 'zh-CN','en-US'  see /lib/lang.js for more.
  BEI_AN: '', // 备案号 闽ICP备XXXXXXX
  SINCE: 2020, // if leave this empty, current year will be used.

  APPEARANCE: 'auto', // ['light', 'dark', 'auto'],
  FONT: 'font-serif tracking-wider subpixel-antialiased', // 文章字体 ['font-sans', 'font-serif', 'font-mono'] @see https://www.tailwindcss.cn/docs/font-family
  BACKGROUND_LIGHT: '#eeeeee', // use hex value, don't forget '#' e.g #fffefc
  BACKGROUND_DARK: '#111827', // use hex value, don't forget '#'
  PATH: '', // leave this empty unless you want to deploy in a folder

  POST_LIST_STYLE: 'page', // ['page','scroll] 文章列表样式:页码分页、单页滚动加载
  POST_PREVIEW_LINES: 12, // 预览博客行数
  POSTS_PER_PAGE: 6, // post counts per page
  POSTS_SORT_BY_DATE: false, // 是否强制按时间排序，否则默认由notion排序文章

  // 社交链接，不需要可留空白，例如 CONTACT_WEIBO:''
  CONTACT_EMAIL: 'tlyong1992@hotmail.com', // 联系邮箱
  CONTACT_WEIBO: 'https://weibo.com/tangly1024',
  CONTACT_TWITTER: 'https://twitter.com/troy1024_1',
  CONTACT_GITHUB: 'https://github.com/tangly1024',
  CONTACT_TELEGRAM: 'https://t.me/tangly_1024',

  COMMENT_PROVIDER: '', // 支持 gitalk, utterances, cusdis

  COMMENT_GITALK_REPO: '', // e.g NotionNext
  COMMENT_GITALK_OWNER: '', // e.g tangly1024
  COMMENT_GITALK_ADMIN: '', // e.g 'tangly1024'
  COMMENT_GITALK_CLIENT_ID: '',
  COMMENT_GITALK_CLIENT_SECRET: '',
  COMMENT_GITALK_DISTRACTION_FREE_MODE: false,

  COMMENT_CUSDIS_APP_ID: '', // data-app-id
  COMMENT_CUSDIS_HOST: 'https://cusdis.com', // data-host, change this if you're using self-hosted version
  COMMENT_CUSDIS_SCRIPT_SRC: 'https://cusdis.com/js/cusdis.es.js', // change this if you're using self-hosted version

  COMMENT_UTTERRANCES_REPO: '', // e.g 'tangly1024/NotionNext'

  COMMENT_GITTER_ENABLE: false, // gitter see https://gitter.im/
  COMMENT_GITTER_ROOM: '', // gitter聊天室

  COMMENT_DAO_VOICE_ENABLE: false, // DaoVoice see http://dashboard.daovoice.io/get-started
  COMMENT_DAO_VOICE_ID: '', // DaoVoice http://dashboard.daovoice.io/get-started

  COMMENT_TIDIO_ENABLE: false, // https://www.tidio.com/
  COMMENT_TIDIO_ID: '', // [tidio_id] -> //code.tidio.co/[tidio_id].js

  //  站点统计

  ANALYTICS_BUSUANZI_ENABLE: true, // 展示网站阅读量、访问数 see http://busuanzi.ibruce.info/

  ANALYTICS_BAIDU_ENABLE: false,
  ANALYTICS_BAIDU_ID: '', // e.g 只需要填写百度统计的id，[baidu_id] -> https://hm.baidu.com/hm.js?[baidu_id]

  ANALYTICS_CNZZ_ENABLE: false,
  ANALYTICS_CNZZ_ID: '', // 只需要填写站长统计的id, [cnzz_id] -> https://s9.cnzz.com/z_stat.php?id=[cnzz_id]&web_id=[cnzz_id]

  ANALYTICS_GOOGLE_ENABLE: false,
  ANALYTICS_GOOGLE_ID: '', // 谷歌Analytics的id e.g: G-XXXXXXXXXX

  ANALYTICS_ACKEE_ENABLE: false,
  ANALYTICS_ACKEE_TRACKER: '', // e.g 'https://ackee.tangly1024.net/tracker.js'
  ANALYTICS_ACKEE_DATA_SERVER: '', // e.g https://ackee.tangly1024.net , don't end with a slash
  ANALYTICS_ACKEE_DOMAIN_ID: '', // e.g '0e2257a8-54d4-4847-91a1-0311ea48cc7b'

  SEO_GOOGLE_SITE_VERIFICATION: '', // Remove the value or replace it with your own google site verification code

  GOOGLE_ADSENSE_ENABLE: false,
  GOOGLE_ADSENSE_ID: '', // 谷歌广告ID e.g ca-pub-xxxxxxxxxxxxxxxx
  isProd: process.env.VERCEL_ENV === 'production' // distinguish between development and production environment (ref: https://vercel.com/docs/environment-variables#system-environment-variables)
}, JSON.parse(JSON.stringify(process.env)))

module.exports = BLOG
