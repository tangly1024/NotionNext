// __tests__/lib/plugins/wordCount.test.js
import { countWords } from '@/lib/plugins/wordCount'

describe('wordCount Plugin', () => {
  it('counts English words correctly', () => {
    const text = 'This is a test with multiple words in English.'
    const { wordCount, readTime } = countWords(text)
    
    expect(wordCount).toBeGreaterThan(0)
    expect(readTime).toBeGreaterThan(0)
  })

  it('counts Chinese characters correctly', () => {
    const text = '这是一段中文测试文本，用于测试字数统计功能。'
    const { wordCount, readTime } = countWords(text)
    
    expect(wordCount).toBeGreaterThan(0)
    expect(readTime).toBeGreaterThan(0)
  })

  it('counts mixed language text', () => {
    const text = 'Hello 世界 this is 测试 text'
    const { wordCount, readTime } = countWords(text)
    
    expect(wordCount).toBeGreaterThan(0)
    expect(readTime).toBeGreaterThan(0)
  })

  it('handles empty string', () => {
    const { wordCount, readTime } = countWords('')
    
    expect(wordCount).toBe(0)
    expect(readTime).toBe(1) // Minimum 1 minute
  })

  it('handles null input', () => {
    const { wordCount, readTime } = countWords(null)
    
    expect(wordCount).toBe(0)
    expect(readTime).toBe(1)
  })

  it('calculates read time based on 400 words per minute', () => {
    const text = 'word '.repeat(800) // 800 words
    const { wordCount, readTime } = countWords(text)
    
    expect(readTime).toBeGreaterThanOrEqual(2) // 800/400 = 2 minutes
  })

  it('handles text with special characters', () => {
    const text = 'Test @#$% with 特殊字符 and symbols!'
    const { wordCount, readTime } = countWords(text)
    
    expect(wordCount).toBeGreaterThan(0)
  })

  it('handles text with line breaks', () => {
    const text = 'Line 1\nLine 2\nLine 3'
    const { wordCount, readTime } = countWords(text)
    
    expect(wordCount).toBeGreaterThan(0)
  })
})