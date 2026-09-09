import { convertFileCdnUrl } from '@/lib/db/notion/convertFileCdnUrl'

describe('convertFileCdnUrl', () => {
  it('converts a signed file.notion.com URL back to an attachment id (query ignored)', () => {
    expect(
      convertFileCdnUrl(
        'https://file.notion.com/f/f/427487c8-7fd8-81dc-a5ee-00034e84d0b0/89da7f2e-0215-4515-8cc8-204d6646257f/image.png?table=block&id=3ab487c8-7fd8-80df-b976-e74078232d32&expirationTimestamp=1788177600000&signature=fx0OMJ1HtDqyvEnip_13WIyuXP4jE203Sq1ZCQ-DFN0'
      )
    ).toBe('attachment:89da7f2e-0215-4515-8cc8-204d6646257f:image.png')
  })

  it('decodes percent-encoded filenames', () => {
    expect(
      convertFileCdnUrl(
        'https://file.notion.com/f/f/427487c8-7fd8-81dc-a5ee-00034e84d0b0/89da7f2e-0215-4515-8cc8-204d6646257f/%E5%9B%BE%E7%89%87%20screenshot.png'
      )
    ).toBe('attachment:89da7f2e-0215-4515-8cc8-204d6646257f:图片 screenshot.png')
  })

  it('also covers the file.notion.so host', () => {
    expect(
      convertFileCdnUrl(
        'https://file.notion.so/f/f/427487c8-7fd8-81dc-a5ee-00034e84d0b0/89da7f2e-0215-4515-8cc8-204d6646257f/cover.png'
      )
    ).toBe('attachment:89da7f2e-0215-4515-8cc8-204d6646257f:cover.png')
  })

  it('returns null for non-file-CDN URLs (left untouched by callers)', () => {
    expect(
      convertFileCdnUrl(
        'https://www.notion.so/image/attachment%3A89da7f2e-0215-4515-8cc8-204d6646257f%3Aimage.png?table=block&id=3ab487c8'
      )
    ).toBeNull()
    expect(
      convertFileCdnUrl(
        'https://prod-files-secure.s3.us-west-2.amazonaws.com/427487c8/89da7f2e/image.png'
      )
    ).toBeNull()
    expect(
      convertFileCdnUrl('attachment:89da7f2e-0215-4515-8cc8-204d6646257f:image.png')
    ).toBeNull()
  })

  it('returns null for malformed input', () => {
    expect(convertFileCdnUrl('not a url')).toBeNull()
    expect(convertFileCdnUrl(null)).toBeNull()
    expect(convertFileCdnUrl('')).toBeNull()
    // missing filename segment: /f/f/{spaceId}/{attachmentId} only
    expect(
      convertFileCdnUrl(
        'https://file.notion.com/f/f/427487c8-7fd8-81dc-a5ee-00034e84d0b0/89da7f2e-0215-4515-8cc8-204d6646257f'
      )
    ).toBeNull()
  })
})
