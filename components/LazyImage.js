import { siteConfig } from '@/lib/config'
import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'
/**
 * 图片懒加载
 * @param {*} param0
 * @returns
 */
export default function LazyImage({
  priority,
  id,
  src,
  alt,
  placeholderSrc,
  className,
  width,
  height,
  title,
  onLoad,
  style
}) {
  const maxWidth = siteConfig('IMAGE_COMPRESS_WIDTH')
  const imageRef = useRef(null)
  const [adjustedSrc, setAdjustedSrc] = useState(
    placeholderSrc || siteConfig('IMG_LAZY_LOAD_PLACEHOLDER')
  )

  if (!placeholderSrc) {
    placeholderSrc = siteConfig('IMG_LAZY_LOAD_PLACEHOLDER')
  }

  /**
   * 图片加载成功回调
   */
  const handleImageLoad = () => {
    if (typeof onLoad === 'function') {
      onLoad() // 触发传递的onLoad回调函数
    }
  }

  useEffect(() => {
    const adjustedImageSrc = adjustImgSize(src, maxWidth)
    setAdjustedSrc(adjustedImageSrc)

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const lazyImage = entry.target
            lazyImage.src = adjustedImageSrc
            observer.unobserve(lazyImage)
          }
        })
      },
      { rootMargin: '50px 0px' } // Adjust the rootMargin as needed to trigger the loading earlier or later
    )

    if (imageRef.current) {
      observer.observe(imageRef.current)
    }

    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current)
      }
    }
  }, [src, maxWidth])

  // 动态添加width、height和className属性，仅在它们为有效值时添加
  const imgProps = {
    ref: imageRef,
    src: priority ? adjustedSrc : placeholderSrc,
    alt: alt,
    onLoad: handleImageLoad
  }

  if (id) {
    imgProps.id = id
  }

  if (title) {
    imgProps.title = title
  }

  if (width && width !== 'auto') {
    imgProps.width = width
  }

  if (height && height !== 'auto') {
    imgProps.height = height
  }
  if (className) {
    imgProps.className = className
  }
  if (style) {
    imgProps.style = style
  }
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img {...imgProps} />
      {/* 预加载 */}
      {priority && (
        <Head>
          <link rel='preload' as='image' href={adjustedSrc} />
        </Head>
      )}
    </>
  )
}
/**
 * 根据窗口尺寸决定压缩图片宽度
 * @param {*} src
 * @param {*} maxWidth
 * @returns
 */

const adjustImgSize = (src, maxWidth) => {
  if (!src) {
    return siteConfig('IMG_LAZY_LOAD_PLACEHOLDER')
  }
  const screenWidth = window.screen.width

  // 屏幕尺寸大于默认图片尺寸，没必要再压缩
  if (screenWidth > maxWidth) {
    return src
  }

  // 正则表达式，用于匹配 URL 中的 width 参数
  const widthRegex = /width=\d+/
  // 正则表达式，用于匹配 URL 中的 w 参数
  const wRegex = /w=\d+/

  // 使用正则表达式替换 width/w 参数
  return src
    .replace(widthRegex, `width=${screenWidth}`)
    .replace(wRegex, `w=${screenWidth}`)
}
