export const wordDataMap = {
  // health
  'health/hospital': () => import('./health/hospital').then((m) => m.default),
  'health/treatment': () => import('./health/treatment').then((m) => m.default),

  // travel
  'travel/airport': () => import('./travel/airport').then((m) => m.default),
  'travel/hotel': () => import('./travel/hotel').then((m) => m.default),

  // hsk
  'hsk/hsk1': () => import('./hsk/hsk1').then((m) => m.default),
};
