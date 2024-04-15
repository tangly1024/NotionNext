import * as React from 'react'

import { cs } from '../utils'

const qs = (params: Record<string, string>) => {
  return Object.keys(params)
    .map(
      (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
    )
    .join('&')
}

export const LiteYouTubeEmbed: React.FC<{
  id: string
  defaultPlay?: boolean
  mute?: boolean
  lazyImage?: boolean
  iframeTitle?: string
  alt?: string
  params?: Record<string, string>
  adLinksPreconnect?: boolean
  style?: React.CSSProperties
  className?: string
}> = ({
  id,
  defaultPlay = false,
  mute = false,
  lazyImage = false,
  iframeTitle = 'YouTube video',
  alt = 'Video preview',
  params = {},
  adLinksPreconnect = true,
  style,
  className
}) => {
  const muteParam = mute || defaultPlay ? '1' : '0' // Default play must be muted
  const queryString = React.useMemo(
    () => qs({ autoplay: '1', mute: muteParam, ...params }),
    [muteParam, params]
  )
  // const mobileResolution = 'hqdefault'
  // const desktopResolution = 'maxresdefault'
  const resolution = 'hqdefault'
  const posterUrl = `https://i.ytimg.com/vi/${id}/${resolution}.jpg`
  const ytUrl = 'https://www.youtube-nocookie.com'
  const iframeSrc = `${ytUrl}/embed/${id}?${queryString}`

  const [isPreconnected, setIsPreconnected] = React.useState(false)
  const [iframeInitialized, setIframeInitialized] = React.useState(defaultPlay)
  const [isIframeLoaded, setIsIframeLoaded] = React.useState(false)

  const warmConnections = React.useCallback(() => {
    if (isPreconnected) return
    setIsPreconnected(true)
  }, [isPreconnected])

  const onLoadIframe = React.useCallback(() => {
    if (iframeInitialized) return
    setIframeInitialized(true)
  }, [iframeInitialized])

  const onIframeLoaded = React.useCallback(() => {
    setIsIframeLoaded(true)
  }, [])

  return (
    <>
      <link rel='preload' href={posterUrl} as='image' />

      {isPreconnected && (
        <>
          {/* The iframe document and most of its subresources come from youtube.com */}
          <link rel='preconnect' href={ytUrl} />

          {/* The botguard script is fetched off from google.com */}
          <link rel='preconnect' href='https://www.google.com' />
        </>
      )}

      {isPreconnected && adLinksPreconnect && (
        <>
          {/* Not certain if these ad related domains are in the critical path. Could verify with domain-specific throttling. */}
          <link rel='preconnect' href='https://static.doubleclick.net' />
          <link rel='preconnect' href='https://googleads.g.doubleclick.net' />
        </>
      )}

      <div
        onClick={onLoadIframe}
        onPointerOver={warmConnections}
        className={cs(
          'notion-yt-lite',
          isIframeLoaded && 'notion-yt-loaded',
          iframeInitialized && 'notion-yt-initialized',
          className
        )}
        style={style}
      >
        <img
          src={posterUrl}
          className='notion-yt-thumbnail'
          loading={lazyImage ? 'lazy' : undefined}
          alt={alt}
        />

        <div className='notion-yt-playbtn' />

        {iframeInitialized && (
          <iframe
            width='560'
            height='315'
            frameBorder='0'
            allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
            title={iframeTitle}
            src={iframeSrc}
            onLoad={onIframeLoaded}
          />
        )}
      </div>
    </>
  )
}
