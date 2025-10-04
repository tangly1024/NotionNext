// Butterfly 主題默認配置
// Default configuration for Butterfly theme

module.exports = {
  nav: {
    logo: null,
    display_title: true,
    display_post_title: true,
    fixed: false
  },
  menu: null,
  code_blocks: {
    theme: 'light',
    macStyle: false,
    height_limit: false,
    word_wrap: false,
    copy: true,
    language: true,
    shrink: false,
    fullpage: false
  },
  social: null,
  favicon: '/img/favicon.png',
  avatar: {
    img: '/img/butterfly-icon.png',
    effect: false
  },
  disable_top_img: false,
  default_top_img: null,
  index_img: null,
  archive_img: null,
  tag_img: null,
  tag_per_img: null,
  category_img: null,
  category_per_img: null,
  footer_img: false,
  background: null,
  cover: {
    index_enable: true,
    aside_enable: true,
    archives_enable: true,
    default_cover: null
  },
  error_img: {
    flink: '/img/friend_404.gif',
    post_page: '/img/404.jpg'
  },
  error_404: {
    enable: false,
    subtitle: 'Page Not Found',
    background: '/img/error-page.png'
  },
  post_meta: {
    page: {
      date_type: 'created',
      date_format: 'date',
      categories: true,
      tags: false,
      label: true
    },
    post: {
      position: 'left',
      date_type: 'both',
      date_format: 'date',
      categories: true,
      tags: true,
      label: true
    }
  },
  index_site_info_top: null,
  index_top_img_height: null,
  subtitle: {
    enable: false,
    effect: true,
    typed_option: null,
    source: false,
    sub: null
  },
  index_layout: 3,
  index_post_content: {
    method: 3,
    length: 500
  },
  toc: {
    post: true,
    page: false,
    number: true,
    expand: false,
    style_simple: false,
    scroll_percent: true
  },
  post_copyright: {
    enable: true,
    decode: false,
    author_href: null,
    license: 'CC BY-NC-SA 4.0',
    license_url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/'
  },
  reward: {
    enable: false,
    text: null,
    QR_code: null
  },
  post_edit: {
    enable: false,
    url: null
  },
  related_post: {
    enable: true,
    limit: 6,
    date_type: 'created'
  },
  post_pagination: 1,
  noticeOutdate: {
    enable: false,
    style: 'flat',
    limit_day: 365,
    position: 'top',
    message_prev: 'It has been',
    message_next: 'days since the last update, the content of the article may be outdated.'
  },
  footer: {
    nav: null,
    owner: {
      enable: true,
      since: 2025
    },
    copyright: {
      enable: true,
      version: true
    },
    custom_text: null
  },
  aside: {
    enable: true,
    hide: false,
    button: true,
    mobile: true,
    position: 'right',
    display: {
      archive: true,
      tag: true,
      category: true
    },
    card_author: {
      enable: true,
      description: null,
      button: {
        enable: true,
        icon: 'fab fa-github',
        text: 'Follow Me',
        link: 'https://github.com/xxxxxx'
      }
    },
    card_announcement: {
      enable: true,
      content: 'This is my Blog'
    },
    card_recent_post: {
      enable: true,
      limit: 5,
      sort: 'date',
      sort_order: null
    },
    card_newest_comments: {
      enable: false,
      sort_order: null,
      limit: 6,
      storage: 10,
      avatar: true
    },
    card_categories: {
      enable: true,
      limit: 8,
      expand: 'none',
      sort_order: null
    },
    card_tags: {
      enable: true,
      limit: 40,
      color: false,
      orderby: 'random',
      order: 1,
      sort_order: null
    },
    card_archives: {
      enable: true,
      type: 'monthly',
      format: 'MMMM YYYY',
      order: -1,
      limit: 8,
      sort_order: null
    },
    card_post_series: {
      enable: true,
      series_title: false,
      orderBy: 'date',
      order: -1
    },
    card_webinfo: {
      enable: true,
      post_count: true,
      last_push_date: true,
      sort_order: null,
      runtime_date: null
    }
  },
  rightside_bottom: null,
  translate: {
    enable: false,
    default: '繁',
    defaultEncoding: 2,
    translateDelay: 0,
    msgToTraditionalChinese: '繁',
    msgToSimplifiedChinese: '簡'
  },
  readmode: true,
  darkmode: {
    enable: true,
    button: true,
    autoChangeMode: false,
    start: null,
    end: null
  },
  rightside_scroll_percent: false,
  rightside_item_order: {
    enable: false,
    hide: null,
    show: null
  },
  rightside_config_animation: true,
  anchor: {
    auto_update: false,
    click_to_scroll: false
  },
  photofigcaption: false,
  copy: {
    enable: true,
    copyright: {
      enable: false,
      limit_count: 150
    }
  },
  wordcount: {
    enable: false,
    post_wordcount: true,
    min2read: true,
    total_wordcount: true
  },
  busuanzi: {
    site_uv: true,
    site_pv: true,
    page_pv: true
  },
  math: {
    use: null,
    per_page: true,
    hide_scrollbar: false,
    mathjax: {
      enableMenu: true,
      tags: 'none'
    },
    katex: {
      copy_tex: false
    }
  },
  search: {
    use: null,
    placeholder: null,
    algolia_search: {
      hitsPerPage: 6
    },
    local_search: {
      preload: false,
      top_n_per_article: 1,
      unescape: false,
      pagination: {
        enable: false,
        hitsPerPage: 8
      },
      CDN: null
    },
    docsearch: {
      appId: null,
      apiKey: null,
      indexName: null,
      option: null
    }
  },
  share: {
    use: 'sharejs',
    sharejs: {
      sites: 'facebook,x,wechat,weibo,qq'
    },
    addtoany: {
      item: 'facebook,x,wechat,sina_weibo,facebook_messenger,email,copy_link'
    }
  },
  comments: {
    use: null,
    text: true,
    lazyload: false,
    count: false,
    card_post_count: false
  },
  disqus: {
    shortname: null,
    apikey: null
  },
  disqusjs: {
    shortname: null,
    apikey: null,
    option: null
  },
  livere: {
    uid: null
  },
  gitalk: {
    client_id: null,
    client_secret: null,
    repo: null,
    owner: null,
    admin: null,
    option: null
  },
  valine: {
    appId: null,
    appKey: null,
    avatar: 'monsterid',
    serverURLs: null,
    bg: null,
    visitor: false,
    option: null
  },
  waline: {
    serverURL: null,
    bg: null,
    pageview: false,
    option: null
  },
  utterances: {
    repo: null,
    issue_term: 'pathname',
    light_theme: 'github-light',
    dark_theme: 'photon-dark',
    js: null,
    option: null
  },
  facebook_comments: {
    app_id: null,
    user_id: null,
    pageSize: 10,
    order_by: 'social',
    lang: 'en_US'
  },
  twikoo: {
    envId: null,
    region: null,
    visitor: false,
    option: null
  },
  giscus: {
    repo: null,
    repo_id: null,
    category_id: null,
    light_theme: 'light',
    dark_theme: 'dark',
    js: null,
    option: null
  },
  remark42: {
    host: null,
    siteId: null,
    option: null
  },
  artalk: {
    server: null,
    site: null,
    visitor: false,
    option: null
  },
  chat: {
    use: null,
    rightside_button: false,
    button_hide_show: false
  },
  chatra: {
    id: null
  },
  tidio: {
    public_key: null
  },
  crisp: {
    website_id: null
  },
  google_tag_manager: {
    tag_id: null,
    domain: 'https://www.googletagmanager.com'
  },
  baidu_analytics: null,
  google_analytics: null,
  cloudflare_analytics: null,
  microsoft_clarity: null,
  umami_analytics: {
    enable: false,
    serverURL: null,
    script_name: 'script.js',
    website_id: null,
    option: null,
    UV_PV: {
      site_uv: false,
      site_pv: false,
      page_pv: false,
      token: null
    }
  },
  google_adsense: {
    enable: false,
    auto_ads: true,
    js: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
    client: null,
    enable_page_level_ads: true
  },
  ad: {
    index: null,
    aside: null,
    post: null
  },
  site_verification: null,
  category_ui: null,
  tag_ui: null,
  rounded_corners_ui: true,
  text_align_justify: false,
  mask: {
    header: true,
    footer: true
  },
  preloader: {
    enable: false,
    source: 1,
    pace_css_url: null
  },
  enter_transitions: true,
  display_mode: 'light',
  beautify: {
    enable: false,
    field: 'post',
    title_prefix_icon: null,
    title_prefix_icon_color: null
  },
  font: {
    global_font_size: null,
    code_font_size: null,
    font_family: null,
    code_font_family: null
  },
  blog_title_font: {
    font_link: null,
    font_family: null
  },
  hr_icon: {
    enable: true,
    icon: null,
    icon_top: null
  },
  activate_power_mode: {
    enable: false,
    colorful: true,
    shake: true,
    mobile: false
  },
  canvas_ribbon: {
    enable: false,
    size: 150,
    alpha: 0.6,
    zIndex: -1,
    click_to_change: false,
    mobile: false
  },
  canvas_fluttering_ribbon: {
    enable: false,
    mobile: false
  },
  canvas_nest: {
    enable: false,
    color: '0,0,255',
    opacity: 0.7,
    zIndex: -1,
    count: 99,
    mobile: false
  },
  fireworks: {
    enable: false,
    zIndex: 9999,
    mobile: false
  },
  click_heart: {
    enable: false,
    mobile: false
  },
  clickShowText: {
    enable: false,
    text: null,
    fontSize: '15px',
    random: false,
    mobile: false
  },
  lightbox: null,
  series: {
    enable: false,
    orderBy: 'title',
    order: 1,
    number: true
  },
  abcjs: {
    enable: false,
    per_page: true
  },
  mermaid: {
    enable: false,
    code_write: false,
    theme: {
      light: 'default',
      dark: 'dark'
    }
  },
  chartjs: {
    enable: false,
    fontColor: {
      light: 'rgba(0, 0, 0, 0.8)',
      dark: 'rgba(255, 255, 255, 0.8)'
    },
    borderColor: {
      light: 'rgba(0, 0, 0, 0.1)',
      dark: 'rgba(255, 255, 255, 0.2)'
    },
    scale_ticks_backdropColor: {
      light: 'transparent',
      dark: 'transparent'
    }
  },
  note: {
    style: 'flat',
    icons: true,
    border_radius: 3,
    light_bg_offset: 0
  },
  pjax: {
    enable: false,
    exclude: null
  },
  aplayerInject: {
    enable: false,
    per_page: true
  },
  snackbar: {
    enable: false,
    position: 'bottom-left',
    bg_light: '#49b1f5',
    bg_dark: '#1f1f1f'
  },
  instantpage: false,
  lazyload: {
    enable: false,
    native: false,
    field: 'site',
    placeholder: null,
    blur: false
  },
  pwa: {
    enable: false,
    manifest: null,
    apple_touch_icon: null,
    favicon_32_32: null,
    favicon_16_16: null,
    mask_icon: null
  },
  Open_Graph_meta: {
    enable: true,
    option: null
  },
  structured_data: {
    enable: false,
    alternate_name: null
  },
  css_prefix: true,
  inject: {
    head: null,
    bottom: null
  },
  CDN: {
    internal_provider: 'local',
    third_party_provider: 'jsdelivr',
    version: true,
    custom_format: null,
    option: null
  }
}
