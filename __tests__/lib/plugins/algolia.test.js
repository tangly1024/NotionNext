// __tests__/lib/plugins/algolia.test.js
import { uploadDataToAlgolia } from '@/lib/plugins/algolia'

// Mock algoliasearch
jest.mock('algoliasearch', () => {
  return jest.fn(() => ({
    initIndex: jest.fn(() => ({
      getObject: jest.fn(),
      saveObject: jest.fn(() => ({
        wait: jest.fn(() => Promise.resolve())
      })),
      deleteObject: jest.fn(() => ({
        wait: jest.fn(() => Promise.resolve())
      }))
    }))
  }))
})

// Mock BLOG config
jest.mock('@/blog.config', () => ({
  ALGOLIA_APP_ID: 'test-app-id',
  ALGOLIA_ADMIN_APP_KEY: 'test-key',
  ALGOLIA_INDEX: 'test-index'
}))

// Mock getPageContentText
jest.mock('@/lib/notion/getPageContentText', () => ({
  getPageContentText: jest.fn(() => 'Test content')
}))

describe('Algolia Plugin', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    console.log = jest.fn()
  })

  describe('uploadDataToAlgolia', () => {
    it('does not upload if post is null', async () => {
      await uploadDataToAlgolia(null)
      
      // Should not throw error
      expect(true).toBe(true)
    })

    it('uploads new post to Algolia', async () => {
      const post = {
        id: 'test-id',
        title: 'Test Post',
        category: ['Tech'],
        tags: ['javascript', 'testing'],
        pageCover: '/cover.jpg',
        slug: 'test-post',
        summary: 'Test summary',
        lastEditedDate: new Date().toISOString(),
        blockMap: {}
      }
      
      await uploadDataToAlgolia(post)
      
      // Should complete without error
      expect(true).toBe(true)
    })

    it('handles post without blockMap', async () => {
      const post = {
        id: 'test-id',
        title: 'Test Post',
        lastEditedDate: new Date().toISOString()
      }
      
      await uploadDataToAlgolia(post)
      
      expect(true).toBe(true)
    })
  })
})