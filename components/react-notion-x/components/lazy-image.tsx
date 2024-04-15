import * as React from 'react'

import { normalizeUrl } from 'notion-utils'
import { ImageState, LazyImageFull } from 'react-lazy-images'

import { useNotionContext } from '../context'
import { cs } from '../utils'

/**
 * Progressive, lazy images modeled after Medium's LQIP technique.
 */
export const LazyImage: React.FC<{
  src?: string
  alt?: string
  className?: string
  style?: React.CSSProperties
  height?: number
  zoomable?: boolean
  priority?: boolean
}> = ({
  src,
  alt,
  className,
  style,
  zoomable = false,
  priority = false,
  height,
  ...rest
}) => {
  const { recordMap, zoom, previewImages, forceCustomImages, components } =
    useNotionContext()

  const zoomRef = React.useRef(zoom ? zoom.clone() : null)
  const previewImage = previewImages
    ? recordMap?.preview_images?.[src] ??
      recordMap?.preview_images?.[normalizeUrl(src)]
    : null

  const onLoad = React.useCallback(
    (e: any) => {
      if (zoomable && (e.target.src || e.target.srcset)) {
        if (zoomRef.current) {
          ;(zoomRef.current as any).attach(e.target)
        }
      }
    },
    [zoomRef, zoomable]
  )

  const attachZoom = React.useCallback(
    (image: any) => {
      if (zoomRef.current && image) {
        ;(zoomRef.current as any).attach(image)
      }
    },
    [zoomRef]
  )

  const attachZoomRef = React.useMemo(
    () => (zoomable ? attachZoom : undefined),
    [zoomable, attachZoom]
  )

  if (previewImage) {
    const aspectRatio = previewImage.originalHeight / previewImage.originalWidth

    if (components.Image) {
      // TODO: could try using next/image onLoadComplete to replace LazyImageFull
      // while retaining our blur implementation
      return (
        <components.Image
          src={src}
          alt={alt}
          style={style}
          className={className}
          width={previewImage.originalWidth}
          height={previewImage.originalHeight}
          blurDataURL={previewImage.dataURIBase64}
          placeholder='blur'
          priority={priority}
          onLoad={onLoad}
        />
      )
    }

    return (
      <LazyImageFull src={src} {...rest} experimentalDecode={true}>
        {({ imageState, ref }) => {
          const isLoaded = imageState === ImageState.LoadSuccess
          const wrapperStyle: React.CSSProperties = {
            width: '100%'
          }
          const imgStyle: React.CSSProperties = {}

          if (height) {
            wrapperStyle.height = height
          } else {
            imgStyle.position = 'absolute'
            wrapperStyle.paddingBottom = `${aspectRatio * 100}%`
          }

          return (
            <div
              className={cs(
                'lazy-image-wrapper',
                isLoaded && 'lazy-image-loaded',
                className
              )}
              style={wrapperStyle}
            >
              <img
                className='lazy-image-preview'
                src={previewImage.dataURIBase64}
                alt={alt}
                ref={ref}
                style={style}
                decoding='async'
              />

              <img
                className='lazy-image-real'
                src={src}
                alt={alt}
                ref={attachZoomRef}
                style={{
                  ...style,
                  ...imgStyle
                }}
                width={previewImage.originalWidth}
                height={previewImage.originalHeight}
                decoding='async'
                loading='lazy'
              />
            </div>
          )
        }}
      </LazyImageFull>
    )
  } else {
    // TODO: GracefulImage doesn't seem to support refs, but we'd like to prevent
    // invalid images from loading as error states

    /*
      NOTE: Using next/image without a pre-defined width/height is a huge pain in
      the ass. If we have a preview image, then this works fine since we know the
      dimensions ahead of time, but if we don't, then next/image won't display
      anything.
      
      Since next/image is the most common use case for using custom images, and this 
      is likely to trip people up, we're disabling non-preview custom images for now.

      If you have a use case that is affected by this, please open an issue on github.
    */
    if (components.Image && forceCustomImages) {
      return (
        <components.Image
          src={src}
          alt={alt}
          className={className}
          style={style}
          width={null}
          height={height || null}
          priority={priority}
          onLoad={onLoad}
        />
      )
    }

    // Default image element
    return (
      <img
        className={className}
        style={style}
        src={src}
        alt={alt}
        ref={attachZoomRef}
        loading='lazy'
        decoding='async'
        {...rest}
      />
    )
  }
}
