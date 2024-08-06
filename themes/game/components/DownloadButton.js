/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from 'react'

/**
 * 下载按钮
 * @returns
 */
export default function DownloadButton() {
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    // 判断用户是在PWA中打开，就隐藏
    const isInStandaloneMode = () =>
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone ||
      document.referrer.includes('android-app://')

    if ('serviceWorker' in navigator && !isInStandaloneMode()) {
      setShowButton(true)
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/service-worker.js')
          .then(registration => {
            console.log('Service Worker 注册成功:', registration)
          })
          .catch(error => {
            console.log('Service Worker 注册失败:', error)
          })
      })

      window.addEventListener('beforeinstallprompt', event => {
        // 阻止浏览器默认的安装提示
        event.preventDefault()
        // 保存安装提示的事件
        window.deferredPrompt = event
        // 在按钮上显示一个标识，提示用户可以安装应用
        setShowButton(true)
      })
    }
  }, [])

  /**
   * 点击后提示用户安装
   */
  function download() {
    // 检查是否支持安装提示
    if (window.deferredPrompt) {
      // 显示安装提示
      window.deferredPrompt.prompt()
      // 等待用户做出选择
      window.deferredPrompt.userChoice.then(choiceResult => {
        if (choiceResult.outcome === 'accepted') {
          // 用户已安装，隐藏按钮
          setShowButton(false)
          console.log('用户已同意安装')
        } else {
          console.log('用户已拒绝安装')
        }
        // 清除安装提示
        window.deferredPrompt = null
      })
    }
  }

  return (
    <>
      {showButton && (
        <div
          className=' justify-center items-center md:flex hidden group text-white w-full rounded-lg m-2 md:m-0 p-2 hover:bg-gray-700 bg-[#1F2030] md:rounded-none md:bg-none'
          onClick={download}>
          <i
            alt='download'
            title='download'
            className='cursor-pointer fas fa-download group-hover:scale-125 transition-all duration-150 '
          />
          <span className='h-full flex mx-2 md:hidden items-center select-none'>
            Download
          </span>
        </div>
      )}
    </>
  )
}
