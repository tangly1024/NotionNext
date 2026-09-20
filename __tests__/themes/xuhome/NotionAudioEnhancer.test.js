import { render } from '@testing-library/react'
import NotionAudioEnhancer from '@/themes/xuhome/components/NotionAudioEnhancer'

jest.mock('@/themes/xuhome/components/AudioPlayer', () => ({
  __esModule: true,
  default: ({ src }) => <div data-testid='xuhome-audio-player'>{src}</div>
}))

describe('XuHome NotionAudioEnhancer', () => {
  it('mounts a custom player without deleting the native audio', () => {
    document.body.innerHTML = `
      <article id="notion-article">
        <div class="notion-audio">
          <audio src="https://example.com/audio.mp3"></audio>
        </div>
      </article>
    `

    const audio = document.querySelector('audio')
    const { getByTestId, unmount } = render(
      <NotionAudioEnhancer post={{ id: 'post-1' }} />
    )

    expect(audio).toBeInTheDocument()
    expect(audio.style.display).toBe('none')
    expect(getByTestId('xuhome-audio-player')).toHaveTextContent(
      'https://example.com/audio.mp3'
    )

    unmount()

    expect(audio).toBeInTheDocument()
    expect(audio.style.display).toBe('')
    expect(
      document.querySelector('[data-testid="xuhome-audio-player"]')
    ).not.toBeInTheDocument()
  })
})
