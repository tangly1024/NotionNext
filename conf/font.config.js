/**
 * 网站字体相关配置
 *
 */
module.exports = {
  // START ************网站字体*****************
  // ['font-serif','font-sans'] 两种可选，分别是衬线和无衬线: 参考 https://www.jianshu.com/p/55e410bd2115
  // 后面空格隔开的font-light的字体粗细，留空是默认粗细；参考 https://www.tailwindcss.cn/docs/font-weight
  FONT_STYLE: process.env.NEXT_PUBLIC_FONT_STYLE || 'font-sans font-normal',
  // 字体CSS 例如 https://npm.elemecdn.com/lxgw-wenkai-webfont@1.6.0/style.css
  FONT_URL: [
    // 'https://npm.elemecdn.com/lxgw-wenkai-webfont@1.6.0/style.css',
    'https://fonts.googleapis.com/css?family=Bitter:300,400,700&display=swap',
    'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&display=swap',
    'https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400;500;700&display=swap',
    'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,100..700;1,100..700&display=swap'
  ],

  // 字体优化配置
  FONT_DISPLAY: process.env.NEXT_PUBLIC_FONT_DISPLAY || 'swap',
  FONT_PRELOAD: process.env.NEXT_PUBLIC_FONT_PRELOAD || true,
  FONT_SUBSET: process.env.NEXT_PUBLIC_FONT_SUBSET || 'chinese-simplified',
  // 无衬线字体 例如'"LXGW WenKai"'
  FONT_SANS: [
    '"IBM Plex Sans"',
    'ui-sans-serif',
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    '"Noto Sans"',
    '"Helvetica Neue"',
    'Helvetica',
    '"Nimbus Sans L"',
    'Arial',
    '"Liberation Sans"',
    '"PingFang SC"',
    '"Hiragino Sans GB"',
    '"Noto Sans CJK SC"',
    '"Source Han Sans SC"',
    '"Source Han Sans CN"',
    '"Microsoft YaHei"',
    '"Wenquanyi Micro Hei"',
    '"WenQuanYi Zen Hei"',
    '"ST Heiti"',
    'SimHei',
    '"WenQuanYi Zen Hei Sharp"',
    'sans-serif'
  ],
  // 衬线字体 例如'"LXGW WenKai"'
  FONT_SERIF: [
    // '"LXGW WenKai"',
    'Bitter',
    '"Noto Serif SC"',
    'SimSun',
    '"Times New Roman"',
    'Times',
    'serif',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
    '"Apple Color Emoji"'
  ],
  FONT_AWESOME:
    process.env.NEXT_PUBLIC_FONT_AWESOME_PATH ||
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css' // font-awesome 字体图标地址; 可选 /css/all.min.css ， https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/font-awesome/6.0.0/css/all.min.css

  // END ************网站字体*****************
}
