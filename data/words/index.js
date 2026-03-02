export const wordDataMap = {
  health: () => import('./health').then((m) => m.default),
  travel: () => import('./travel').then((m) => m.default),
  hsk: () => import('./hsk').then((m) => m.default),
};
