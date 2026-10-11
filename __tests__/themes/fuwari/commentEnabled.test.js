/**
 * @jest-environment node
 */

import { isCommentServiceConfigured } from '@/themes/fuwari/utils/commentEnabled'

jest.mock('@/lib/config', () => ({
  siteConfig: jest.fn()
}))

const { siteConfig } = require('@/lib/config')

/** 与 components/Comment.js 里实际渲染评论源的条件一一对应 */
const serviceKeys = [
  ['COMMENT_ARTALK_SERVER', 'https://artalk.example.com'],
  ['COMMENT_TWIKOO_ENV_ID', 'twikoo-env-id'],
  ['COMMENT_WALINE_SERVER_URL', 'https://waline.example.com'],
  ['COMMENT_VALINE_APP_ID', 'valine-app-id'],
  ['COMMENT_GISCUS_REPO', 'owner/repo'],
  ['COMMENT_CUSDIS_APP_ID', 'cusdis-app-id'],
  ['COMMENT_UTTERRANCES_REPO', 'owner/repo'],
  ['COMMENT_GITALK_CLIENT_ID', 'gitalk-client-id'],
  ['COMMENT_WEBMENTION_ENABLE', true]
]

describe('isCommentServiceConfigured', () => {
  beforeEach(() => {
    siteConfig.mockReset()
    siteConfig.mockReturnValue(null)
  })

  it('returns false when nothing is configured', () => {
    expect(isCommentServiceConfigured()).toBe(false)
  })

  it.each(serviceKeys)(
    'returns true when %s is configured',
    (key, value) => {
      siteConfig.mockImplementation(k => (k === key ? value : null))

      expect(isCommentServiceConfigured()).toBe(true)
    }
  )

  it('returns true for NotionComments when COMMENT_NOTION_ENABLE is boolean true', () => {
    siteConfig.mockImplementation(k =>
      k === 'COMMENT_NOTION_ENABLE' ? true : null
    )

    expect(isCommentServiceConfigured()).toBe(true)
  })

  it('returns true for NotionComments when COMMENT_NOTION_ENABLE is the string "true"', () => {
    siteConfig.mockImplementation(k =>
      k === 'COMMENT_NOTION_ENABLE' ? 'true' : null
    )

    expect(isCommentServiceConfigured()).toBe(true)
  })

  it('keeps NotionComments off for a non-true value', () => {
    siteConfig.mockImplementation(k =>
      k === 'COMMENT_NOTION_ENABLE' ? 'false' : null
    )

    expect(isCommentServiceConfigured()).toBe(false)
  })
})
