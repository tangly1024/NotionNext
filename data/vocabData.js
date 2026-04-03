export const vocabCategories = [
  {
    id: 'health',
    title: '医疗汉语',
    description: '医院就诊与治疗相关',
    cover: '/images/vocab/bg-health.jpg', // 大分类背景（可选）
    items: [
      {
        id: 'hospital',
        title: '医院就诊',
        subtitle: '挂号 / 排队 / 医生',
        cover: '/images/vocab/hospital.jpg', // 二级分类小封面
        locked: false,
      },
      {
        id: 'treatment',
        title: '治疗相关',
        subtitle: '治疗 / 手术 / 药物',
        cover: '/images/vocab/treatment.jpg',
        locked: false,
      },
    ],
  },
  {
    id: 'travel',
    title: '旅游汉语',
    description: '机场酒店出行',
    cover: '/images/vocab/bg-travel.jpg',
    items: [
      { id: 'airport', title: '机场', subtitle: '登机牌 / 安检', cover: '/images/vocab/airport.jpg', locked: false },
      { id: 'hotel', title: '酒店', subtitle: '入住 / 退房', cover: '/images/vocab/hotel.jpg', locked: false },
    ],
  },
  {
    id: 'jcjj',
    title: '基础交际',
    description: '基础信息',
    cover: '/images/vocab/bg-travel.jpg',
    items: [
      { id: 'rcdc', title: '人称代词', subtitle: '你 / 我/ 他', cover: 'https://images.pexels.com/photos/7148445/pexels-photo-7148445.jpeg', locked: false },
      { id: 'hotel', title: '酒店', subtitle: '入住 / 退房', cover: '/images/vocab/hotel.jpg', locked: false },
    ],
  },
  {
    id: 'hsk',
    title: 'HSK',
    description: 'HSK词汇',
    cover: 'https://images.pexels.com/photos/4769486/pexels-photo-4769486.jpeg',
    items: [
      { id: 'hsk1', title: 'HSK1 ', subtitle: '基础高频', cover: 'https://images.pexels.com/photos/261651/pexels-photo-261651.jpeg', locked: false },
    ],
  },
  {
    id: 'new hsk',
    title: 'new HSK',
    description: '新HSK词汇',
    cover: 'https://images.pexels.com/photos/4769486/pexels-photo-4769486.jpeg',
    items: [
      { id: 'hsk3', title: 'New HSK3 ', subtitle: '基础高频', cover: 'https://images.pexels.com/photos/19071689/pexels-photo-19071689.jpeg', locked: false },
    ],
  },
  
];
