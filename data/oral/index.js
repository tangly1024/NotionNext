// data/oral/index.js

const loadJson = async (url) => {
  console.log('[oralDataMap] fetch start:', url);

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  const contentType = res.headers.get('content-type');
  const text = await res.text();

  console.log('[oralDataMap] fetch done:', {
    url,
    status: res.status,
    ok: res.ok,
    contentType,
    preview: text.slice(0, 200),
  });

  if (!res.ok) {
    throw new Error(`读取失败: ${url}, status=${res.status}, body=${text.slice(0, 200)}`);
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    console.error('[oralDataMap] JSON parse error:', e);
    throw new Error(`JSON 解析失败: ${url}`);
  }
};

export const oralDataMap = {
  'daily/greeting': () => loadJson('/data/oral/daily/greeting.json'),

  // 后续模块按同样方式加
  // 'daily/thanks': () => loadJson('/data/oral/daily/thanks.json'),
  // 'daily/selfintro': () => loadJson('/data/oral/daily/selfintro.json'),

  // 'travel/airport': () => loadJson('/data/oral/travel/airport.json'),
  // 'travel/hotel': () => loadJson('/data/oral/travel/hotel.json'),
  // 'travel/direction': () => loadJson('/data/oral/travel/direction.json'),

  // 'medical/registration': () => loadJson('/data/oral/medical/registration.json'),
  // 'medical/symptoms': () => loadJson('/data/oral/medical/symptoms.json'),
};
