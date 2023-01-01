import React from 'react'
import BLOG from '@/blog.config'

const Player = () => {
  const [player, setPlayer] = React.useState()
  const ref = React.useRef(null)

  React.useEffect(() => {
    if (BLOG.MUSIC_PLAYER && !BLOG.MUSIC_PLAYER_METING) {
      setPlayer(new window.APlayer({
        container: ref.current,
        fixed: true,
        showlrc: BLOG.MUSIC_PLAYER_SHOW_LRC,
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
    <div className={BLOG.MUSIC_PLAYER_VISIBLE ? 'visible' : 'invisible'}>
      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/aplayer/1.10.1/APlayer.min.css"
      />
      {BLOG.MUSIC_PLAYER && BLOG.MUSIC_PLAYER_METING
        ? <meting-js
            fixed
            type="playlist"
            order={BLOG.MUSIC_PLAYER_ORDER}
            autoplay={BLOG.MUSIC_PLAYER_AUTO_PLAY}
            server={BLOG.MUSIC_PLAYER_METING_SERVER}
            id={BLOG.MUSIC_PLAYER_METING_ID}
          />
        : <div ref={ref} data-player={player} />
      }
    </div>
  )
}

export default Player
