export const oralCategories = [
  {
    id: 'daily',
    title: '日常交流',
    description: '打招呼、介绍、感谢、寒暄',
    icon: '👋',
    accent: '#F97316',
    items: [
      {
        id: 'greeting',
        title: '打招呼',
        subtitle: '你好 / 再见 / 早上好',
        icon: '😊',
        locked: false,
      },
      {
        id: 'thanks',
        title: '感谢道歉',
        subtitle: '谢谢 / 对不起',
        icon: '🙏',
        locked: false,
      },
    ],
  },
  {
    id: 'travel',
    title: '旅游出行',
    description: '机场、酒店、问路、交通',
    icon: '✈️',
    accent: '#2563EB',
    items: [
      {
        id: 'airport',
        title: '机场常用',
        subtitle: '值机 / 安检 / 登机口',
        icon: '🛫',
        locked: false,
      },
      {
        id: 'hotel',
        title: '酒店入住',
        subtitle: '预订 / 入住 / 退房',
        icon: '🏨',
        locked: false,
      },
    ],
  },
];
