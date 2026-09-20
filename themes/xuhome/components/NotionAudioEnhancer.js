import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import AudioPlayer from './AudioPlayer'

const enhanceAudio = () => {
  const containers = document.querySelectorAll('#notion-article .notion-audio')
  const players = []

  containers.forEach(container => {
    const nativeAudio = container.querySelector('audio')
    const src = nativeAudio?.getAttribute('src')
    if (!src) return

    const originalDisplay = nativeAudio.style.display
    nativeAudio.style.display = 'none'
    const mount = document.createElement('div')
    container.appendChild(mount)
    players.push({ mount, nativeAudio, originalDisplay, src })
  })

  return players
}

export default function NotionAudioEnhancer({ post }) {
  const [players, setPlayers] = useState([])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const enhanced = enhanceAudio()
    setPlayers(enhanced)
    return () =>
      enhanced.forEach(({ mount, nativeAudio, originalDisplay }) => {
        mount.remove()
        nativeAudio.style.display = originalDisplay
      })
  }, [post?.id])

  return (
    <>
      {players.map(({ mount, src }) =>
        createPortal(<AudioPlayer src={src} />, mount)
      )}
    </>
  )
}
