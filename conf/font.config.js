/**
 * 网站字体相关配置
 *
 */
module.exports = {
  // START ************网站字体*****************
  // 使用衬线字体
  FONT_STYLE: process.env.NEXT_PUBLIC_FONT_STYLE || 'font-serif',
  FONT_URL: [
    'https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@150;350&display=swap'
  ],

  // 字体优化配置
  FONT_DISPLAY: process.env.NEXT_PUBLIC_FONT_DISPLAY || 'swap',
  FONT_PRELOAD: process.env.NEXT_PUBLIC_FONT_PRELOAD || true,
  FONT_SUBSET: process.env.NEXT_PUBLIC_FONT_SUBSET || 'chinese-simplified',

  // 无衬线字体列表（强制使用 Noto Serif SC）
  FONT_SANS: [
    '"Noto Serif SC"', // 中文优先
    '-apple-system', // 苹果系统兜底
    'BlinkMacSystemFont',
    'sans-serif' // 通用无衬线
  ],

  // 衬线字体列表
  FONT_SERIF: [
    '"Noto Serif SC"', // 中文优先
    'SimSun', // 宋体兜底
    '"Times New Roman"', // 英文衬线
    'serif' // 通用衬线
  ],

  // 图标字体保持默认
  FONT_AWESOME:
    process.env.NEXT_PUBLIC_FONT_AWESOME_PATH ||
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
  // END ************网站字体*****************
}
