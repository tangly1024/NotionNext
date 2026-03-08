export const wordDataMap = {
 // health
  'jcjj/rcdc': () => import('./jcjj/rcdc.json').then((m) => m.default),
  // hsk
  'hsk/hsk1': () => import('./hsk/hsk1.json').then((m) => m.default),
};
