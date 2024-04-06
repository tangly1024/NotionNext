/* eslint-disable @next/next/no-img-element */
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
  const newWindow = game?.ext?.new_window || false
  const originUrl = game?.ext?.href

  // 提示用户在新窗口打开
  const [tipNewWindow, setTipNewWindow] = useState(newWindow)
  const [loading, setLoading] = useState(true)

  /**
   * 新窗口中打开游戏。
   * 并且在回到此页面后后刷新iframe，尝试重新加载iframe
   */
  const openInNewWindow = () => {
    // 关闭提示框
    setTipNewWindow(false)
    // 添加监听器
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // 定义监听器函数
    function handleVisibilityChange() {
      if (document.visibilityState === 'hidden') {
        // console.log("用户切换到了其他标签页");
      } else {
        // console.log("用户回到了当前页面");
        setLoading(true)
        // 刷新网页
        reloadIframe()
        // 移除监听器
        document.removeEventListener('visibilitychange', handleVisibilityChange)
      }
    }
  }

  /**
   * 隐藏提示框
   */
  const hiddenTips = () => {
    setTipNewWindow(false)
  }

  function reloadIframe() {
    var iframe = document.getElementById('game-wrapper')
    iframe.contentWindow.location.reload()
  }

  // 定义一个函数来处理iframe加载成功事件
  function iframeLoaded() {
    if (game) {
      setLoading(false)
    }
  }

  useEffect(() => {
    // 是否弹窗提示新网页打开
    setTipNewWindow(newWindow)

    const iframe = document.getElementById('game-wrapper')

    // 绑定加载事件
    if (iframe?.attachEvent) {
      iframe?.attachEvent('onload', iframeLoaded)
    } else if (iframe) {
      iframe.onload = iframeLoaded
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
  }, [post])

  return (
    <div
      className={`${originUrl ? '' : 'hidden'} bg-black w-full xl:h-[calc(100vh-8rem)] h-screen rounded-md relative`}>
      {/* 移动端返回主页按钮 */}
      <Draggable stick='left'>
        <div
          style={{ left: '0px', top: '1rem' }}
          className='text-white fixed xl:hidden group space-x-1 flex items-center z-20 pr-3 pl-1 bg-[#202030] rounded-r-2xl  shadow-lg '>
          <Link
            href='/'
            className='px-1 py-3 hover:scale-125 duration-200 transition-all'
            passHref>
            <i className='fas fa-chevron-left' />
          </Link>{' '}
          <span
            className='font-serif px-1'
            onClick={() => {
              document.querySelector('.game-info').scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest'
              })
            }}>
            {/* Title首字母 */}
            <i className='fas fa-info' />
          </span>
        </div>
      </Draggable>

      {/* 提示框新窗口打开 */}
      {tipNewWindow && (
        <div
          id='open-tips'
          className={`animate__animated animate__fadeIn bottom-8 right-4  absolute z-20 flex items-end justify-end`}>
          <div className='relative w-96 h-auto bg-white rounded-lg p-2'>
            <div className='absolute right-2'>
              <button className='text-xl p-2' onClick={hiddenTips}>
                <i className='fas fa-times'></i>
              </button>
            </div>
            <div className='p-2 text-lg'>
              If the game fails to load, please try accessing the{' '}
              <a
                className='underline text-blue-500'
                rel='noReferrer'
                href={`${originUrl?.replace('/games-external/common/index.htm?n=', '')}`}
                target='_blank'
                onClick={openInNewWindow}>
                source webpage
              </a>
              .
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
        src={originUrl}
        className={`relative w-full xl:h-[calc(100vh-8rem)] h-screen md:rounded-md overflow-hidden`}
      />

      {/* 游戏窗口装饰器 */}
      {originUrl && !loading && (
        <div className='game-decorator bg-[#0B0D14] right-0 bottom-0 flex justify-center z-10 md:absolute'>
          <DownloadButton />
          <FullScreenButton />
        </div>
      )}
    </div>
  )
}
