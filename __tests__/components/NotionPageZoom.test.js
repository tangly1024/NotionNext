import { act, fireEvent, render, screen } from '@testing-library/react'
import mediumZoom from '@fisch0920/medium-zoom'
import NotionPage from '@/components/NotionPage'
import { mapImgUrl } from '@/lib/db/notion/mapImage'

const mockConfig = { IMAGE_ZOOM_IN_WIDTH: 1920 }
jest.mock('@/lib/config', () => ({
  siteConfig: (key, fallback) => mockConfig[key] ?? fallback
}))
jest.mock('@/blog.config', () => ({ NOTION_HOST: 'https://www.notion.so' }))
jest.mock('@/lib/utils', () => ({ isBrowser: true, loadExternalResource: jest.fn() }))
jest.mock('@/components/NotionEmbed', () => () => null)
jest.mock('@/components/NotionLink', () => () => null)
jest.mock('@/components/OriginalityProof', () => () => null)
jest.mock('react-notion-x', () => ({
  NotionRenderer: ({ recordMap }) => <>
    {recordMap.images.map(image => (
      // eslint-disable-next-line @next/next/no-img-element
      <img key={image.id} alt={image.id} src={image.src} data-zoom-src={image.zoomSrc} />
    ))}
  </>
}))

const proxyImage = id => mapImgUrl(
  `https://images.unsplash.com/${id}?crop=faces`,
  { id, type: 'image', format: { block_width: 400 } }
)
const imagePost = (src = proxyImage('photo-test')) => ({
  id: 'post', blockMap: { images: [{ id: 'photo', src }] }
})
const sourceWidth = image => new URL(
  decodeURIComponent(new URL(image).pathname.split('/image/')[1])
).searchParams.get('width')

let clones
let zooms
beforeEach(() => {
  jest.useFakeTimers()
  mockConfig.IMAGE_ZOOM_IN_WIDTH = 1920
  clones = []
  zooms = []
  jest.spyOn(HTMLImageElement.prototype, 'cloneNode').mockImplementation(function (deep) {
    const clone = Node.prototype.cloneNode.call(this, deep)
    clones.push(clone)
    return clone
  })
  jest.spyOn(HTMLImageElement.prototype, 'naturalWidth', 'get').mockReturnValue(400)
  jest.spyOn(HTMLImageElement.prototype, 'naturalHeight', 'get').mockReturnValue(300)
  jest.spyOn(HTMLImageElement.prototype, 'getBoundingClientRect').mockReturnValue({
    x: 0, y: 0, top: 0, left: 0, width: 400, height: 300, right: 400, bottom: 300
  })
})

afterEach(() => {
  zooms.forEach(zoom => zoom.detach())
  document.body.classList.remove('medium-zoom--opened')
  jest.clearAllTimers()
  jest.useRealTimers()
})

function openZoom(image) {
  const zoom = mediumZoom(image)
  zooms.push(zoom)
  const firstClone = clones.length
  let opened
  act(() => { opened = zoom.open({ target: image }) })
  const thumbnail = clones[firstClone]
  const hd = clones[firstClone + 1]
  return {
    thumbnail,
    hd,
    async finish({ fail = false } = {}) {
      if (hd) {
        if (fail) fireEvent.error(hd)
        else Object.defineProperty(hd, 'complete', { configurable: true, value: true })
      }
      await act(async () => {
        jest.advanceTimersByTime(20)
        fireEvent.transitionEnd(thumbnail)
        await opened
      })
    },
    async close() {
      await act(async () => {
        const closed = zoom.close()
        fireEvent.transitionEnd(thumbnail)
        await closed
      })
    }
  }
}

test('medium-zoom creates a body-level HD clone from the proxied source before opening', async () => {
  const post = imagePost()
  render(<NotionPage post={post} />)
  const image = screen.getByAltText('photo')
  const session = openZoom(image)

  expect(session.hd).toBeDefined()
  expect(sourceWidth(session.hd.src)).toBe('1920')
  expect(new URL(session.hd.src).search).toBe(new URL(image.src).search)
  await session.finish()
  expect(session.hd.parentElement).toBe(document.body)
  expect(session.hd).toHaveClass('medium-zoom-image--opened')
  expect(image.src).toBe(post.blockMap.images[0].src)
  expect(sourceWidth(image.src)).toBe('400')
  await session.close()
  expect(image).not.toHaveAttribute('data-zoom-src')
  expect(document.querySelector('.medium-zoom-image--opened')).toBeNull()
})

