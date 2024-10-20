import { useRef, useState } from 'react'
import PostItemCard from './PostItemCard'

const Swiper = ({ posts }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef(null)

  // 用于记录触摸开始和结束的水平位置
  const touchStartPos = useRef({ x: 0, y: 0 })
  const touchEndPos = useRef({ x: 0, y: 0 })
  const isHorizontalSwipe = useRef(false)

  const handleTouchStart = e => {
    // 记录初始触摸位置
    touchStartPos.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    }
    isHorizontalSwipe.current = false // 重置滑动方向标志
  }

  const handleTouchMove = e => {
    const touch = e.touches[0]
    const deltaX = touch.clientX - touchStartPos.current.x
    const deltaY = touch.clientY - touchStartPos.current.y

    // 判断是否为水平滑动（避免垂直滑动干扰）
    if (!isHorizontalSwipe.current) {
      isHorizontalSwipe.current = Math.abs(deltaX) > Math.abs(deltaY)
    }

    // 如果是水平滑动，阻止垂直滚动
    if (isHorizontalSwipe.current) {
      e.preventDefault() // 阻止垂直方向的默认滚动行为
    }
  }

  const handleTouchEnd = e => {
    if (isHorizontalSwipe.current) {
      // 记录触摸结束位置
      touchEndPos.current = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY
      }

      // 计算滑动距离
      const deltaX = touchEndPos.current.x - touchStartPos.current.x

      // 如果滑动距离足够大，则决定滑动到下一张或上一张卡片
      const swipeThreshold = 50 // 设置滑动的阈值
      if (deltaX > swipeThreshold) {
        goToPrevious() // 向右滑动，上一张
      } else if (deltaX < -swipeThreshold) {
        goToNext() // 向左滑动，下一张
      } else {
        // 滑动距离不够，回到当前卡片
        scrollToCard(currentIndex)
      }
    }
  }

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? posts.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
    scrollToCard(newIndex)
  }

  const goToNext = () => {
    const newIndex = currentIndex === posts.length - 1 ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
    scrollToCard(newIndex)
  }

  const scrollToCard = index => {
    const container = containerRef.current
    if (!container) return

    const cardWidth = container.scrollWidth / posts.length
    container.scrollTo({
      left: index * cardWidth,
      behavior: 'smooth'
    })
  }

  const handleIndicatorClick = index => {
    setCurrentIndex(index)
    scrollToCard(index)
  }

  return (
    <div className='relative w-full mx-auto'>
      {/* 左侧点击区域 */}
      <div
        className='absolute inset-y-0 left-0 w-1/6 z-10 cursor-move bg-black hover:opacity-10 opacity-0 duration-100'
        onClick={goToPrevious}></div>

      {/* 右侧点击区域 */}
      <div
        className='absolute inset-y-0 right-0 w-1/6 z-10 cursor-move bg-black hover:opacity-10 opacity-0 duration-100'
        onClick={goToNext}></div>

      {/* Swiper Container */}
      <div
        ref={containerRef}
        className='relative w-full overflow-x-scroll scroll-smooth py-4'
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ WebkitOverflowScrolling: 'touch' }} // iOS自然滚动支持
      >
        <div className='flex gap-x-4'>
          {posts.map((item, index) => (
            <div key={index} className='w-5/6 flex-shrink-0'>
              <PostItemCard key={index} post={item} />
            </div>
          ))}
        </div>
      </div>

      {/* Indicator Dots */}
      <div className='absolute bottom-0 left-0 right-0 flex justify-center space-x-2'>
        {posts.map((_, index) => (
          <button
            key={index}
            onClick={() => handleIndicatorClick(index)}
            className={`w-3 h-3 rounded-full ${
              currentIndex === index
                ? 'bg-black dark:bg-white'
                : 'bg-gray-300 dark:bg-gray-700'
            }`}></button>
        ))}
      </div>
    </div>
  )
}

export default Swiper
