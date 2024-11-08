import { useEffect, useRef, useState } from 'react'
import PostItemCard from './PostItemCard'

/**
 * 滑动走马灯
 * @param {*} param0
 * @returns
 */
const InertiaCarousel = ({ posts }) => {
  const carouselRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [lastX, setLastX] = useState(0) // 上一次的位置
  const [velocity, setVelocity] = useState(0)
  const animationRef = useRef(null)

  // 开始拖拽事件
  const startDrag = e => {
    e.preventDefault()
    setIsDragging(true)
    const startPosition = e.pageX || e.touches?.[0].pageX
    setStartX(startPosition - carouselRef.current.offsetLeft)
    setScrollLeft(carouselRef.current.scrollLeft)
    setLastX(startPosition) // 初始化上一次的位置
    cancelInertiaScroll() // 停止任何正在进行的惯性动画
  }

  // 拖拽中事件
  const duringDrag = e => {
    if (!isDragging) return
    e.preventDefault()
    const currentPosition = e.pageX || e.touches[0].pageX
    const distance = currentPosition - startX
    carouselRef.current.scrollLeft = scrollLeft - distance

    // 计算当前速度
    const deltaX = currentPosition - lastX
    setVelocity(deltaX) // 更新速度
    setLastX(currentPosition) // 更新 lastX 为当前位置
  }

  // 结束拖拽事件，启动惯性滚动
  const endDrag = () => {
    setIsDragging(false)
    startInertiaScroll(velocity) // 根据最终速度启动惯性滚动
  }

  // 惯性滚动函数
  const startInertiaScroll = initialVelocity => {
    let currentVelocity = initialVelocity
    const decay = 0.95 // 惯性衰减系数
    const animate = () => {
      if (Math.abs(currentVelocity) > 0.5) {
        // 仅当速度足够大时继续滚动
        carouselRef.current.scrollLeft -= currentVelocity
        currentVelocity *= decay // 速度衰减
        animationRef.current = requestAnimationFrame(animate)
      } else {
        cancelAnimationFrame(animationRef.current)
      }
    }
    animate()
  }

  // 取消惯性滚动
  const cancelInertiaScroll = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
  }

  useEffect(() => {
    return () => cancelInertiaScroll() // 清除动画
  }, [])

  return (
    <div
      ref={carouselRef}
      className={`flex w-screen overflow-x-auto space-x-6 ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      onMouseDown={startDrag}
      onMouseMove={duringDrag}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
      onTouchStart={startDrag}
      onTouchMove={duringDrag}
      onTouchEnd={endDrag}
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      {/* Carousel items */}

      <div className='min-w-[5vw] md:min-w-[27vw]' />
      {posts &&
        posts?.map((post, index) => (
          <PostItemCard
            className='min-w-[80vw] md:min-w-[50vw]  w-full flex items-end justify-center'
            key={index}
            post={post}
          />
        ))}
    </div>
  )
}

export default InertiaCarousel
