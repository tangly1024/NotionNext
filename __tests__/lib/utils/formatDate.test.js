// __tests__/lib/utils/formatDate.test.js
import formatDate, { formatDateFmt } from '@/lib/utils/formatDate'

// Mock BLOG config
jest.mock('@/blog.config', () => ({
  LANG: 'en-US'
}))

describe('formatDate', () => {
  it('formats date in English locale', () => {
    const date = '2024-01-15'
    const result = formatDate(date, 'en-US')
    expect(result).toContain('Jan')
    expect(result).toContain('14')
    expect(result).toContain('2024')
  })

  it('formats date in Chinese locale with dashes', () => {
    const date = '2024-01-15'
    const result = formatDate(date, 'zh-CN')
    expect(result).toContain('2024')
    expect(result).toContain('-')
  })

  it('handles invalid date', () => {
    expect(formatDate(null)).toBe('')
    expect(formatDate(undefined)).toBe('')
  })

  it('handles missing locale', () => {
    const date = '2024-01-15'
    expect(formatDate(date, null)).toBe(date)
  })
})

describe('formatDateFmt', () => {
  it('formats timestamp with custom format', () => {
    const timestamp = new Date('2024-01-15 10:30:45').getTime()
    
    expect(formatDateFmt(timestamp, 'yyyy-MM-dd')).toBe('2024-01-15')
    expect(formatDateFmt(timestamp, 'yyyy/MM/dd')).toBe('2024/01/15')
  })

  it('formats time components', () => {
    const timestamp = new Date('2024-01-15 10:30:45').getTime()
    
    expect(formatDateFmt(timestamp, 'hh:mm:ss')).toBe('10:30:45')
  })

  it('formats with mixed patterns', () => {
    const timestamp = new Date('2024-01-15 10:30:45').getTime()
    const result = formatDateFmt(timestamp, 'yyyy-MM-dd hh:mm:ss')
    
    expect(result).toContain('2024-01-15')
    expect(result).toContain('10:30:45')
  })

  it('handles quarter format', () => {
    const timestamp = new Date('2024-04-15').getTime()
    const result = formatDateFmt(timestamp, 'yyyy-qq')
    
    expect(result).toContain('2024')
    expect(result).toContain('2') // Q2
  })
})