// data/oral/index.js
// 使用 fetch 从 public 目录读取 JSON，保证 CF Pages 可以访问
export const oralDataMap = {
  'daily/greeting': () =>
    fetch('/data/oral/daily/greeting.json').then(res => res.json()),

  // 后续模块也可以按相同方式添加：
  // 'daily/thanks': () => fetch('/data/oral/daily/thanks.json').then(res => res.json()),
  // 'daily/selfintro': () => fetch('/data/oral/daily/selfintro.json').then(res => res.json()),

  // 'travel/airport': () => fetch('/data/oral/travel/airport.json').then(res => res.json()),
  // 'travel/hotel': () => fetch('/data/oral/travel/hotel.json').then(res => res.json()),
  // 'travel/direction': () => fetch('/data/oral/travel/direction.json').then(res => res.json()),

  // 'medical/registration': () => fetch('/data/oral/medical/registration.json').then(res => res.json()),
  // 'medical/symptoms': () => fetch('/data/oral/medical/symptoms.json').then(res => res.json()),
};
