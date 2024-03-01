const CONFIG = {
  HEO_HOME_BANNER_ENABLE: true,

  HEO_SITE_CREATE_TIME: '2021-09-21', // 建站日期，用于计算网站运行的第几天

  // 首页顶部通知条滚动内容，如不需要可以留空 []
  HEO_NOTICE_BAR: [
    { title: '本站游戏获取游戏暗号0y.games', url: 'https://0y.games' },
  ],

  // 英雄区左右侧组件颠倒位置
  HEO_HERO_REVERSE: false,
  // 博客主体区左右侧组件颠倒位置
  HEO_HERO_BODY_REVERSE: false,

  // 英雄区(首页顶部大卡)
  HEO_HERO_TITLE_1: '游戏资源分享',
  HEO_HERO_TITLE_2: '',
  HEO_HERO_TITLE_3: '0y.games',
  HEO_HERO_TITLE_4: '全新上线',
  HEO_HERO_TITLE_5: '「近期推荐」幻兽帕鲁-联机补丁',
  HEO_HERO_TITLE_LINK: 'https://www.0y.games/article/Palworld',

  // 英雄区显示三个置顶分类
  HEO_HERO_CATEGORY_1: { title: '热门游戏', url: '/tag/热门' },
  HEO_HERO_CATEGORY_2: { title: 'PC游戏', url: '/tag/PC' },
  HEO_HERO_CATEGORY_3: { title: '主机游戏', url: '/tag/主机游戏' },

  // 英雄区右侧推荐文章标签, 例如 [推荐] , 最多六篇文章; 若留空白''，则推荐最近更新文章
  HEO_HERO_RECOMMEND_POST_TAG: '推荐',
  HEO_HERO_RECOMMEND_POST_SORT_BY_UPDATE_TIME: false, // 推荐文章排序，为`true`时将强制按最后修改时间倒序
  HERO_RECOMMEND_COVER: 'https://media.st.dl.eccdnx.com/steam/apps/1086940/header.jpg?t=1705604554', // 英雄区右侧图片

  // 右侧个人资料卡牌欢迎语，点击可自动切换
  HEO_INFOCARD_GREETINGS: [
    '你好！我们是火绳工业',
    '🔍 分享与热心帮助',
    '🤝 专注游戏资源',
    '🏃 脚踏实地行动派',
    '🧱 团队小组发动机'
  ],
  HEO_INFO_CARD_URL: 'https://0y.games', // 个人资料底部按钮链接

  // 用户技能图标
  HEO_GROUP_ICONS: [
    {
      title_1: '大表哥',
      img_1: 'data:image/jpeg;base64,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',
      color_1: '#ffffff',
      title_2: 'rockstar',
      img_2: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Rockstar_Games_Logo.svg/400px-Rockstar_Games_Logo.svg.png',
      color_2: '#ffffff'
    },
    {
      title_1: '艾尔登法环',
      img_1: 'data:image/jpeg;base64,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',
      color_1: '#ffffff',
      title_2: 'fromsoftware',
      img_2: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Fromsoftware_logo.svg/440px-Fromsoftware_logo.svg.png',
      color_2: '#ffffff'
    },
    {
      title_1: '博德之门3',
      img_1: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIADgAOAMBIgACEQEDEQH/xAAcAAACAgMBAQAAAAAAAAAAAAAABwUGAQIEAwj/xAAxEAABAwMDAwIEBAcAAAAAAAABAgMEAAUREiExBhNBUWEicYGRBxShsggWIyQygrH/xAAXAQEBAQEAAAAAAAAAAAAAAAABAAID/8QAHBEBAQACAgMAAAAAAAAAAAAAAAECESExEkHR/9oADAMBAAIRAxEAPwBtHODjGfGaijeFht4mE5lk6XFhaSgKzjGeT68bCpKVIbipQt46UKcS3qPAKthn5nA+tUnrXv2u2SW5EEzW58wJbUhwhIKyAELSdgDxnf6bVjPc6bw1e1qbuTDVuaflPoU4WkLWG+cqA4Tzjf7V0JlsmQ5HJIebGooPJHqPWkhKvV2eQbXAMqU3CUoLcYjAfGPhXvrClDb7D2rihm5tOqdaDf5x7tDuvu4KArATkBRJyMeh4JzR5U+EPC93Zu2wTKQtC9Cm1LbBypTalAEgc8HI+VdyZLC1BCXkFROAnOCfkPoaQbtz6jmQVsokRZsVv4WnXt1O6MnlSiSN+T7cU5OnzEn2yJdmHX246m0rHcCUDSlON8ePPP6bUy2i4yJ2s15xX25UZqQ1ntuoC0Z9CMiitsMz4bM+G9ElI1MvJKVDOD9Pekz1sm4RZrPT0u7uSFQymXFOoBQ50lW2+MHbxTw00iPx1tj383QZTYV/dRkobIOPjSo+f9hUkHKmSRckTX4LDErWo/mUvf0ULUN16cc7k8mp2/t2+NZwq33xffToJSoggqwNJB5PtVLaYXHtz0lbyJEbIQ8hZKgVk+N9j7+akJ9vixYcx4sR3GYxb7OEqABc+IHOfb3okxatyaRkuyNKsnt5wloNoKycYKhkEJ8birt+H0Rd6W5YE3BTdqggPPQ0OFROpX+JV8xv6UtpcV4OqSiShMpXxJQ2pSRo07pG/wA9vNMr+Hu3rSu8TgCGiltkEjk5Kjj9PvTwLs4UoShIShICUjAA4Aor0xWag9cVXOuemE9TWgNNlCJ0ZXdiOK4C/Q+x4NWaipPli3yEQET4KGJUYutkPaSVHGT9wDkZ+9dSZjncjOoZebblONmL2tie2MDjyRmmv1d01IaiJZTDizrcJyXWtSyhxnuLwUHA3RlWcg5HoSKgn+lmHI9xjKbD8iz4VGGpQSpZcwQR5BAI3zXLK6vHv4648wu7W2b51EWIkZb1yfeKWisgISs5Gpw+2CQPavorpHpyP0vYY9rjHUUDU65jdxw8qqM6e6alRpcJcuHb4EW3hRaYhKKy+6RpLjitI3xnbfnmrfXSRztaYoreikNNdY10UVJq4EOoKHE6knkGomBbQ1d7vJeRlEpxlSM+dIz+7/lFFFmzKmddY1UUUgaveiiipP/Z',
      color_1: '#ffffff',
      title_2: '拉瑞安',
      img_2: 'https://upload.wikimedia.org/wikipedia/zh/b/b5/Larian_Studios_logo.png',
      color_2: '#ffffff'
    },
    {
      title_1: '双人成行',
      img_1: 'https://upload.wikimedia.org/wikipedia/zh/a/aa/It_Takes_Two_cover_art.png',
      color_1: '#fff',
      title_2: '雾隐工作室',
      img_2: 'https://upload.wikimedia.org/wikipedia/zh/thumb/a/a2/Hazelight_Studio_Logo.svg/440px-Hazelight_Studio_Logo.svg.png',
      color_2: '#fff'
    },
    {
      title_1: '最后的生还者2',
      img_1: 'https://upload.wikimedia.org/wikipedia/zh/f/f2/The_last_of_us_part_2_cover.jpg',
      color_1: '#fff',
      title_2: '顽皮狗',
      img_2: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Naughty_Dog_logo.svg/560px-Naughty_Dog_logo.svg.png',
      color_2: '#fff'
    },
    {
      title_1: '只狼',
      img_1: 'https://upload.wikimedia.org/wikipedia/zh/f/fe/Sekiro_art_%28Re-uploaded%29.jpg',
      color_1: '#fff',
      title_2: 'FromSoftware',
      img_2: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Fromsoftware_logo.svg/440px-Fromsoftware_logo.svg.png',
      color_2: '#fff'
    },
    {
      title_1: '塞尔达传说 旷野之息',
      img_1: 'https://upload.wikimedia.org/wikipedia/zh/1/1a/The_Legend_of_Zelda_Breath_of_the_Wild.png',
      color_1: '#fff',
      title_2: '任天堂',
      img_2: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Nintendo.svg/500px-Nintendo.svg.png',
      color_2: '#fff'
    }
  ],

  HEO_SOCIAL_CARD: true, // 是否显示右侧，点击加入社群按钮
  HEO_SOCIAL_CARD_TITLE_1: '交流频道',
  HEO_SOCIAL_CARD_TITLE_2: '加入我们的社群讨论分享',
  HEO_SOCIAL_CARD_TITLE_3: '点击加入社群',
  HEO_SOCIAL_CARD_URL: 'discord社区地址',

  // *****  以下配置无效，只是预留开发 ****
  // 菜单配置
  HEO_MENU_INDEX: true, // 显示首页
  HEO_MENU_CATEGORY: true, // 显示分类
  HEO_MENU_TAG: true, // 显示标签
  HEO_MENU_ARCHIVE: false, // 显示归档
  HEO_MENU_SEARCH: true, // 显示搜索

  HEO_POST_LIST_COVER: true, // 列表显示文章封面
  HEO_POST_LIST_COVER_HOVER_ENLARGE: false, // 列表鼠标悬停放大

  HEO_POST_LIST_COVER_DEFAULT: true, // 封面为空时用站点背景做默认封面
  HEO_POST_LIST_SUMMARY: true, // 文章摘要
  HEO_POST_LIST_PREVIEW: false, // 读取文章预览
  HEO_POST_LIST_IMG_CROSSOVER: true, // 博客列表图片左右交错

  HEO_ARTICLE_ADJACENT: true, // 显示上一篇下一篇文章推荐
  HEO_ARTICLE_COPYRIGHT: true, // 显示文章版权声明
  HEO_ARTICLE_RECOMMEND: true, // 文章关联推荐

  HEO_WIDGET_LATEST_POSTS: true, // 显示最新文章卡
  HEO_WIDGET_ANALYTICS: false, // 显示统计卡
  HEO_WIDGET_TO_TOP: true,
  HEO_WIDGET_TO_COMMENT: true, // 跳到评论区
  HEO_WIDGET_DARK_MODE: true, // 夜间模式
  HEO_WIDGET_TOC: true // 移动端悬浮目录
}
export default CONFIG