test('images rendered after the initial effect also get a HD source', async () => {
  const post = { id: 'late-post', blockMap: { images: [] } }
  const { rerender } = render(<NotionPage post={post} />)
  post.blockMap.images.push({ id: 'late-photo', src: proxyImage('late-photo') })
  rerender(<NotionPage post={post} />)
  const session = openZoom(screen.getByAltText('late-photo'))
  expect(session.hd).toBeDefined()
  expect(sourceWidth(session.hd.src)).toBe('1920')
  await session.finish()
  await session.close()
})

test('a changed zoom width takes effect without replacing the post', async () => {
  const post = imagePost()
  const { rerender } = render(<NotionPage post={post} />)
  const image = screen.getByAltText('photo')
  fireEvent(image, new CustomEvent('medium-zoom:open'))
  expect(sourceWidth(image.getAttribute('data-zoom-src'))).toBe('1920')
  mockConfig.IMAGE_ZOOM_IN_WIDTH = 2560
  rerender(<NotionPage post={post} />)
  expect(image).not.toHaveAttribute('data-zoom-src')
  const session = openZoom(image)
  expect(sourceWidth(session.hd.src)).toBe('2560')
  await session.finish()
  await session.close()
})

test('route changes and unmount restore temporary attributes and remove listeners', () => {
  const { rerender, unmount, container } = render(<NotionPage post={imagePost()} />)
  const root = container.firstChild
  const image = screen.getByAltText('photo')
  fireEvent(image, new CustomEvent('medium-zoom:open'))
  expect(image).toHaveAttribute('data-zoom-src')
  const next = imagePost(proxyImage('next-photo'))
  rerender(<NotionPage post={next} />)
  expect(image).not.toHaveAttribute('data-zoom-src')
  fireEvent(image, new CustomEvent('medium-zoom:open'))
  expect(decodeURIComponent(image.getAttribute('data-zoom-src'))).toContain('next-photo')
  unmount()
  expect(image).not.toHaveAttribute('data-zoom-src')
  // Keep the detached image under its old root to exercise capture-listener cleanup.
  root.appendChild(image)
  fireEvent(image, new CustomEvent('medium-zoom:open'))
  expect(image).not.toHaveAttribute('data-zoom-src')
})

test('unrecognized public image URLs keep the normal zoom source', async () => {
  const source = 'https://cdn.example/photo.jpg?size=original'
  render(<NotionPage post={imagePost(source)} />)
  const image = screen.getByAltText('photo')
  const session = openZoom(image)
  expect(session.hd).toBeUndefined()
  expect(session.thumbnail.src).toBe(source)
  expect(image).not.toHaveAttribute('data-zoom-src')
  await session.finish()
  await session.close()
})

test('an explicit HD source is preserved through zoom and cleanup', async () => {
  const post = imagePost()
  const explicit = 'https://cdn.example/original.jpg'
  post.blockMap.images[0].zoomSrc = explicit
  const { unmount } = render(<NotionPage post={post} />)
  const image = screen.getByAltText('photo')
  const session = openZoom(image)
  expect(session.hd.src).toBe(explicit)
  await session.finish()
  await session.close()
  expect(image).toHaveAttribute('data-zoom-src', explicit)
  unmount()
  expect(image).toHaveAttribute('data-zoom-src', explicit)
})

test('a failed HD request falls back to the thumbnail and can retry on the next open', async () => {
  const warning = jest.spyOn(console, 'warn').mockImplementation(() => {})
  render(<NotionPage post={imagePost()} />)
  const image = screen.getByAltText('photo')
  const session = openZoom(image)
  expect(session.hd).toBeDefined()
  await session.finish({ fail: true })
  expect(session.hd).not.toBeInTheDocument()
  expect(session.thumbnail).toHaveClass('medium-zoom-image--opened')
  expect(session.thumbnail.src).toBe(image.src)
  expect(warning).toHaveBeenCalledWith(expect.stringContaining('Unable to reach the zoom image target'))
  await session.close()
  expect(image).not.toHaveAttribute('data-zoom-src')
  const retry = openZoom(image)
  expect(sourceWidth(retry.hd.src)).toBe('1920')
  await retry.finish()
  expect(retry.hd).toBeInTheDocument()
  await retry.close()
})

