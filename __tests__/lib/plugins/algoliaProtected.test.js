/** @jest-environment node */
import { uploadDataToAlgolia } from '@/lib/plugins/algolia'
const mockGetObject = jest.fn()
const mockSaveObject = jest.fn()
jest.mock('@/blog.config', () => ({
  ALGOLIA_APP_ID: 'fixture',
  ALGOLIA_ADMIN_APP_KEY: 'fixture',
  ALGOLIA_INDEX: 'fixture'
}))
jest.mock('algoliasearch', () => () => ({
  initIndex: () => ({
    getObject: (...args) => mockGetObject(...args),
    saveObject: (...args) => mockSaveObject(...args)
  })
}))
it('never publishes a protected article even after a successful unlock', async () => {
  await uploadDataToAlgolia({
    id: 'protected',
    password: 'protected',
    blockMap: { block: {} }
  })
  expect(mockGetObject).not.toHaveBeenCalled()
  expect(mockSaveObject).not.toHaveBeenCalled()
})
