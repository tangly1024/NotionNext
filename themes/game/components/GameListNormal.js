/* eslint-disable @next/next/no-img-element */
import { deepClone } from '@/lib/utils'
import SmartLink from '@/components/SmartLink'
import { useState } from 'react'

/**
 * 游戏列表- 关联游戏，在详情页展示
 * @returns
 */
export const GameListNormal = ({ games, maxCount = 18 }) => {
  const gamesClone = deepClone(games)

  // 构造一个List<Component>
  const components = []

  let index = 0
  // 无限循环
  while (gamesClone?.length > 0 && index < maxCount) {
    const item = gamesClone.shift()
    components.push(<GameItem key={index} item={item} isLargeCard={true} />)
    index++
    continue
  }

  return (
    <div className='game-list-wrapper w-full'>
      <div className='game-grid mx-auto w-full h-full grid grid-cols-3 gap-2'>
        {components?.map((ItemComponent, index) => {
          return ItemComponent
        })}
      </div>
    </div>
  )
}

/**
 * 游戏=单卡
 * @param {*} param0
 * @returns
 */
const GameItem = ({ item }) => {
  const { title } = item
  const img = item.pageCoverThumbnail
  const [showType, setShowType] = useState('img') // img or video
  const video = item?.ext?.video

  return (
    <SmartLink
      href={`${item?.href}`}
      onMouseOver={() => {
        setShowType('video')
      }}
      onMouseOut={() => {
        setShowType('img')
      }}
      title={title}
      className={`card-single h-28 w-28 relative shadow rounded-md overflow-hidden flex justify-center items-center 
                group   hover:border-purple-400`}>
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
        className='w-full h-full absolute object-cover'
        src={img}
        alt={title}
      />
    </SmartLink>
  )
}
