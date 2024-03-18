/* eslint-disable @next/next/no-img-element */
import { useGlobal } from '@/lib/global'
import { deepClone } from '@/lib/utils'
import { useState } from 'react'

/**
 * 游戏列表- 最近游戏
 * @returns
 */
export const GameListRecent = ({ maxCount = 14 }) => {
  const { recentGames } = useGlobal()
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
      <div className='text-white text-lg pb-1 p-2'>Recent Played</div>
      <div className='game-list-recent-wrapper w-full max-w-full overflow-x-auto p-2'>
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
  const { id, title, img, video } = item || {}
  const [showType, setShowType] = useState('img') // img or video

  return (
    <a
      href={`/game/${id}`}
      onMouseOver={() => {
        setShowType('video')
      }}
      onMouseOut={() => {
        setShowType('img')
      }}
      title={title}
      className={`card-single h-28 w-28 relative shadow rounded-md overflow-hidden flex justify-center items-center 
                group   hover:border-purple-400`}>
      <div className='absolute text-sm bottom-2 transition-all duration-200 text-white z-30'>{title}</div>
      <div className='h-1/2 w-full absolute left-0 bottom-0 z-20 opacity-75 transition-all duration-200'>
        <div className='h-full w-full absolute bg-gradient-to-b from-transparent to-black'></div>
      </div>

      {showType === 'video' && (
        <video className='z-10 object-cover w-auto h-28 absolute overflow-hidden' loop='true' autoPlay preload='none'>
          <source src={video} type='video/mp4' />
        </video>
      )}
      <img
        className='w-full h-full absolute object-cover group-hover:scale-105 duration-100 transition-all'
        src={img}
        alt={title}
      />
    </a>
  )
}
