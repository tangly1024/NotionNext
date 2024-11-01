import { useRef, useState } from 'react'
import PostItemCard from './PostItemCard'

const Swiper = ({ posts }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef(null)

  const touchStartPos = useRef({ x: 0, y: 0 })
  const isDragging = useRef(false)
  const scrollStartLeft = useRef(0) // 记录拖拽开始时的滚动位置

  // 处理鼠标和触摸开始事件
  const handleDragStart = e => {
    const x = e.touches ? e.touches[0].clientX : e.clientX
    touchStartPos.current = { x }
    isDragging.current = true
    scrollStartLeft.current = containerRef.current.scrollLeft

    // 更新鼠标样式
    containerRef.current.style.cursor = 'grabbing'
  }

  // 处理鼠标和触摸移动事件
  const handleDragMove = e => {
    if (!isDragging.current) return

    const x = e.touches ? e.touches[0].clientX : e.clientX
    const deltaX = touchStartPos.current.x - x

    // 根据拖动的距离更新滚动位置
    containerRef.current.scrollLeft = scrollStartLeft.current + deltaX
  }

  // 处理鼠标和触摸结束事件
  const handleDragEnd = () => {
    isDragging.current = false
    containerRef.current.style.cursor = 'grab'
  }

  // 处理指示器点击事件
  const handleIndicatorClick = index => {
    setCurrentIndex(index)
    scrollToCard(index)
  }

  // 滚动到特定卡片
  const scrollToCard = index => {
    const container = containerRef.current
    if (!container) return
    const cardWidth = container.scrollWidth / posts.length
    container.scrollTo({
      left: index * cardWidth - cardWidth / 6, // 调整位置以居中
      behavior: 'smooth'
    })
  }

  return (
    <div className='relative w-full mx-auto px-12 my-8'>
      <div
        className='absolute inset-y-0 left-0 w-12 z-10 cursor-pointer bg-black hover:opacity-20 opacity-10 duration-100'
        onClick={() =>
          handleIndicatorClick(
            currentIndex === 0 ? posts.length - 1 : currentIndex - 1
          )
        }></div>

      <div
        className='absolute inset-y-0 right-0 w-12 z-10 cursor-pointer bg-black hover:opacity-20 opacity-10 duration-100'
        onClick={() =>
          handleIndicatorClick(
            currentIndex === posts.length - 1 ? 0 : currentIndex + 1
          )
        }></div>

      <div
        ref={containerRef}
        className='relative w-full overflow-x-hidden py-4 cursor-grab'
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className='flex gap-x-4 transition-transform'>
          {posts.map((item, index) => (
            <div key={index} className='w-3/4 flex-shrink-0'>
              <PostItemCard post={item} />
            </div>
          ))}
        </div>
      </div>

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
