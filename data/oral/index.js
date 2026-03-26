// data/oral/index.js
// 动态导入口语数据，避免 fetch 网络请求导致 CF 404
export const oralDataMap = {
  'daily/greeting': () =>
    import('../../public/data/oral/daily/greeting.json').then((mod) => mod.default),

  // 如果后续解锁其他模块，也可以按同样方式：
  // 'daily/thanks': () => import('../../public/data/oral/daily/thanks.json').then(mod => mod.default),
  // 'daily/selfintro': () => import('../../public/data/oral/daily/selfintro.json').then(mod => mod.default),

  // 'travel/airport': () => import('../../public/data/oral/travel/airport.json').then(mod => mod.default),
  // 'travel/hotel': () => import('../../public/data/oral/travel/hotel.json').then(mod => mod.default),
  // 'travel/direction': () => import('../../public/data/oral/travel/direction.json').then(mod => mod.default),

  // 'medical/registration': () => import('../../public/data/oral/medical/registration.json').then(mod => mod.default),
  // 'medical/symptoms': () => import('../../public/data/oral/medical/symptoms.json').then(mod => mod.default),
};
