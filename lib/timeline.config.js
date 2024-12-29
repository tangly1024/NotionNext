export const TIMELINE_CONFIG = {
  timelines: [
    {
      period: 'EDU',
      startDate: '2020-09-01',
      endDate: '2025-07-01',
      milestones: [
        { date: '2020-09-01', label: '入学', type: 1 },
        { date: '2025-07-01', label: '毕业', type: 0 }
      ]
    },
    {
      period: 'WORK',
      startDate: '2023-05-01',
      endDate: '2025-12-31',
      milestones: [
        { date: '2023-05-01至2023-08-31', label: '江苏金盾实习', type: 1 },
        { date: '2024-08-01', label: '货拉拉实习', type: 0 },
      ]
    }
  ]
}; 