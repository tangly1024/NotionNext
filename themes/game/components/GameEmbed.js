import { Draggable } from '@/components/Draggable'
import { siteConfig } from '@/lib/config'
import { deepClone } from '@/lib/utils'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import DownloadButton from './DownloadButton'
import FullScreenButton from './FullScreenButton'

/**
 * 嵌入游戏
 * @param {*} param0
 * @returns
 */
export default function GameEmbed({ post, siteInfo }) {
  const game = deepClone(post)

  // 提示用户在新窗口打开
  // const new_window = game?.ext?.new_window || false
  const new_window = true
  const url = game?.ext?.href
  const [loading, setLoading] = useState(true)
  const [tipNewWindow, setTipNewWindow] = useState(new_window)

  /**
   * 新窗口中打开
   */
  const openInNewWindow = () => {}

  // 将当前游戏加入到最近游玩
  useEffect(() => {
    // 更新最新游戏
    const recentGames = localStorage.getItem('recent_games')
      ? JSON.parse(localStorage.getItem('recent_games'))
      : []

    const existedIndex = recentGames.findIndex(item => item?.id === game?.id)
    if (existedIndex === -1) {
      recentGames.unshift(game) // 将游戏插入到数组头部
    } else {
      // 如果游戏已存在于数组中，将其移至数组头部
      const existingGame = recentGames.splice(existedIndex, 1)[0]
      recentGames.unshift(existingGame)
    }
    localStorage.setItem('recent_games', JSON.stringify(recentGames))

    const iframe = document.getElementById('game-wrapper')

    // 定义一个函数来处理iframe加载成功事件
    function iframeLoaded() {
      if (game) {
        setLoading(false)
      }
    }

    // 绑定加载事件
    if (iframe?.attachEvent) {
      iframe?.attachEvent('onload', iframeLoaded)
    } else {
      if (iframe) iframe.onload = iframeLoaded
    }

    // 更改iFrame的title
    if (
      document
        ?.getElementById('game-wrapper')
        ?.contentDocument.querySelector('title')?.textContent
    ) {
      document
        .getElementById('game-wrapper')
        .contentDocument.querySelector('title').textContent = `${
        game?.title || ''
      } - Play ${game?.title || ''} on ${siteConfig('TITLE')}`
    }
  }, [game])

  return (
    <div
      className={`${url ? '' : 'hidden'} bg-black w-full xl:h-[calc(100vh-8rem)] h-screen rounded-md relative`}>
      {/* 移动端返回主页按钮 */}
      <Draggable stick='left'>
        <div
          style={{ left: '0px', top: '1rem' }}
          className='fixed xl:hidden group space-x-1 flex items-center z-20 pr-3 pl-1 bg-[#202030] rounded-r-2xl  shadow-lg '>
          <Link
            href='/'
            className='px-1 py-3 hover:scale-125 duration-200 transition-all'
            passHref>
            <i className='fas fa-arrow-left' />
          </Link>{' '}
          <span
            className='text-white font-serif'
            onClick={() => {
              document.querySelector('.game-info').scrollIntoView({
                behavior: 'smooth',
                block: 'end',
                inline: 'nearest'
              })
            }}>
            G
          </span>
        </div>
      </Draggable>

      {/* 新窗口打开遮罩 */}
      {tipNewWindow && (
        <div className='absolute z-20 bg-black bg-opacity-50 w-full h-full flex items-center justify-center'>
          <div className='w-80 h-80 bg-white rounded-lg text-center flex items-center justify-center'>
            <div>
              <p>Click to start the game.</p>
              <button
                onClick={openInNewWindow}
                className='m-4 px-6 py-2 bg-blue-500 rounded-lg text-white shadow-md'>
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading遮罩 */}
      {loading && (
        <div className='absolute z-20 w-full xl:h-[calc(100vh-8rem)] h-screen rounded-md overflow-hidden '>
          <div className='z-20 absolute bg-black bg-opacity-75 w-full h-full flex flex-col gap-4 justify-center items-center'>
            <h2 className='text-3xl text-white flex gap-2 items-center'>
              <i className='fas fa-spinner animate-spin'></i>
              {siteInfo?.title || siteConfig('TITLE')}
            </h2>
            <h3 className='text-xl text-white'>
              {siteInfo?.description || siteConfig('DESCRIPTION')}
            </h3>
          </div>

          {/* 游戏封面图 */}
          {game?.pageCoverThumbnail && (
            <img
              src={game?.pageCoverThumbnail}
              className='w-full h-full object-cover blur-md absolute top-0 left-0 z-0'
            />
          )}
        </div>
      )}
      <iframe
        id='game-wrapper'
        src={url}
        className={`relative w-full xl:h-[calc(100vh-8rem)] h-screen md:rounded-md overflow-hidden`}
      />

      {/* 游戏窗口装饰器 */}
      {url && !loading && (
        <div className='game-decorator bg-[#0B0D14] right-0 bottom-0 flex justify-center z-10 md:absolute'>
          <DownloadButton />
          <FullScreenButton />
        </div>
      )}
    </div>
  )
}
