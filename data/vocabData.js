export const vocabCategories = [
  {
    id: 'health',
    title: '医疗汉语',
    description: '医院就诊与治疗相关',
    items: [
      { id: 'hospital', title: '医院就诊', locked: false },
      { id: 'treatment', title: '治疗相关', locked: false },
    ],
  },
  {
    id: 'travel',
    title: '旅游汉语',
    description: '机场酒店出行',
    items: [
      { id: 'airport', title: '机场', locked: false },
      { id: 'hotel', title: '酒店', locked: false },
    ],
  },
  {
    id: 'hsk',
    title: 'HSK 词汇',
    description: '带 hsk_level + id，可走音频',
    items: [
      { id: 'hsk1_basic', title: 'HSK1 常用', locked: false },
    ],
  },
];

export const getCategoryById = (id) =>
  vocabCategories.find((c) => c.id === id) || null;
