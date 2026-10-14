import { getPublicPostBlockMap } from '@/lib/utils/publicPost'

const post = { id: 'public', title: 'Public' }
const raw = {
  block: {
    public: { value: { id: 'public', type: 'page', content: ['private'] } },
    private: { value: { id: 'private', type: 'page', parent_id: 'public', content: ['secret'] } },
    secret: { value: { id: 'secret', type: 'text', parent_id: 'private', properties: { title: [['PRIVATE_TEXT']] } } }
  },
  signed_urls: { secret: 'https://example.invalid/private-file' }
}

it('filters protected descendants before previews, RSS and search consume public blocks', () => {
  const result = getPublicPostBlockMap(post, raw, [{ id: 'private', password: 'protected' }])
  expect(Object.keys(result.block)).toEqual(['public'])
  expect(result.block.public.value.content).toEqual([])
  expect(result.signed_urls).toEqual({})
  expect(JSON.stringify(result)).not.toContain('PRIVATE_TEXT')
  expect(JSON.stringify(raw)).toContain('PRIVATE_TEXT')
})

it('never returns protected root content to a public caller', () => {
  expect(getPublicPostBlockMap({ ...post, password: 'protected' }, raw)).toEqual({ block: {} })
})
