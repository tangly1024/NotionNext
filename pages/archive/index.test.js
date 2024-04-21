import { getStaticProps } from './index'

describe('getStaticProps', () => {
  it('should return the correct props', async () => {
    // Mock the getGlobalData function
    const getGlobalData = jest.fn().mockResolvedValue({
      allPages: [
        { type: 'Post', status: 'Published', publishDate: new Date('2022-01-01') },
        { type: 'Post', status: 'Published', publishDate: new Date('2022-02-01') },
        { type: 'Post', status: 'Draft', publishDate: new Date('2022-03-01') },
      ]
    })

    // Mock the BLOG.NEXT_REVALIDATE_SECOND value
    const BLOG = { NEXT_REVALIDATE_SECOND: '3600' }

    // Call the getStaticProps function
    const result = await getStaticProps({ getGlobalData, BLOG })

    // Assert the expected props
    expect(result.props.posts).toEqual([
      { type: 'Post', status: 'Published', publishDate: new Date('2022-02-01') },
      { type: 'Post', status: 'Published', publishDate: new Date('2022-01-01') },
    ])
    expect(result.props.archivePosts).toEqual({
      '2022-01': [{ type: 'Post', status: 'Published', publishDate: new Date('2022-01-01') }],
      '2022-02': [{ type: 'Post', status: 'Published', publishDate: new Date('2022-02-01') }],
    })
    expect(result.revalidate).toBe(3600)
  })
})import { getStaticProps } from './index'

describe('getStaticProps', () => {
  it('should return the correct props', async () => {
    // Mock the getGlobalData function
    const getGlobalData = jest.fn().mockResolvedValue({
      allPages: [
        { type: 'Post', status: 'Published', publishDate: new Date('2022-01-01') },
        { type: 'Post', status: 'Published', publishDate: new Date('2022-02-01') },
        { type: 'Post', status: 'Published', publishDate: new Date('2022-01-01') },
      ],
    })

    // Mock the BLOG.NEXT_REVALIDATE_SECOND value
    const BLOG = { NEXT_REVALIDATE_SECOND: '3600' }

    // Call the getStaticProps function
    const result = await getStaticProps()

    // Assert the returned props
    expect(result.props).toEqual({
      posts: [
        { type: 'Post', status: 'Published', publishDate: new Date('2022-02-01') },
        { type: 'Post', status: 'Published', publishDate: new Date('2022-01-01') },
        { type: 'Post', status: 'Published', publishDate: new Date('2022-01-01') },
      ],
      archivePosts: {
        '2022-02': [
          { type: 'Post', status: 'Published', publishDate: new Date('2022-02-01') },
        ],
        '2022-01': [
          { type: 'Post', status: 'Published', publishDate: new Date('2022-01-01') },
          { type: 'Post', status: 'Published', publishDate: new Date('2022-01-01') },
        ],
      },
    })

    // Assert the revalidate value
    expect(result.revalidate).toBe(3600)

    // Assert the getGlobalData function was called with the correct arguments
    expect(getGlobalData).toHaveBeenCalledWith({ from: 'archive-index' })
  })
})