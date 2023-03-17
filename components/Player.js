import React from 'react'
import BLOG from '@/blog.config'

const Player = () => {
  const [player, setPlayer] = React.useState()
  const ref = React.useRef(null)

  const showLrc = JSON.parse(BLOG.MUSIC_PLAYER_SHOW_LRC)
  const playerVisible = JSON.parse(BLOG.MUSIC_PLAYER_VISIBLE)
  const autoPlay = JSON.parse(BLOG.MUSIC_PLAYER_AUTO_PLAY)

  const meting = JSON.parse(BLOG.MUSIC_PLAYER_METING)

  React.useEffect(() => {
    if (!meting && window.APlayer) {
      setPlayer(new window.APlayer({
        container: ref.current,
        fixed: true,
        showlrc: showLrc,
        autoplay: autoPlay,
        order: BLOG.MUSIC_PLAYER_ORDER,
        audio: BLOG.MUSIC_PLAYER_AUDIO_LIST
      }))
    }
    return () => {
      setPlayer(undefined)
    }
  }, [])

  return (
    <div className={playerVisible ? 'visible' : 'invisible'}>
      <link
        rel="stylesheet"
        type="text/css"
        href="https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/aplayer/1.10.1/APlayer.min.css"
      />
      {meting
        ? <meting-js
            fixed="true"
            type="playlist"
            preload="auto"
            lrc-type={BLOG.MUSIC_PLAYER_METING_LRC_TYPE}
            autoplay={autoPlay}
            order={BLOG.MUSIC_PLAYER_ORDER}
            server={BLOG.MUSIC_PLAYER_METING_SERVER}
            id={BLOG.MUSIC_PLAYER_METING_ID}
          />
        : <div ref={ref} data-player={player} />
      }
    </div>
  )
}

export default Player
