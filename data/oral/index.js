export const oralDataMap = {
  'daily/greeting': () => import('./daily/greeting.json').then((m) => m.default),
 // 'daily/thanks': () => import('./daily/thanks.json').then((m) => m.default),
 // 'daily/selfintro': () => import('./daily/selfintro.json').then((m) => m.default),

 // 'travel/airport': () => import('./travel/airport.json').then((m) => m.default),
//  'travel/hotel': () => import('./travel/hotel.json').then((m) => m.default),
//  'travel/direction': () => import('./travel/direction.json').then((m) => m.default),

  'medical/registration': () => import('./medical/registration.json').then((m) => m.default),
  'medical/symptoms': () => import('./medical/symptoms.json').then((m) => m.default),
};
