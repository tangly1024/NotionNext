/**
 * 网站美化动效相关配置
 */
module.exports = {
  // 鼠标点击烟花特效
  FIREWORKS: process.env.NEXT_PUBLIC_FIREWORKS || false, // 开关
  // 烟花色彩（感谢 https://github.com/Vixcity 提交的色彩方案）
  FIREWORKS_COLOR: [
    '255, 20, 97',
    '24, 255, 146',
    '90, 135, 255',
    '251, 243, 140'
  ],

  // 鼠标跟随特效
  MOUSE_FOLLOW: process.env.NEXT_PUBLIC_MOUSE_FOLLOW || true, // 开关
  // 以下两个配置仅在鼠标跟随特效开启时生效
  // 鼠标特效类型：1-路径散点 2-下降散点 3-上升散点 4-边缘向鼠标移动散点 5-跟踪转圈散点 6-路径线条 7-聚集散点 8-聚集网格 9-移动网格 10-上升粒子 11-转圈随机颜色粒子 12-圆锥放射跟随蓝色粒子
  MOUSE_FOLLOW_EFFECT_TYPE: 11, // 取值范围：1-12
  MOUSE_FOLLOW_EFFECT_COLOR: '#ef672a', // 鼠标特效颜色（支持 #xxxxxx 或 rgba(r,g,b,a) 格式）

  // 樱花飘落特效
  SAKURA: process.env.NEXT_PUBLIC_SAKURA || true, // 开关
  // 漂浮线段特效
  NEST: process.env.NEXT_PUBLIC_NEST || false, // 开关
  // 动态彩带特效
  FLUTTERINGRIBBON: process.env.NEXT_PUBLIC_FLUTTERINGRIBBON || false, // 开关
  // 静态彩带特效
  RIBBON: process.env.NEXT_PUBLIC_RIBBON || false, // 开关
  // 星空雨特效（仅在黑夜模式下生效）
  STARRY_SKY: process.env.NEXT_PUBLIC_STARRY_SKY || true, // 开关
  // animate.css 动画资源CDN
  ANIMATE_CSS_URL: process.env.NEXT_PUBLIC_ANIMATE_CSS_URL || 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css'
};
