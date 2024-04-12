/* eslint-disable @next/next/no-img-element */
import { siteConfig } from '@/lib/config'
import { checkContainHttp, deepClone, sliceUrlFromHttp } from '@/lib/utils'
import Link from 'next/link'
import { useState } from 'react'

/**
 * 游戏列表- 关联游戏，在详情页展示
 * @returns
 */
export const GameListRelate = ({ posts }) => {
  const gamesClone = deepClone(posts)

  // 构造一个List<Component>
  const components = []
  const maxCount = 24

  let index = 0
  // 无限循环
  while (gamesClone?.length > 0 && index < maxCount) {
    const item = gamesClone.shift()
    components.push(<GameItem key={index} item={item} isLargeCard={true} />)
    index++
    continue
  }

  return (
    <div className='game-list-wrapper w-full max-w-full overflow-x-auto'>
      <div className='game-grid grid grid-flow-col justify-start gap-2'>
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
  const [showType, setShowType] = useState('img') // img or video
  const url = checkContainHttp(item.slug)
    ? sliceUrlFromHttp(item.slug)
    : `${siteConfig('SUB_PATH', '')}/${item.slug}`

  const img = item?.pageCoverThumbnail
  const video = item?.ext?.video

  return (
    <Link
      href={`${url}`}
      onMouseOver={() => {
        setShowType('video')
      }}
      onMouseOut={() => {
        setShowType('img')
      }}
      title={title}
      className={`card-single w-24 h-24 relative shadow rounded-md overflow-hidden flex justify-center items-center 
                group   hover:border-purple-400`}>
      <div className='text-xs text-center absolute bottom-0 invisible group-hover:bottom-2 group-hover:visible transition-all duration-200 text-white z-30'>
        {title}
      </div>
      <div className='h-2/3 w-full absolute left-0 bottom-0 z-20 opacity-0 group-hover:opacity-75 transition-all duration-200'>
        <div className='h-full w-full absolute bg-gradient-to-b from-transparent to-black'></div>
      </div>

      {showType === 'video' && (
        <video
          className={`z-10 object-cover w-full h-24 absolute overflow-hidden`}
          loop='true'
          autoPlay
          preload='none'>
          <source src={video} type='video/mp4' />
        </video>
      )}
      <img
        className='w-24 h-24 absolute object-cover group-hover:scale-105 duration-100 transition-all'
        src={img}
        alt={title}
      />
    </Link>
  )
}
