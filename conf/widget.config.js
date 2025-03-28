/**
 * 悬浮在网页上的挂件
 */
module.exports = {
  THEME_SWITCH: process.env.NEXT_PUBLIC_THEME_SWITCH || false, // 是否显示切换主题按钮
  // Chatbase 是否显示chatbase机器人 https://www.chatbase.co/
  CHATBASE_ID: process.env.NEXT_PUBLIC_CHATBASE_ID || null,
  // WebwhizAI 机器人 @see https://github.com/webwhiz-ai/webwhiz
  WEB_WHIZ_ENABLED: process.env.NEXT_PUBLIC_WEB_WHIZ_ENABLED || false, // 是否显示
  WEB_WHIZ_BASE_URL:
    process.env.NEXT_PUBLIC_WEB_WHIZ_BASE_URL || 'https://api.webwhiz.ai', // 可以自建服务器
  WEB_WHIZ_CHAT_BOT_ID: process.env.NEXT_PUBLIC_WEB_WHIZ_CHAT_BOT_ID || null, // 在后台获取ID
  DIFY_CHATBOT_ENABLED: process.env.NEXT_PUBLIC_DIFY_CHATBOT_ENABLED || false,
  DIFY_CHATBOT_BASE_URL: process.env.NEXT_PUBLIC_DIFY_CHATBOT_BASE_URL || '',
  DIFY_CHATBOT_TOKEN: process.env.NEXT_PUBLIC_DIFY_CHATBOT_TOKEN || '',

  // 悬浮挂件
  WIDGET_PET: process.env.NEXT_PUBLIC_WIDGET_PET || true, // 是否显示宠物挂件
  WIDGET_PET_LINK:
    process.env.NEXT_PUBLIC_WIDGET_PET_LINK ||
    'https://cdn.jsdelivr.net/npm/live2d-widget-model-wanko@1.0.5/assets/wanko.model.json', // 挂件模型地址 @see https://github.com/xiazeyu/live2d-widget-models
  WIDGET_PET_SWITCH_THEME:
    process.env.NEXT_PUBLIC_WIDGET_PET_SWITCH_THEME || false, // 点击宠物挂件切换博客主题

  SPOILER_TEXT_TAG: process.env.NEXT_PUBLIC_SPOILER_TEXT_TAG || '', // Spoiler文本隐藏功能，如Notion中 [sp]希望被spoiler的文字[sp]，填入[sp] 即可

  // 音乐播放插件
  MUSIC_PLAYER: process.env.NEXT_PUBLIC_MUSIC_PLAYER || false, // 是否使用音乐播放插件
  MUSIC_PLAYER_VISIBLE: process.env.NEXT_PUBLIC_MUSIC_PLAYER_VISIBLE || true, // 是否在左下角显示播放和切换，如果使用播放器，打开自动播放再隐藏，就会以类似背景音乐的方式播放，无法取消和暂停
  MUSIC_PLAYER_AUTO_PLAY:
    process.env.NEXT_PUBLIC_MUSIC_PLAYER_AUTO_PLAY || false, // 是否自动播放，不过自动播放时常不生效（移动设备不支持自动播放）
  MUSIC_PLAYER_LRC_TYPE: process.env.NEXT_PUBLIC_MUSIC_PLAYER_LRC_TYPE || '0', // 歌词显示类型，可选值： 3 | 1 | 0（0：禁用 lrc 歌词，1：lrc 格式的字符串，3：lrc 文件 url）（前提是有配置歌词路径，对 meting 无效）
  MUSIC_PLAYER_CDN_URL:
    process.env.NEXT_PUBLIC_MUSIC_PLAYER_CDN_URL ||
    'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/aplayer/1.10.1/APlayer.min.js',
  MUSIC_PLAYER_ORDER: process.env.NEXT_PUBLIC_MUSIC_PLAYER_ORDER || 'list', // 默认播放方式，顺序 list，随机 random
  MUSIC_PLAYER_AUDIO_LIST: [
    // 示例音乐列表。除了以下配置外，还可配置歌词，具体配置项看此文档 https://aplayer.js.org/#/zh-Hans/
    {
      name: 'Rubia',
      artist: '周深',
      url: 'https://music.163.com/song/media/outer/url?id=1815684465.mp3',
      cover:
        'http://p2.music.126.net/499AYZ3epP1T7GJYvnJZZQ==/109951165671947083.jpg?param=130y130'
    },
    {
      name: '世界赠予我的',
      artist: '王菲',
      url: 'https://music.163.com/song/media/outer/url?id=2668124242.mp3',
      cover:
        'http://p2.music.126.net/jKutIHhQ2lNADGNm4bePTg==/109951170413164832.jpg?param=130y130'
    },
    {
      name: '我怀念的(Live)',
      artist: '孙燕姿',
      url: 'https://music.163.com/song/media/outer/url?id=34200623.mp3',
      cover:
        'http://p1.music.126.net/hIOFATG-3vNyYHOj31Tyew==/109951169829283327.jpg?param=130y130'
    },
    {
      name: '后来',
      artist: '刘若英',
      url: 'https://music.163.com/song/media/outer/url?id=5237728.mp3',
      cover:
        'http://p2.music.126.net/_WOqdHTd8xXyzGZNN-uRTg==/109951167280997242.jpg?param=130y130'
    },
    {
      name: '消愁',
      artist: '毛不易',
      url: 'https://music.163.com/song/media/outer/url?id=569200213.mp3',
      cover:
        'http://p2.music.126.net/vmCcDvD1H04e9gm97xsCqg==/109951163350929740.jpg?param=130y130'
    },
    {
      name: '向云端',
      artist: '小霞 / 海洋Bo',
      url: 'https://music.163.com/song/media/outer/url?id=2049512697.mp3',
      cover:
        'http://p2.music.126.net/TmOHxaGnFNlwNX8aPz66oA==/109951168638913915.jpg?param=130y130'
    },
    {
      name: '成都',
      artist: '赵雷',
      url: 'https://music.163.com/song/media/outer/url?id=447926071.mp3',
      cover:
        'http://p1.music.126.net/34YW1QtKxJ_3YnX9ZzKhzw==/2946691234868155.jpg?param=130y130'
    },
    {
      name: '是你',
      artist: '赵露思',
      url: 'https://wj.hhthht.cn/shini.mp3',
      cover:
        'http://p2.music.126.net/-HXQekCg_mYEvnuUZXY3hA==/109951168210692627.jpg?param=140y140'
    },
    {
      name: '再见',
      artist: '邓紫棋',
      url: 'https://music.163.com/song/media/outer/url?id=413834729.mp3',
      cover:
        'http://p1.music.126.net/kVwk6b8Qdya8oDyGDcyAVA==/1364493930777368.jpg?param=130y130'
    },
    {
      name: '5:20AM',
      artist: '芊芊龍',
      url: 'https://music.163.com/song/media/outer/url?id=2151215703.mp3',
      cover:
        'http://p2.music.126.net/6vJ1VJtF7T3BPRjH4wF5ig==/109951169547109113.jpg?param=130y130'
    },
    {
      name: '如愿',
      artist: '王菲',
      url: 'https://wj.hhthht.cn/ruyuan.mp3',
      cover:
        'http://p2.music.126.net/SvTfw8UsSPbt6bk-i0n3IQ==/109951166537609949.jpg?param=130y130'
    },
    {
      name: '罗生门（Follow）',
      artist: '梨冻紧 / Wiz_H张子豪',
      url: 'https://music.163.com/song/media/outer/url?id=1456890009.mp3',
      cover:
        'http://p2.music.126.net/yN1ke1xYMJ718FiHaDWtYQ==/109951165076380471.jpg?param=130y130'
    },
    {
      name: '热爱105°C的你',
      artist: '阿肆',
      url: 'https://music.163.com/song/media/outer/url?id=1840459406.mp3',
      cover:
        'http://p1.music.126.net/6Herq6VjqEM2wJYiML3y4A==/109951166098679116.jpg?param=130y130'
    },
    {
      name: '盛夏的果实',
      artist: '莫文蔚',
      url: 'https://music.163.com/song/media/outer/url?id=27937429.mp3',
      cover:
        'http://p1.music.126.net/3eVhNBf4fv133FRgMj4IPQ==/109951164628978750.jpg?param=130y130'
    },
    {
      name: '南屏晚钟',
      artist: '蔡琴',
      url: 'https://music.163.com/song/media/outer/url?id=211637.mp3',
      cover:
        'http://p1.music.126.net/ywlEDcdWT6PE8RydPYfXlg==/109951163213084637.jpg?param=130y130'
    },
    {
      name: '匆匆那年',
      artist: '王菲',
      url: 'https://music.163.com/song/media/outer/url?id=31514406.mp3',
      cover:
        'http://p2.music.126.net/yXyeAl-7m0tqfx4AX7BDSQ==/2542070884980240.jpg?param=130y130'
    },
    {
      name: '因为爱情',
      artist: '陈奕迅 / 王菲',
      url: 'https://music.163.com/song/media/outer/url?id=25640795.mp3',
      cover:
        'http://p1.music.126.net/0POVOSSjqgVoOUGc5haWBQ==/109951163392311918.jpg?param=130y130'
    },
    {
      name: '大鱼',
      artist: '周深',
      url: 'https://wj.hhthht.cn/dayu.mp3',
      cover:
        'https://img2.kuwo.cn/star/albumcover/500/65/1/1261222476.jpg'
    },
    {
      name: '小美满',
      artist: '周深',
      url: 'https://wj.hhthht.cn/xiaomeiman.mp3',
      cover:
        'http://p2.music.126.net/ve0l1aPRUBPP7e4x2Oz5DA==/109951169318479430.jpg?param=130y130'
    },
    {
      name: '千千阙歌(Live)',
      artist: '陈慧娴',
      url: 'https://music.163.com/song/media/outer/url?id=211863.mp3',
      cover:
        'http://p1.music.126.net/tzmGFZ0-DPOulXS97H5rmA==/18712588395102549.jpg?param=130y130'
    },
    {
      name: '光辉岁月',
      artist: 'Beyond',
      url: 'https://music.163.com/song/media/outer/url?id=1397655930.mp3',
      cover:
        'http://p2.music.126.net/rZ85Rxb042ekTzR22CysUA==/109951164433827584.jpg?param=130y130'
    },
    {
      name: '海阔天空',
      artist: 'Beyond',
      url: 'https://music.163.com/song/media/outer/url?id=1357374736.mp3',
      cover:
        'http://p2.music.126.net/qnQ93WnZHACVvIM14c4sAQ==/109951163984007061.jpg?param=130y130'
    },
    {
      name: '小幸运',
      artist: '田馥甄',
      url: 'https://wj.hhthht.cn/xiaoxingyun.mp3',
      cover:
        'https://img2.kuwo.cn/star/albumcover/500/12/4/3442823652.jpg'
    },
    {
      name: '多远都要在一起',
      artist: 'G.E.M.邓紫棋',
      url: 'https://music.163.com/song/media/outer/url?id=432698302.mp3',
      cover:
        'http://p1.music.126.net/eX7aCeGTF3Lt_swJSbE4yQ==/18700493765616158.jpg?param=130y130'
    },
    {
      name: '童话镇',
      artist: '容祖儿',
      url: 'https://music.163.com/song/media/outer/url?id=2611596618.mp3',
      cover:
        'http://p1.music.126.net/AmdNYt2fNQnYBBOzw1mpKQ==/109951169826214140.jpg?param=130y130'
    },
    {
      name: '盛夏光年',
      artist: '五月天',
      url: 'https://music.163.com/song/media/outer/url?id=5255949.mp3',
      cover:
        'http://p1.music.126.net/NOg81TCngSPhkwNQe373GA==/69269232567554.jpg?param=130y130'
    }
  ],
  MUSIC_PLAYER_METING: process.env.NEXT_PUBLIC_MUSIC_PLAYER_METING || false, // 是否要开启 MetingJS，从平台获取歌单。会覆盖自定义的 MUSIC_PLAYER_AUDIO_LIST，更多配置信息：https://github.com/metowolf/MetingJS
  MUSIC_PLAYER_METING_SERVER:
    process.env.NEXT_PUBLIC_MUSIC_PLAYER_METING_SERVER || 'netease', // 音乐平台，[netease, tencent, kugou, xiami, baidu]
  MUSIC_PLAYER_METING_ID:
    process.env.NEXT_PUBLIC_MUSIC_PLAYER_METING_ID || '60198', // 对应歌单的 id
  MUSIC_PLAYER_METING_LRC_TYPE:
    process.env.NEXT_PUBLIC_MUSIC_PLAYER_METING_LRC_TYPE || '1', // 已废弃！！！可选值： 3 | 1 | 0（0：禁用 lrc 歌词，1：lrc 格式的字符串，3：lrc 文件 url）

  // 一个小插件展示你的facebook fan page~ @see https://tw.andys.pro/article/add-facebook-fanpage-notionnext
  FACEBOOK_PAGE_TITLE: process.env.NEXT_PUBLIC_FACEBOOK_PAGE_TITLE || null, // 邊欄 Facebook Page widget 的標題欄，填''則無標題欄 e.g FACEBOOK 粉絲團'
  FACEBOOK_PAGE: process.env.NEXT_PUBLIC_FACEBOOK_PAGE || null, // Facebook Page 的連結 e.g https://www.facebook.com/tw.andys.pro
  FACEBOOK_PAGE_ID: process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID || '', // Facebook Page ID 來啟用 messenger 聊天功能
  FACEBOOK_APP_ID: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '' // Facebook App ID 來啟用 messenger 聊天功能 获取: https://developers.facebook.com/
}
