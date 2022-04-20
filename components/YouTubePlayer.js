import { useEffect, useState } from 'react'
import YouTube from 'react-youtube'

export const YouTubePlayer = ({ post }) => {
  const [YTTime, setYTTime] = useState(0)
  let youtubeId
  if (post?.youtube) {
    const YouTubeURL = new URL(post.youtube)
    const params = new URLSearchParams(YouTubeURL.search)
    youtubeId = params.get('v')
    useEffect(() => {
      const onHashChanged = () => {
        const linkHash = window.location.hash
        if (linkHash.includes('youtube')) {
          setYTTime(parseInt(linkHash.replace(/\D/g, '')))
        }
      }
      window.addEventListener('hashchange', onHashChanged)
      const container = document?.getElementById('container')
      const a = container?.getElementsByClassName('notion-link')
      for (let i = 0; i < a.length; i++) {
        if (a[i].href.includes('youtube')) {
          let urlTime
          if (a[i].href.includes('t=')) {
            const itemHref = new URL(a[i].href)
            const itemParams = new URLSearchParams(itemHref.search)
            urlTime = itemParams.get('t')
            const ytAnchor = document?.getElementById(`youtube-time=${urlTime}`)
            if (!ytAnchor) {
              const newYTAnchor = document.createElement('div')
              newYTAnchor.id = `youtube-time=${urlTime}`
              newYTAnchor.classList.add('yt-anchor')
              newYTAnchor.classList.add('notion-header-anchor')
              const videoPlayer =
                document.getElementsByClassName('video-player')
              if (videoPlayer) {
                videoPlayer[0].prepend(newYTAnchor)
              }
            }
          } else {
            const hrefCut = a[i].href.split('=')
            urlTime = hrefCut[1]
          }
          // 把連結換成 hash 並取消點擊連結開新頁
          a[i].href = `#youtube-time=${urlTime}`
          a[i].target = ''
          a[i].rel = ''
        }
      }

      return () => {
        window.removeEventListener('hashchange', onHashChanged)
      }
    }, [])
  }

  return (
    <>
      {youtubeId && (
        <div className="video-player w-full" style={{ aspectRatio: '16/9' }}>
          <YouTube
            videoId={youtubeId}
            opts={{
              width: '100%',
              height: '100%',
              playerVars: {
                start: YTTime,
                autoplay: 1
              }
            }}
          />
        </div>
      )}
    </>
  )
}
