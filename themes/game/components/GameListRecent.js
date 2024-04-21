/* eslint-disable @next/next/no-img-element */
import { siteConfig } from '@/lib/config'
import { checkContainHttp, deepClone, sliceUrlFromHttp } from '@/lib/utils'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useGameGlobal } from '..'

/**
 * 游戏列表- 最近游戏
 * @returns
 */
export const GameListRecent = ({ maxCount = 14 }) => {
  const { recentGames } = useGameGlobal()
  const gamesClone = deepClone(recentGames)
  // 构造一个List<Component>
  const components = []

  let index = 0
  // 无限循环
  while (gamesClone?.length > 0 && index < maxCount) {
    const item = gamesClone?.shift()
    if (item) {
      components.push(<GameItem key={index} item={item} isLargeCard={true} />)
      index++
    }
    continue
  }

  if (components.length === 0) {
    return <></>
  }

  return (
    <>
      <div className='game-list-recent-wrapper w-full max-w-full overflow-x-auto pt-4 px-2 md:px-0'>
        <div className='game-grid md:flex grid grid-flow-col gap-2'>
          {components?.map((ItemComponent, index) => {
            return ItemComponent
          })}
        </div>
      </div>
    </>
  )
}

/**
 * 游戏=单卡
 * @param {*} param0
 * @returns
 */
const GameItem = ({ item }) => {
  const router = useRouter()
  const { recentGames, setRecentGames } = useGameGlobal()
  const { title } = item || {}
  const [showType, setShowType] = useState('img') // img or video
  const url = checkContainHttp(item.slug)
    ? sliceUrlFromHttp(item.slug)
    : `${siteConfig('SUB_PATH', '')}/${item.slug}`

  const [isClockVisible, setClockVisible] = useState(true)
  const toggleIcons = () => {
    setClockVisible(!isClockVisible)
  }
  /**
   * 移除最近
   */
  const removeRecent = () => {
    const updatedRecentGames = deepClone(recentGames) // 创建一个 recentGames 的副本
    const indexToRemove = updatedRecentGames.findIndex(
      game => game?.title === item.title
    ) // 找到要移除的项的索引
    if (indexToRemove !== -1) {
      updatedRecentGames.splice(indexToRemove, 1) // 使用 splice 方法删除项
      setRecentGames(updatedRecentGames) // 更新 recentGames 状态
      localStorage.setItem('recent_games', JSON.stringify(updatedRecentGames))
    }
  }

  const handleButtonClick = () => {
    router.push(url) // 如果是 Next.js
  }

  const img = item?.pageCoverThumbnail
  const video = item?.ext?.video

  return (
    <div
      onClick={handleButtonClick}
      onMouseOver={() => {
        setShowType('video')
      }}
      onMouseOut={() => {
        setShowType('img')
      }}
      title={title}
      className={`cursor-pointer card-single h-28 w-28 relative shadow rounded-md overflow-hidden flex justify-center items-center 
                group hover:border-purple-400`}>
      <button
        className='absolute right-0.5 top-1 z-20'
        onClick={e => {
          e.stopPropagation() // 阻止事件冒泡，防止触发父级元素的点击事件
          removeRecent()
        }}
        onMouseEnter={toggleIcons}
        onMouseLeave={toggleIcons}>
        {isClockVisible ? (
          <i className='fas fa-clock-rotate-left w-6 h-6 flex items-center justify-center shadow rounded-full bg-white text-blue-500 text-sm'></i>
        ) : (
          <i className='fas fa-trash-can w-6 h-6 flex items-center justify-center shadow rounded-full bg-white text-red-500 text-sm'></i>
        )}
      </button>

      <div className='absolute text-sm bottom-2 transition-all duration-200 text-white z-30'>
        {title}
      </div>
      <div className='h-1/2 w-full absolute left-0 bottom-0 z-20 opacity-75 transition-all duration-200'>
        <div className='h-full w-full absolute bg-gradient-to-b from-transparent to-black'></div>
      </div>

      {showType === 'video' && (
        <video
          className='z-10 object-cover w-auto h-28 absolute overflow-hidden'
          loop='true'
          autoPlay
          preload='none'>
          <source src={video} type='video/mp4' />
        </video>
      )}
      <img
        className='w-full h-full absolute object-cover group-hover:scale-105 duration-100 transition-all'
        src={img}
        alt={title}
      />
    </div>
  )
}