test('an HD image that becomes complete before its error event leaves no orphan copy', async () => {
  jest.spyOn(console, 'warn').mockImplementation(() => {})
  render(<NotionPage post={imagePost()} />)
  const session = openZoom(screen.getByAltText('photo'))
  // Browsers also report complete=true for broken images. The library can append
  // its HD copy from the 10 ms poll before handling the pending error event.
  Object.defineProperty(session.hd, 'complete', { configurable: true, value: true })
  act(() => jest.advanceTimersByTime(20))
  expect(session.hd).toBeInTheDocument()
  act(() => fireEvent.error(session.hd))
  await session.finish()
  await session.close()
  expect(session.hd).not.toBeInTheDocument()
  expect(document.querySelector('.medium-zoom-image--opened')).toBeNull()
})

test('images outside the article do not receive its HD settings', async () => {
  const { unmount } = render(<NotionPage post={imagePost()} />)
  const outside = document.createElement('img')
  outside.src = proxyImage('outside')
  document.body.appendChild(outside)
  const session = openZoom(outside)
  expect(session.hd).toBeUndefined()
  expect(sourceWidth(session.thumbnail.src)).toBe('400')
  await session.finish()
  unmount()
  expect(session.thumbnail).toHaveClass('medium-zoom-image--opened')
  expect(document.body).toHaveClass('medium-zoom--opened')
  await session.close()
})

test('unmount closes the body-level zoom copies and overlay', async () => {
  const { unmount } = render(<NotionPage post={imagePost()} />)
  const image = screen.getByAltText('photo')
  const session = openZoom(image)
  await session.finish()
  unmount()
  expect(image).not.toHaveAttribute('data-zoom-src')
  expect(document.body).not.toHaveClass('medium-zoom--opened')
  act(() => fireEvent.transitionEnd(session.thumbnail))
  expect(document.querySelector('.medium-zoom-image--opened')).toBeNull()
  expect(document.querySelector('.medium-zoom-overlay')).toBeNull()
})

test('unmount during opening waits for the library before closing its zoom', async () => {
  const { unmount } = render(<NotionPage post={imagePost()} />)
  const session = openZoom(screen.getByAltText('photo'))
  unmount()
  await session.finish()
  expect(document.body).not.toHaveClass('medium-zoom--opened')
  act(() => fireEvent.transitionEnd(session.thumbnail))
  expect(document.querySelector('.medium-zoom-image--opened')).toBeNull()
  expect(document.querySelector('.medium-zoom-overlay')).toBeNull()
})

test('switching articles closes the old zoom and leaves the next image zoomable', async () => {
  const { rerender } = render(<NotionPage post={imagePost()} />)
  const session = openZoom(screen.getByAltText('photo'))
  await session.finish()
  rerender(<NotionPage post={imagePost(proxyImage('next-photo'))} />)
  act(() => fireEvent.transitionEnd(session.thumbnail))
  expect(document.querySelector('.medium-zoom-overlay')).toBeNull()
  const next = openZoom(screen.getByAltText('photo'))
  expect(decodeURIComponent(next.hd.src)).toContain('next-photo')
  await next.finish()
  await next.close()
})

test.each(['explicit', 'unrecognized'])('unmount also closes an image with a %s HD source policy', async policy => {
  const post = imagePost()
  if (policy === 'explicit') post.blockMap.images[0].zoomSrc = 'https://cdn.example/original.jpg'
  else post.blockMap.images[0].src = 'https://cdn.example/photo.jpg'
  const { unmount } = render(<NotionPage post={post} />)
  const image = screen.getByAltText('photo')
  const session = openZoom(image)
  await session.finish()
  unmount()
  act(() => fireEvent.transitionEnd(session.thumbnail))
  expect(document.querySelector('.medium-zoom-overlay')).toBeNull()
  if (policy === 'explicit') expect(image).toHaveAttribute('data-zoom-src', 'https://cdn.example/original.jpg')
})
