export const oralCategories = [
  {
    id: 'daily',
    title: '日常口语',
    description: '打招呼、介绍、感谢、寒暄',
    cover: '/images/oral/bg-daily.jpg', // 一级大卡片封面
    items: [
      {
        id: 'greeting',
        title: '打招呼',
        subtitle: '你好 / 再见 / 早上好',
        cover: '/images/oral/greeting.jpg', // 二级小卡片封面
        locked: false,
      },
      {
        id: 'thanks',
        title: '感谢道歉',
        subtitle: '谢谢 / 对不起',
        cover: '/images/oral/thanks.jpg',
        locked: false,
      },
      {
        id: 'selfintro',
        title: '自我介绍',
        subtitle: '我叫… / 我来自…',
        cover: '/images/oral/selfintro.jpg',
        locked: false,
      },
    ],
  },
  {
    id: 'travel',
    title: '旅游口语',
    description: '机场、酒店、问路、出行',
    cover: '/images/oral/bg-travel.jpg',
    items: [
      {
        id: 'airport',
        title: '机场常用',
        subtitle: '值机 / 安检 / 登机口',
        cover: '/images/oral/airport.jpg',
        locked: false,
      },
      {
        id: 'hotel',
        title: '酒店入住',
        subtitle: '预订 / 入住 / 退房',
        cover: '/images/oral/hotel.jpg',
        locked: false,
      },
      {
        id: 'direction',
        title: '问路指路',
        subtitle: '地铁站 / 左转 / 直走',
        cover: '/images/oral/direction.jpg',
        locked: true,
      },
    ],
  },
  {
    id: 'medical',
    title: '医疗口语',
    description: '挂号、就诊、描述症状',
    cover: '/images/oral/bg-medical.jpg',
    items: [
      {
        id: 'registration',
        title: '挂号就诊',
        subtitle: '挂号 / 看医生',
        cover: '/images/oral/registration.jpg',
        locked: false,
      },
      {
        id: 'symptoms',
        title: '描述症状',
        subtitle: '发烧 / 咳嗽 / 疼痛',
        cover: '/images/oral/symptoms.jpg',
        locked: false,
      },
    ],
  },
];
