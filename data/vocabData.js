// 现在这个文件是纯数据，没有任何 React 或浏览器依赖
export const vocabCategories = {
  health: {
    id: 'health',
    title: '健康医疗',
    headerBg: 'from-orange-400 to-red-500',
    iconEmoji: '🚑', // 使用 Emoji
    levels: [
      {
        id: 'lv2',
        title: 'Lv.2初级',
        desc: '能简单交流，但不够流畅',
        items: [
          { id: 'hospital', title: '去医院挂号', subtitle: 'Going to the hospital / ဆေးရုံသွား', cover: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=150&q=80', locked: false }
        ]
      },
      {
        id: 'lv3',
        title: 'Lv.3中级',
        desc: '口语经验较丰富，表达比较流利',
        items: [
          { id: 'treatment', title: '讨论治疗方案', subtitle: 'How effective is this treatment...', cover: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=150&q=80', locked: false },
          { id: 'side-effects', title: '了解药物副作用', subtitle: 'What are the side effects of this...', cover: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=150&q=80', locked: true },
          { id: 'prevention', title: '询问预防措施', subtitle: 'How should I prevent this disea...', cover: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=150&q=80', locked: true }
        ]
      }
    ]
  },
  travel: {
    id: 'travel',
    title: '旅游出行',
    headerBg: 'from-sky-400 to-blue-600',
    iconEmoji: '✈️',
    levels: [
       {
        id: 'airport',
        title: '机场与航班',
        desc: '办理登机与安检',
        items: [
          { id: 'checkin', title: '办理登机牌', subtitle: 'Check in for flight', cover: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=150&q=80', locked: false }
        ]
      }
    ]
  }
};

export const getAllCategoryIds = () => Object.keys(vocabCategories);
export const getCategoryData = (id) => vocabCategories[id];
