// data/oral/index.js
// 动态导入口语数据，直接从源码目录 import，避免 fetch 和 CF 404
export const oralDataMap = {
  'daily/greeting': () =>
    import('./daily/greeting.json').then((mod) => mod.default),

  // 后续解锁的模块也可以按同样方式添加：
  // 'daily/thanks': () => import('./daily/thanks.json').then(mod => mod.default),
  // 'daily/selfintro': () => import('./daily/selfintro.json').then(mod => mod.default),

  // 'travel/airport': () => import('./travel/airport.json').then(mod => mod.default),
  // 'travel/hotel': () => import('./travel/hotel.json').then(mod => mod.default),
  // 'travel/direction': () => import('./travel/direction.json').then(mod => mod.default),

  // 'medical/registration': () => import('./medical/registration.json').then(mod => mod.default),
  // 'medical/symptoms': () => import('./medical/symptoms.json').then(mod => mod.default),
};
