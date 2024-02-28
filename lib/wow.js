const { loadExternalResource } = require('./utils');

/**
 * WOWjs动画，结合animate.css使用很方便
 * 是data-aos的平替 aos ≈ wowjs + animate
 */
export const loadWowJS = async () => {
  await loadExternalResource('https://cdnjs.cloudflare.com/ajax/libs/wow/1.1.2/wow.min.js', 'js');
  // 配合animatecss 实现延时滚动动画，和AOS动画相似
  const WOW = window.WOW;
  console.log('加载WOW动画', WOW)
  if (WOW) {
    new WOW().init();
  }
};
