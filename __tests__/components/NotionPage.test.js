import { render, screen } from '@testing-library/react'

let notionRendererMock

jest.mock('react-notion-x', () => {
  notionRendererMock = jest.fn(() => <div data-testid='notion-renderer' />)
  return {
    NotionRenderer: props => notionRendererMock(props)
  }
})

jest.mock('@fisch0920/medium-zoom', () => ({
  __esModule: true,
  default: () => ({
    clone: () => ({
      attach: jest.fn()
    })
  })
}))

import NotionPage from '@/components/NotionPage'

describe('NotionPage', () => {
  it('does not render the Notion renderer when blockMap is missing', () => {
    render(<NotionPage post={{ id: 'post-1', title: 'Broken Post', blockMap: null }} />)

    expect(screen.queryByTestId('notion-renderer')).not.toBeInTheDocument()
    expect(notionRendererMock).not.toHaveBeenCalled()
  })

  it('renders the Notion renderer when block data is present', () => {
    const post = {
      id: 'post-1',
      title: 'Healthy Post',
      blockMap: { block: { a: { value: { id: 'a' } } } }
    }

    render(<NotionPage post={post} />)

    expect(screen.getByTestId('notion-renderer')).toBeInTheDocument()
    expect(notionRendererMock).toHaveBeenCalledWith(
      expect.objectContaining({
        recordMap: post.blockMap
      }),
      {}
    )
  })
})
