import React from 'react'
import Aplayer from 'aplayer'
import BLOG from '@/blog.config'

const Player = () => {
  const [player, setPlayer] = React.useState()
  const ref = React.useRef(null)

  React.useEffect(() => {
    if (BLOG.MUSIC_PLAYER) {
      setPlayer(new Aplayer({
        container: ref.current,
        fixed: true,
        order: BLOG.MUSIC_PLAYER_ORDER,
        autoplay: BLOG.MUSIC_PLAYER_AUTO_PLAY,
        audio: BLOG.MUSIC_PLAYER_AUDIO_LIST
      }))
    }
    return () => {
      setPlayer(undefined)
    }
  }, [])

  return (
    <div
      ref={ref}
      data-player={player}
      className={BLOG.MUSIC_PLAYER_VISIBLE ? 'visible' : 'invisible'}
    />
  )
}

export default Player
