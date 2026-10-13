import { hasEnabledComments } from '@/lib/utils/comments'
it.each([
  'COMMENT_ARTALK_SERVER',
  'COMMENT_NOTION_ENABLE',
  'COMMENT_WALINE_SERVER_URL'
])('recognizes standalone %s', key => {
  expect(
    hasEnabledComments(k =>
      k === key
        ? key === 'COMMENT_NOTION_ENABLE'
          ? true
          : 'https://comments.example'
        : ''
    )
  ).toBe(true)
})
it('does not enable a disabled boolean provider', () => {
  expect(hasEnabledComments(() => 'false')).toBe(false)
})
