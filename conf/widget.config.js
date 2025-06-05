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
    'https://raw.githubusercontent.com/imuncle/live2d/master/model/illyasviel/illyasviel.model.json', // 挂件模型地址 @see https://github.com/xiazeyu/live2d-widget-models
  WIDGET_PET_SWITCH_THEME:
    process.env.NEXT_PUBLIC_WIDGET_PET_SWITCH_THEME || false, // 点击宠物挂件切换博客主题

  SPOILER_TEXT_TAG: process.env.NEXT_PUBLIC_SPOILER_TEXT_TAG || '', // Spoiler文本隐藏功能，如Notion中 [sp]希望被spoiler的文字[sp]，填入[sp] 即可

  // 音乐播放插件
  MUSIC_PLAYER: process.env.NEXT_PUBLIC_MUSIC_PLAYER || true, // 是否使用音乐播放插件
  MUSIC_PLAYER_VISIBLE: process.env.NEXT_PUBLIC_MUSIC_PLAYER_VISIBLE || true, // 是否在左下角显示播放和切换，如果使用播放器，打开自动播放再隐藏，就会以类似背景音乐的方式播放，无法取消和暂停
  MUSIC_PLAYER_AUTO_PLAY:
    process.env.NEXT_PUBLIC_MUSIC_PLAYER_AUTO_PLAY || true, // 是否自动播放，不过自动播放时常不生效（移动设备不支持自动播放）
  MUSIC_PLAYER_LRC_TYPE: process.env.NEXT_PUBLIC_MUSIC_PLAYER_LRC_TYPE || '0', // 歌词显示类型，可选值： 3 | 1 | 0（0：禁用 lrc 歌词，1：lrc 格式的字符串，3：lrc 文件 url）（前提是有配置歌词路径，对 meting 无效）
  MUSIC_PLAYER_CDN_URL:
    process.env.NEXT_PUBLIC_MUSIC_PLAYER_CDN_URL ||
    'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/aplayer/1.10.1/APlayer.min.js',
  MUSIC_PLAYER_ORDER: process.env.NEXT_PUBLIC_MUSIC_PLAYER_ORDER || 'list', // 默认播放方式，顺序 list，随机 random
  MUSIC_PLAYER_AUDIO_LIST: [
    // 示例音乐列表。除了以下配置外，还可配置歌词，具体配置项看此文档 https://aplayer.js.org/#/zh-Hans/
    {
      name: '鳥の詩',
      artist: 'Lia',
      url: 'https://music.163.com/song/media/outer/url?id=761594.mp3',
      cover: 'http://p2.music.126.net/CI_u3SfBgdTIAQtFnn_wnQ==/6040716883009850.jpg'
    },
    {
      name: 'Memoria-君の赴くままに',
      artist: '藤崎わと',
      url: 'https://cloud-oc.github.io/FileHub/root/Music/Memoria-君の赴くままに.m4a',
      cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiMiehT3mFTCvo7gRCx6_e9e5DSAm8Q19M7w&s'
    },
    {
      name: 'モニタリング',
      artist: 'DECO*27,初音ミク',
      url: 'https://music.163.com/song/media/outer/url?id=2639291583.mp3',
      cover: 'https://p2.music.126.net/AyOZCkH55VboMessdJnXGg==/109951170067309376.jpg'
    },
    {
      name: '妄想感傷代償連盟',
      artist: 'DECO*27,初音ミク',
      url: 'https://music.163.com/song/media/outer/url?id=432486474.mp3',
      cover: 'https://p1.music.126.net/S8Fw1AOhq45Obb_YyThviw==/18495984602893574.jpg'
    },
    {
      name: 'ラビットホール',
      artist: 'DECO*27,初音ミク',
      url: 'https://music.163.com/song/media/outer/url?id=2043178301.mp3',
      cover: 'https://p1.music.126.net/20QetRSvLjUmyyGF__1ALA==/109951168575689926.jpg'
    },
    {
      name: 'Come on,sweet death',
      artist: 'ARIANNE',
      url: 'https://cloud-oc.github.io/FileHub/root/Music/come on,sweet death.mp3',
      cover: 'https://p1.music.126.net/S4Kcgr9CmA_1yM6wbjL3Rg==/109951165354140879.jpg'
    },
    {
      name: 'Beautiful World',
      artist: '宇多田ヒカル',
      url: 'https://cloud-oc.github.io/FileHub/root/Music/Beautiful_World.mp3',
      cover: 'https://p1.music.126.net/l3G4LigZnOxFE9lB4bz_LQ==/109951165791860501.jpg'
    },
    {
      name: '桜流し (2021 Remastered)',
      artist: '宇多田ヒカル',
      url: 'https://music.163.com/song/media/outer/url?id=1825843935.mp3',
      cover: 'https://p1.music.126.net/l3G4LigZnOxFE9lB4bz_LQ==/109951165791860501.jpg'
    },
    {
      name: 'Beautiful World(Da Capo Version)',
      artist: '宇多田ヒカル',
      url: 'https://cloud-oc.github.io/FileHub/root/Music/Beautiful_World(Da_Capo_Version).mp3',
      cover: 'https://p1.music.126.net/l3G4LigZnOxFE9lB4bz_LQ==/109951165791860501.jpg'
    },
    {
      name: 'One Last Kiss',
      artist: '宇多田ヒカル',
      url: 'https://cloud-oc.github.io/FileHub/root/Music/One Last Kiss.mp3',
      cover: 'https://p1.music.126.net/l3G4LigZnOxFE9lB4bz_LQ==/109951165791860501.jpg'
    },
    {
      name: 'Merry Christmas Mr. Lawrence',
      artist: '坂本龍一',
      url: 'https://cloud-oc.github.io/FileHub/root/Music/Merry Christmas Mr. Lawrence.flac',
      cover: 'https://p1.music.126.net/Vnb5M_-BCkEARNVGSF_KKg==/109951167113646412.jpg'
    },
    {
      name: 'energy flow',
      artist: '坂本龍一',
      url: 'https://cloud-oc.github.io/FileHub/root/Music/energy flow.flac',
      cover: 'https://p1.music.126.net/92bUIG25fZW2TqOT53dP9w==/109951168429185109.jpg'
    },
    {
      name: 'Opus - ending',
      artist: '坂本龍一',
      url: 'http://music.163.com/song/media/outer/url?id=2610262431.mp3',
      cover: 'https://p2.music.126.net/YUFj5W_FSTK8euT5xWGr7A==/109951169805864161.jpg'
    },
    {
      name: 'Let It Be (Remastered 2009)',
      artist: 'Beatles',
      url: 'https://cloud-oc.github.io/FileHub/root/Music/Let It Be (Remastered 2009).flac',
      cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoPQLBmAd4ABWAtGQRQOyDWVOsiHPFOMRqhw&s'
    },
    {
      name: 'Gymnopedie No.1',
      artist: 'Erik Satie',
      url: 'https://music.163.com/song/media/outer/url?id=1436101985.mp3',
      cover: 'https://p2.music.126.net/TJn7g2nQLVqjKrKyY73aeg==/109951164857206844.jpg'
    },
    {
      name: 'Liebestraum No. 3 in A-flat',
      artist: 'Arthur Rubinstein',
      url: 'https://music.163.com/song/media/outer/url?id=1298576162.mp3',
      cover: 'https://p1.music.126.net/zeyFNs7lZmSysEnPd_yoLw==/109951165965837333.jpg'
    },
    {
      name: 'Liebestraume(Lizt)',
      artist: '阿保剛',
      url: 'https://music.163.com/song/media/outer/url?id=28802057.mp3',
      cover: 'https://p1.music.126.net/xGhMCNqVnRd6NX3y-5lrFQ==/6007731534871573.jpg'
    },
    {
      name: '爱之梦',
      artist: '郎朗',
      url: 'https://music.163.com/song/media/outer/url?id=114659.mp3',
      cover: 'https://p2.music.126.net/xK887lhrem11-JyATCtWJA==/109951163890328509.jpg'
    },
    {
      name: '崩坏世界的歌姬 (Movie Ver.)',
      artist: '小林未郁',
      url: 'https://music.163.com/song/media/outer/url?id=1459722976.mp3',
      cover: 'https://p2.music.126.net/2Rcimduy6Oj5Xz6beJDSIg==/3364505581118558.jpg'
    },
    {
      name: '崩坏世界的歌姬（Chinese Ver.）',
      artist: '泠鸢yousa',
      url: 'https://music.163.com/song/media/outer/url?id=33682747.mp3',
      cover: 'https://p1.music.126.net/XftX_EwaEBhjPgddMv7Lbw==/109951165105147714.jpg'
    },
    {
      name: 'Da Capo',
      artist: 'HOYO-MiX',
      url: 'https://music.163.com/song/media/outer/url?id=2026565329.mp3',
      cover: 'http://p1.music.126.net/awzv1LpuBJiKTeB7roh_Aw==/109951168434956885.jpg'
    },
    {
      name: '星间旅行 Interstellar Journey (中文版)',
      artist: 'HOYO-MiX,茶理理',
      url: 'https://music.163.com/song/media/outer/url?id=2043169389.mp3',
      cover: 'http://p2.music.126.net/JaSa3Gt5oaJ77cDfJBR1fg==/109951168575641463.jpg'
    },
    {
      name: '轻涟 La vaguelette',
      artist: 'HOYO-MiX',
      url: 'https://music.163.com/song/media/outer/url?id=2100334024.mp3',
      cover: 'http://p2.music.126.net/I-cw5yaq4Pz0EL2dZAmq1g==/109951169058808374.jpg'
    },
    {
      name: 'Moon Halo',
      artist: '茶理理,TetraCalyx,Hanser,HOYO-MiX',
      url: 'https://music.163.com/song/media/outer/url?id=1859652717.mp3',
      cover: 'http://p2.music.126.net/ciLKATqflV2YWSV3ltE2Kw==/109951166159281275.jpg'
    },
    {
      name: '蒲苇如丝 Lovers\' Oath',
      artist: '陈致逸,HOYO-MiX',
      url: 'https://music.163.com/song/media/outer/url?id=1861577585.mp3',
      cover: 'http://p2.music.126.net/klj1ylCHIDtuINQEXo1WEg==/109951166180599033.jpg'
    },
    {
      name: 'Regression',
      artist: '阿云嘎,HOYO-MiX',
      url: 'https://music.163.com/song/media/outer/url?id=1913478990.mp3',
      cover: 'http://p1.music.126.net/DbD08enxZN2kDFScDFxcdQ==/109951166957048928.jpg'
    },
    {
      name: '在银河中孤独摇摆',
      artist: '知更鸟,HOYO-MiX,Chevy',
      url: 'https://cloud-oc.github.io/FileHub/root/Music/01 在银河中孤独摇摆 Sway To My Beat In Cosmos.m4a',
      cover: 'http://p1.music.126.net/aR4BlDNkA84tFbg8bBpriA==/109951169585655912.jpg'
    },
    {
      name: '使一颗心免于哀伤',
      artist: '知更鸟,HOYO-MiX,Chevy',
      url: 'https://cloud-oc.github.io/FileHub/root/Music/02 使一颗心免于哀伤 If I Can Stop One Heart From Breaking.m4a',
      cover: 'http://p1.music.126.net/aR4BlDNkA84tFbg8bBpriA==/109951169585655912.jpg'
    },
    {
      name: '希望有羽毛和翅膀',
      artist: '知更鸟,HOYO-MiX,Chevy',
      url: 'https://cloud-oc.github.io/FileHub/root/Music/03 希望有羽毛和翅膀 Hope Is The Thing With Feathers.m4a',
      cover: 'http://p1.music.126.net/aR4BlDNkA84tFbg8bBpriA==/109951169585655912.jpg'
    },
    {
      name: '若我不曾见过太阳',
      artist: '知更鸟,HOYO-MiX,Chevy',
      url: 'https://cloud-oc.github.io/FileHub/root/Music/04 若我不曾见过太阳 Had I Not Seen The Sun.m4a',
      cover: 'http://p1.music.126.net/aR4BlDNkA84tFbg8bBpriA==/109951169585655912.jpg'
    },
    {
      name: '红透晚烟青',
      artist: '金玟岐,三Z-STUDIO,HOYO-MiX',
      url: 'http://music.163.com/song/media/outer/url?id=2618046004.mp3',
      cover: 'https://p1.music.126.net/xZwzMCIG6Tb0RvIf64q2Lg==/109951169878501910.jpg'
    },
    {
      name: '小停再出发',
      artist: '三Z-STUDIO,HOYO-MiX',
      url: 'http://music.163.com/song/media/outer/url?id=2644569024.mp3',
      cover: 'https://p2.music.126.net/lCNxRyqAuVvIPkuhUXkcdg==/109951170130858980.jpg'
    },
    {
      name: '晓',
      artist: '三Z-STUDIO,HOYO-MiX',
      url: 'http://music.163.com/song/media/outer/url?id=2658093531.mp3',
      cover: 'https://p1.music.126.net/1q8Nsdd7TIp_KG5_mVg4aw==/109951170280932175.jpg'
    },
    {
      name: '穏ヤカナ眠リ',
      artist: '岡部啓一',
      url: 'http://music.163.com/song/media/outer/url?id=468490565.mp3',
      cover: 'https://p2.music.126.net/2mq_C15bHzYnbPX4fZHomw==/109951165543440452.jpg'
    },
    {
      name: '砂塵ノ記憶',
      artist: '高橋邦幸',
      url: 'http://music.163.com/song/media/outer/url?id=468490566.mp3',
      cover: 'https://p2.music.126.net/2mq_C15bHzYnbPX4fZHomw==/109951165543440452.jpg'
    },
    {
      name: '遊園施設',
      artist: '帆足圭吾',
      url: 'http://music.163.com/song/media/outer/url?id=468490569.mp3',
      cover: 'https://p2.music.126.net/2mq_C15bHzYnbPX4fZHomw==/109951165543440452.jpg'
    },
    {
      name: '還ラナイ声/ギター',
      artist: '岡部啓一',
      url: 'http://music.163.com/song/media/outer/url?id=468490571.mp3',
      cover: 'https://p2.music.126.net/2mq_C15bHzYnbPX4fZHomw==/109951165543440452.jpg'
    },
    {
      name: '澱ンダ祈リ/暁風',
      artist: '帆足圭吾 / 岡部啓一',
      url: 'http://music.163.com/song/media/outer/url?id=468490573.mp3',
      cover: 'https://p2.music.126.net/2mq_C15bHzYnbPX4fZHomw==/109951165543440452.jpg'
    },
    {
      name: 'エミール/ショップ',
      artist: '高橋邦幸 / 石濱翔 / 門脇舞以',
      url: 'http://music.163.com/song/media/outer/url?id=468490574.mp3',
      cover: 'https://p2.music.126.net/2mq_C15bHzYnbPX4fZHomw==/109951165543440452.jpg'
    },
    {
      name: '大切ナ時間',
      artist: '帆足圭吾 / 石井咲希',
      url: 'http://music.163.com/song/media/outer/url?id=468490575.mp3',
      cover: 'https://p2.music.126.net/2mq_C15bHzYnbPX4fZHomw==/109951165543440452.jpg'
    },
    {
      name: '曖昧ナ希望/氷雨',
      artist: '帆足圭吾',
      url: 'http://music.163.com/song/media/outer/url?id=468490576.mp3',
      cover: 'https://p2.music.126.net/2mq_C15bHzYnbPX4fZHomw==/109951165543440452.jpg'
    },
    {
      name: '遺サレタ場所/遮光',
      artist: '岡部啓一',
      url: 'http://music.163.com/song/media/outer/url?id=468490579.mp3',
      cover: 'https://p2.music.126.net/2mq_C15bHzYnbPX4fZHomw==/109951165543440452.jpg'
    },
    {
      name: 'パスカル',
      artist: '岡部啓一 / 石井咲希',
      url: 'http://music.163.com/song/media/outer/url?id=468490582.mp3',
      cover: 'https://p2.music.126.net/2mq_C15bHzYnbPX4fZHomw==/109951165543440452.jpg'
    },
    {
      name: '森ノ王国',
      artist: '帆足圭吾',
      url: 'http://music.163.com/song/media/outer/url?id=468490583.mp3',
      cover: 'https://p2.music.126.net/2mq_C15bHzYnbPX4fZHomw==/109951165543440452.jpg'
    },
    {
      name: '愚カシイ兵器:乙:甲',
      artist: '岡部啓一',
      url: 'http://music.163.com/song/media/outer/url?id=468490586.mp3',
      cover: 'https://p2.music.126.net/2mq_C15bHzYnbPX4fZHomw==/109951165543440452.jpg'
    },
    {
      name: '愚カシイ兵器:丙',
      artist: '岡部啓一',
      url: 'http://music.163.com/song/media/outer/url?id=468490589.mp3',
      cover: 'https://p2.music.126.net/2mq_C15bHzYnbPX4fZHomw==/109951165543440452.jpg'
    },
    {
      name: '曖昧ナ希望/翠雨',
      artist: '帆足圭吾',
      url: 'http://music.163.com/song/media/outer/url?id=468490598.mp3',
      cover: 'https://p2.music.126.net/2mq_C15bHzYnbPX4fZHomw==/109951165543440452.jpg'
    },
    {
      name: 'イニシエノウタ/贖罪',
      artist: '岡部啓一',
      url: 'http://music.163.com/song/media/outer/url?id=468490599.mp3',
      cover: 'https://p2.music.126.net/2mq_C15bHzYnbPX4fZHomw==/109951165543440452.jpg'
    },
    {
      name: '澱ンダ祈リ/星空',
      artist: '帆足圭吾 / 岡部啓一',
      url: 'http://music.163.com/song/media/outer/url?id=468490602.mp3',
      cover: 'https://p2.music.126.net/2mq_C15bHzYnbPX4fZHomw==/109951165543440452.jpg'
    },
    {
      name: '顕現シタ異物',
      artist: '岡部啓一 / 帆足圭吾',
      url: 'http://music.163.com/song/media/outer/url?id=468490603.mp3',
      cover: 'https://p2.music.126.net/2mq_C15bHzYnbPX4fZHomw==/109951165543440452.jpg'
    },
    {
      name: '「塔」',
      artist: '岡部啓一',
      url: 'http://music.163.com/song/media/outer/url?id=468490604.mp3',
      cover: 'https://p2.music.126.net/2mq_C15bHzYnbPX4fZHomw==/109951165543440452.jpg'
    },
    {
      name: 'カイネ／救済',
      artist: 'MONACA / 岡部啓一',
      url: 'http://music.163.com/song/media/outer/url?id=4937739.mp3',
      cover: 'https://p1.music.126.net/tet1byB8_pPwwoedxzFKhg==/2356253418376742.jpg'
    },
    {
      name: 'Weight of the World/壊レタ世界ノ歌',
      artist: '河野マリナ',
      url: 'http://music.163.com/song/media/outer/url?id=468490592.mp3',
      cover: 'https://p2.music.126.net/2mq_C15bHzYnbPX4fZHomw==/109951165543440452.jpg'
    },
    {
      name: 'Weight of the World (Nouveau-FR Version)',
      artist: 'Emi Evans / 岡部啓一',
      url: 'http://music.163.com/song/media/outer/url?id=468490607.mp3',
      cover: 'https://p2.music.126.net/2mq_C15bHzYnbPX4fZHomw==/109951165543440452.jpg'
    },
    {
      name: 'Weight of the World/the End of YoRHa',
      artist: 'YoRHa',
      url: 'http://music.163.com/song/media/outer/url?id=468490608.mp3',
      cover: 'https://p2.music.126.net/2mq_C15bHzYnbPX4fZHomw==/109951165543440452.jpg'
    },
    {
      name: 'Wake Up, Get Up, Get Out There',
      artist: 'Lyn',
      url: 'http://music.163.com/song/media/outer/url?id=454224827.mp3',
      cover: 'https://p1.music.126.net/FmuZirfGmg9FbMy3hkEqAA==/109951165567176149.jpg'
    },
    {
      name: 'Life Will Change',
      artist: 'Lyn',
      url: 'http://music.163.com/song/media/outer/url?id=454231736.mp3',
      cover: 'https://p1.music.126.net/FmuZirfGmg9FbMy3hkEqAA==/109951165567176149.jpg'
    },
    {
      name: 'Last Surprise',
      artist: 'Lyn',
      url: 'http://music.163.com/song/media/outer/url?id=454224836.mp3',
      cover: 'https://p1.music.126.net/FmuZirfGmg9FbMy3hkEqAA==/109951165567176149.jpg'
    },
    {
      name: 'Beneath the Mask',
      artist: 'Lyn',
      url: 'http://music.163.com/song/media/outer/url?id=454224842.mp3',
      cover: 'https://p1.music.126.net/FmuZirfGmg9FbMy3hkEqAA==/109951165567176149.jpg'
    },
    {
      name: 'Rivers In the Desert',
      artist: 'Lyn',
      url: 'http://music.163.com/song/media/outer/url?id=454231899.mp3',
      cover: 'https://p1.music.126.net/FmuZirfGmg9FbMy3hkEqAA==/109951165567176149.jpg'
    },
    {
      name: '星と僕らと',
      artist: 'Lyn',
      url: 'http://music.163.com/song/media/outer/url?id=454224997.mp3',
      cover: 'https://p1.music.126.net/FmuZirfGmg9FbMy3hkEqAA==/109951165567176149.jpg'
    },
    {
      name: 'Full Moon, Full Life',
      artist: 'Lotus Juice / 高橋あず美',
      url: 'http://music.163.com/song/media/outer/url?id=2123807708.mp3',
      cover: 'https://p2.music.126.net/KZ9tA0eVW03mDYGKeIkwEQ==/109951169371891954.jpg'
    },
    {
      name: 'Want To Be Close -Reload-',
      artist: 'アトラスサウンドチーム',
      url: 'http://music.163.com/song/media/outer/url?id=2123807711.mp3',
      cover: 'https://p2.music.126.net/KZ9tA0eVW03mDYGKeIkwEQ==/109951169371891954.jpg'
    },
    {
      name: 'When The Moon’s Reaching Out Stars',
      artist: '川村ゆみ',
      url: 'http://music.163.com/song/media/outer/url?id=403026.mp3',
      cover: 'https://p1.music.126.net/1u0epGLkeAEez46pY-sTAw==/737772302249800.jpg'
    },
    {
      name: 'Mass Destruction -Reload-',
      artist: 'アトラスサウンドチーム / Lotus Juice / 高橋あず美 / ATLUS GAME MUSIC',
      url: 'http://music.163.com/song/media/outer/url?id=2123802233.mp3',
      cover: 'https://p2.music.126.net/KZ9tA0eVW03mDYGKeIkwEQ==/109951169371891954.jpg'
    },
    {
      name: 'Color Your Night',
      artist: 'Lotus Juice / 高橋あず美 / アトラスサウンドチーム',
      url: 'http://music.163.com/song/media/outer/url?id=2123807718.mp3',
      cover: 'https://p2.music.126.net/KZ9tA0eVW03mDYGKeIkwEQ==/109951169371891954.jpg'
    },
    {
      name: 'It\'s Going Down Now',
      artist: 'アトラスサウンドチーム',
      url: 'http://music.163.com/song/media/outer/url?id=2123802242.mp3',
      cover: 'https://p2.music.126.net/KZ9tA0eVW03mDYGKeIkwEQ==/109951169371891954.jpg'
    },
    {
      name: '時価ネットたなか -Reload-',
      artist: 'アトラスサウンドチーム',
      url: 'http://music.163.com/song/media/outer/url?id=2123807728.mp3',
      cover: 'https://p2.music.126.net/KZ9tA0eVW03mDYGKeIkwEQ==/109951169371891954.jpg'
    },
    {
      name: '街の記憶 (P3R ver.)',
      artist: 'アトラスサウンドチーム',
      url: 'http://music.163.com/song/media/outer/url?id=2123802253.mp3',
      cover: 'https://p2.music.126.net/KZ9tA0eVW03mDYGKeIkwEQ==/109951169371891954.jpg'
    },
    {
      name: '学園の記憶 (P3R ver.)',
      artist: 'アトラスサウンドチーム',
      url: 'http://music.163.com/song/media/outer/url?id=2123802254.mp3',
      cover: 'https://p2.music.126.net/KZ9tA0eVW03mDYGKeIkwEQ==/109951169371891954.jpg'
    },
    {
      name: 'Burn My Dread',
      artist: '川村ゆみ',
      url: 'http://music.163.com/song/media/outer/url?id=403002.mp3',
      cover: 'https://p2.music.126.net/1u0epGLkeAEez46pY-sTAw==/737772302249800.jpg'
    },
    {
      name: '私が守るから -Reload-',
      artist: 'アトラスサウンドチーム',
      url: 'http://music.163.com/song/media/outer/url?id=2123802257.mp3',
      cover: 'https://p2.music.126.net/KZ9tA0eVW03mDYGKeIkwEQ==/109951169371891954.jpg'
    },
    {
      name: 'キミの記憶 -Reload-',
      artist: 'アトラスサウンドチーム',
      url: 'http://music.163.com/song/media/outer/url?id=2123802258.mp3',
      cover: 'https://p2.music.126.net/KZ9tA0eVW03mDYGKeIkwEQ==/109951169371891954.jpg'
    },
    {
      name: 'Trailer Theme - Just a To the Moon Series Beach Episode',
      artist: 'Kan R. Gao',
      url: 'http://music.163.com/song/media/outer/url?id=2633699898.mp3',
      cover: 'https://p2.music.126.net/KZ9tA0eVW03mDYGKeIkwEQ==/109951169371891954.jpg'
    },
    {
      name: 'Title Theme - Just a To the Moon Series Beach Episode',
      artist: 'Kan R. Gao',
      url: 'http://music.163.com/song/media/outer/url?id=2633698053.mp3',
      cover: 'https://p1.music.126.net/q7j2CUBo6u-ivxzkjjaf1w==/109951170017498007.jpg'
    },
    {
      name: 'The Day Off (Bus Map Music)',
      artist: 'Kan R. Gao',
      url: 'http://music.163.com/song/media/outer/url?id=2633698058.mp3',
      cover: 'https://p1.music.126.net/q7j2CUBo6u-ivxzkjjaf1w==/109951170017498007.jpg'
    },
    {
      name: 'For River - Lobby Piano Version',
      artist: 'Kan R. Gao',
      url: 'http://music.163.com/song/media/outer/url?id=2633698054.mp3',
      cover: 'https://p1.music.126.net/q7j2CUBo6u-ivxzkjjaf1w==/109951170017498007.jpg'
    },
    {
      name: 'Born a Stranger - Lobby Piano Version',
      artist: 'Kan R. Gao',
      url: 'http://music.163.com/song/media/outer/url?id=2633698059.mp3',
      cover: 'https://p1.music.126.net/q7j2CUBo6u-ivxzkjjaf1w==/109951170017498007.jpg'
    },
    {
      name: 'Time is a Place - Lobby Piano Version',
      artist: 'Kan R. Gao',
      url: 'http://music.163.com/song/media/outer/url?id=2633699892.mp3',
      cover: 'https://p1.music.126.net/q7j2CUBo6u-ivxzkjjaf1w==/109951170017498007.jpg'
    },
    {
      name: 'Faye\'s Theme - Lobby Piano Version',
      artist: 'Kan R. Gao',
      url: 'http://music.163.com/song/media/outer/url?id=2633699899.mp3',
      cover: 'https://p1.music.126.net/q7j2CUBo6u-ivxzkjjaf1w==/109951170017498007.jpg'
    },
    {
      name: 'Lullaby from a Star - Lobby Piano Version',
      artist: 'Kan R. Gao',
      url: 'http://music.163.com/song/media/outer/url?id=2633699893.mp3',
      cover: 'https://p1.music.126.net/q7j2CUBo6u-ivxzkjjaf1w==/109951170017498007.jpg'
    },
    {
      name: 'To Realize (Quintessence) - Lobby Piano Version',
      artist: 'Kan R. Gao',
      url: 'http://music.163.com/song/media/outer/url?id=2633699900.mp3',
      cover: 'https://p1.music.126.net/q7j2CUBo6u-ivxzkjjaf1w==/109951170017498007.jpg'
    },
    {
      name: 'Envy (Quintessence) - Lobby Piano Version',
      artist: 'Kan R. Gao',
      url: 'http://music.163.com/song/media/outer/url?id=2633699894.mp3',
      cover: 'https://p1.music.126.net/q7j2CUBo6u-ivxzkjjaf1w==/109951170017498007.jpg'
    },
    {
      name: 'Kaire\'s Theme (Quintessence) - Lobby Piano Version',
      artist: 'Kan R. Gao',
      url: 'http://music.163.com/song/media/outer/url?id=2633698060.mp3',
      cover: 'https://p1.music.126.net/q7j2CUBo6u-ivxzkjjaf1w==/109951170017498007.jpg'
    },
    {
      name: 'To the Moon Lofi Medley',
      artist: 'Kan R. Gao / Sunmin Kim',
      url: 'http://music.163.com/song/media/outer/url?id=2633698063.mp3',
      cover: 'https://p1.music.126.net/q7j2CUBo6u-ivxzkjjaf1w==/109951170017498007.jpg'
    },
    {
      name: 'Finding Paradise Lofi Medley',
      artist: 'Ferdk / Kan R. Gao',
      url: 'http://music.163.com/song/media/outer/url?id=2633699896.mp3',
      cover: 'https://p1.music.126.net/q7j2CUBo6u-ivxzkjjaf1w==/109951170017498007.jpg'
    },
    {
      name: 'Impostor Factory Lofi Medley',
      artist: 'Ferdk / Kan R. Gao',
      url: 'http://music.163.com/song/media/outer/url?id=2633699901.mp3',
      cover: 'https://p1.music.126.net/q7j2CUBo6u-ivxzkjjaf1w==/109951170017498007.jpg'
    },
    {
      name: 'Neil and Eva Lofi Medley',
      artist: 'Ferdk / Kan R. Gao',
      url: 'http://music.163.com/song/media/outer/url?id=2633698057.mp3',
      cover: 'https://p1.music.126.net/q7j2CUBo6u-ivxzkjjaf1w==/109951170017498007.jpg'
    },
    {
      name: 'World in a Memory',
      artist: 'Kan R. Gao / Pealeaf',
      url: 'http://music.163.com/song/media/outer/url?id=2633698064.mp3',
      cover: 'https://p1.music.126.net/q7j2CUBo6u-ivxzkjjaf1w==/109951170017498007.jpg'
    },
    {
      name: 'I Still Remember Everything',
      artist: 'Kan R. Gao',
      url: 'http://music.163.com/song/media/outer/url?id=2633699897.mp3',
      cover: 'https://p1.music.126.net/q7j2CUBo6u-ivxzkjjaf1w==/109951170017498007.jpg'
    },
    {
      name: 'Everything\'s Alright (Bonus Version)',
      artist: 'Kan R. Gao / Laura Shigihara',
      url: 'http://music.163.com/song/media/outer/url?id=454966468.mp3',
      cover: 'https://p2.music.126.net/0AYWra9rCzgeprGp6OUyUw==/868614185993997.jpg'
    },
    {
      name: '雑踏、僕らの街',
      artist: 'トゲナシトゲアリ',
      url: 'http://music.163.com/song/media/outer/url?id=2621540481.mp3',
      cover: 'https://p2.music.126.net/yPW_EmIsyR7iD6awPiiQUQ==/109951170148303857.jpg'
    },
    {
      name: '誰にもなれない私だから',
      artist: 'トゲナシトゲアリ',
      url: 'http://music.163.com/song/media/outer/url?id=2621540483.mp3',
      cover: 'https://p2.music.126.net/yPW_EmIsyR7iD6awPiiQUQ==/109951170148303857.jpg'
    },
    {
      name: '空の箱 (井芹仁菜、河原木桃香)',
      artist: 'トゲナシトゲアリ',
      url: 'http://music.163.com/song/media/outer/url?id=2621540484.mp3',
      cover: 'https://p2.music.126.net/yPW_EmIsyR7iD6awPiiQUQ==/109951170148303857.jpg'
    },
    {
      name: '声なき魚 (新川崎（仮）)',
      artist: 'トゲナシトゲアリ',
      url: 'http://music.163.com/song/media/outer/url?id=2621540487.mp3',
      cover: 'https://p2.music.126.net/yPW_EmIsyR7iD6awPiiQUQ==/109951170148303857.jpg'
    },
    {
      name: '視界の隅 朽ちる音 (新川崎（仮）)',
      artist: 'トゲナシトゲアリ',
      url: 'http://music.163.com/song/media/outer/url?id=2621539071.mp3',
      cover: 'https://p2.music.126.net/yPW_EmIsyR7iD6awPiiQUQ==/109951170148303857.jpg'
    },
    {
      name: '心象的フラクタル (beni-shouga)',
      artist: 'トゲナシトゲアリ',
      url: 'http://music.163.com/song/media/outer/url?id=2621539072.mp3',
      cover: 'https://p2.music.126.net/yPW_EmIsyR7iD6awPiiQUQ==/109951170148303857.jpg'
    },
    {
      name: '空白とカタルシス',
      artist: 'トゲナシトゲアリ',
      url: 'http://music.163.com/song/media/outer/url?id=2621539073.mp3',
      cover: 'https://p2.music.126.net/yPW_EmIsyR7iD6awPiiQUQ==/109951170148303857.jpg'
    },
    {
      name: '運命の華',
      artist: 'トゲナシトゲアリ',
      url: 'http://music.163.com/song/media/outer/url?id=2621539074.mp3',
      cover: 'https://p2.music.126.net/yPW_EmIsyR7iD6awPiiQUQ==/109951170148303857.jpg'
    },
    {
      name: 'Cycle Of Sorrow',
      artist: 'トゲナシトゲアリ',
      url: 'http://music.163.com/song/media/outer/url?id=2621540489.mp3',
      cover: 'https://p2.music.126.net/yPW_EmIsyR7iD6awPiiQUQ==/109951170148303857.jpg'
    },
    {
      name: 'ETERNAL FLAME (VOID)',
      artist: 'トゲナシトゲアリ',
      url: 'http://music.163.com/song/media/outer/url?id=2621539076.mp3',
      cover: 'https://p2.music.126.net/yPW_EmIsyR7iD6awPiiQUQ==/109951170148303857.jpg'
    },
    {
      name: '闇に溶けてく',
      artist: 'トゲナシトゲアリ',
      url: 'http://music.163.com/song/media/outer/url?id=2621540490.mp3',
      cover: 'https://p2.music.126.net/yPW_EmIsyR7iD6awPiiQUQ==/109951170148303857.jpg'
    },
    {
      name: '蝶に結いた赤い糸',
      artist: 'トゲナシトゲアリ',
      url: 'http://music.163.com/song/media/outer/url?id=2621539078.mp3',
      cover: 'https://p2.music.126.net/yPW_EmIsyR7iD6awPiiQUQ==/109951170148303857.jpg'
    },
    {
    name: "You're Going to Love Tomorrow's Story",
    artist: "Yokaze",
    url: "https://cloud-oc.github.io/FileHub/root/Music/You're Going to Love Tomorrow's Story.m4a",
    cover: "https://cdn.jsdmirror.com/gh/Cloud-oc/FileHub@main/root/Picture/Unreal%20Life%20OST.png"
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
