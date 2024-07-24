import { siteConfig } from '@/lib/config'
import { deepClone } from '@/lib/utils'
import { useEffect, useRef } from 'react'
import { useGameGlobal } from '..'
import CONFIG from '../config'
import { GameListNormal } from './GameListNormal'
import Logo from './Logo'

/**
 * 侧拉抽屉的内容
 */
export default function SideBarContent({ allNavPages, siteInfo }) {
  const { sideBarVisible, setSideBarVisible, filterGames, setFilterGames } =
    useGameGlobal()
  const inputRef = useRef(null) // 创建对输入框的引用
  const allGames = deepClone(allNavPages)
  useEffect(() => {
    if (sideBarVisible) {
      setTimeout(() => {
        inputRef.current.focus() // 在组件渲染后聚焦输入框
      }, 100)
    }
  }, [sideBarVisible, inputRef])

  const handleSearch = e => {
    const search = e.target.value
    if (!search || search === '') {
      setFilterGames(
        allGames?.filter(item =>
          item.tags?.some(
            t => t === siteConfig('GAME_RECOMMEND_TAG', 'Recommend', CONFIG)
          )
        )
      )
      return
    }
    const filtered = allGames?.filter(item => {
      return (
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.id.toLowerCase().includes(search.toLowerCase()) ||
        item.id
          .toLowerCase()
          .replace('-', '')
          .includes(search.toLowerCase().replace('-', ''))
      )
    })

    setFilterGames(deepClone(filtered))
  }
  return (
    <div className='px-3'>
      <div className='py-2 flex justify-between'>
        <Logo siteInfo={siteInfo} />
        <button
          onClick={() => {
            setSideBarVisible(false)
          }}>
          <i className='fas fa-times' />
        </button>
      </div>
      <input
        autoFocus
        id='search-input'
        ref={inputRef} // 将引用绑定到输入框
        className='w-full h-12 rounded px-3 text-black'
        onChange={handleSearch}
        placeholder='Input the name of game'></input>
      <div className='py-4'>
        <GameListNormal games={filterGames} />
      </div>
    </div>
  )
}
