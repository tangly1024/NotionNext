/* eslint-disable @next/next/no-img-element */
import { AdSlot } from '@/components/GoogleAdsense'
import { siteConfig } from '@/lib/config'
import { checkContainHttp, deepClone, sliceUrlFromHttp } from '@/lib/utils'
import Link from 'next/link'
import { useState } from 'react'
import CONFIG from '../config'

/**
 * 游戏列表
 * @returns
 */
export const GameListIndexCombine = ({ posts }) => {
  const gamesClone = deepClone(posts)

  // 构造一个List<Component>
  const components = []

  // 根据序号随机大小;或根据game.recommend 决定
  const recommend = siteConfig('GAME_INDEX_EXPAND_RECOMMEND', true, CONFIG)

  let index = 0
  // 无限循环
  if (recommend) {
    // 4合一卡组
    let groupItems = []

    while (gamesClone?.length > 0) {
      index++

      // 广告位
      if (index % 9 === 0) {
        components.push(<GameAd key={index} />)
        continue
      }

      // 试图将4合一卡组塞满
      while (gamesClone?.length > 0 && groupItems.length < 4) {
        const item = gamesClone.shift()
        if (item.tags?.some(t => t === siteConfig('GAME_RECOMMEND_TAG', 'Recommend', CONFIG))) {
          components.push(<GameItem key={index} item={item} isLargeCard={true} />)
          continue
        } else {
          groupItems.push(item)
        }
      }

      if (groupItems.length === 4) {
        components.push(<GameItemGroup key={index} items={groupItems} />)
        // 清空4合一卡片
        groupItems = []
      } else {
        // 剩余的4合一不满4个的给他放大卡
        while (groupItems.length > 0) {
          const item = groupItems.shift()
          components.push(<GameItem key={index++} item={item} isLargeCard={true} />)
        }
      }
    }
  } else {
    while (gamesClone?.length > 0) {
      index++

      if (index % 6 === 0) {
        components.push(<GameAd key={index} />)
      } else if (index % 2 === 0 && gamesClone?.length >= 4) {
        // 如果是偶数，则从游戏列表中退出4个组成大卡牌
        const groupItems = []
        for (let i = 1; i <= 4; i++) {
          groupItems.push(gamesClone.shift())
        }
        components.push(<GameItemGroup key={index} items={groupItems} />)
      } else {
        const item = gamesClone.shift()
        components.push(<GameItem key={index} item={item} isLargeCard={true} />)
      }
    }
  }

  return (
    <div className='game-list-wrapper flex justify-center w-full px-2'>
      <div className='game-grid mx-auto w-full h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2'>
        {components?.map((ItemComponent, index) => {
          return ItemComponent
        })}
      </div>
    </div>
  )
}

/**
 * 一个广告游戏大卡
 * @returns
 */
const GameAd = () => {
  return (
    <div className='card-group border border-gray-600 rounded game-ad h-[20rem] w-full overflow-hidden'>
      <AdSlot type='flow' />
    </div>
  )
}

/**
 * 4卡组成一个大卡
 * @param {*} param0
 * @returns
 */
const GameItemGroup = ({ items }) => {
  return (
    <div className='card-group h-[20rem] w-full grid grid-cols-2 grid-rows-2 gap-2'>
      {items.map((item, index) => (
        <GameItem key={index} item={item} />
      ))}
    </div>
  )
}

/**
 * 游戏=单卡
 * @param {*} param0
 * @returns
 */
const GameItem = ({ item, isLargeCard }) => {
  const { title } = item
  const img = item.pageCoverThumbnail
  const [showType, setShowType] = useState('img') // img or video
  const url = checkContainHttp(item.slug) ? sliceUrlFromHttp(item.slug) : `${siteConfig('SUB_PATH', '')}/${item.slug}`
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
      className={`card-single ${
        isLargeCard ? 'h-[20rem]' : 'h-full'
      } w-full relative shadow rounded-md overflow-hidden flex justify-center items-center
                group   hover:border-purple-400`}>
      <div className='text-center absolute bottom-0 invisible group-hover:bottom-2 group-hover:visible transition-all duration-200 text-white z-30'>
        {title}
      </div>
      <div className='h-1/2 w-full absolute left-0 bottom-0 z-20 opacity-0 group-hover:opacity-75 transition-all duration-200'>
        <div className='h-full w-full absolute bg-gradient-to-b from-transparent to-black'></div>
      </div>

      {showType === 'video' && (
        <video
          className={`z-10 object-cover w-full ${isLargeCard ? 'h-[20rem]' : 'h-full'} absolute overflow-hidden`}
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
    </Link>
  )
}
