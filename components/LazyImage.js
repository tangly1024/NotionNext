import Head from 'next/head'
import React, { useEffect, useRef, useState } from 'react'

/**
 * 默认懒加载占位图
 */
const loadingSVG = (
    <svg
        width="100"
        height="100"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        fill="#ccc"
    >
        <circle cx="50" cy="50" r="42" strokeWidth="8" />
    </svg>
)

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
  placeholderSrc = loadingSVG,
  className,
  width,
  height,
  onLoad,
  style
}) {
  const imageRef = useRef(null)
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleImageLoad = () => {
    setImageLoaded(true)
    if (typeof onLoad === 'function') {
      onLoad() // 触发传递的onLoad回调函数
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const lazyImage = entry.target
            lazyImage.src = src
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
  }, [src])

  // 动态添加width、height和className属性，仅在它们为有效值时添加
  const imgProps = {
    ref: imageRef,
    src: imageLoaded ? src : placeholderSrc,
    alt: alt,
    onLoad: handleImageLoad
  }

  if (id) {
    imgProps.id = id
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
  return (<>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img {...imgProps} />
        {/* 预加载 */}
        {priority && <Head>
            <link rel='preload' as='image' src={src} />
        </Head>}
    </>)
}
