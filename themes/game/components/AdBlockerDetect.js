import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

/**
 * 检测是否用了任意一种广告屏蔽插件
 * @returns {JSX.Element|null} 如果检测到广告屏蔽插件则返回提示信息，否则返回null
 */
export default function AdBlockerDetect() {
  const [isAdBlocker, setIsAdBlocker] = useState(false)
  const [noticeCountdown, setNoticeCountdown] = useState(10) // 广告拦截弹窗提示倒计时
  const router = useRouter()

  useEffect(() => {
    let adsCheckCountdown = 10 // 广告拦截检测倒计时
    // GoogleAds 是否被拦截
    const adLoadTimer = setInterval(() => {
      if (window.adsbygoogle) {
        clearInterval(adLoadTimer)
        checkAdBlocker()
      } else {
        if (adsCheckCountdown > 1) {
          adsCheckCountdown--
        } else {
          clearInterval(adLoadTimer)
          setIsAdBlocker(true)
        }
      }
    }, 1000)

    return () => clearInterval(adLoadTimer)
  }, [router])

  /**
   * 检测广告单元可见度
   */
  const checkAdBlocker = () => {
    const ads = document.querySelectorAll('.adsbygoogle')
    if (ads.length === 0) {
      setIsAdBlocker(true)
    } else {
      let adEffect = false
      for (const ad of ads) {
        const adStyle = getComputedStyle(ad)
        if (adStyle.display !== 'none' && adStyle.visibility !== 'hidden') {
          adEffect = true
          break
        }
      }
      if (!adEffect) {
        setIsAdBlocker(true)
      }
    }
  }

  useEffect(() => {
    if (isAdBlocker) {
      const timer = setInterval(() => {
        setNoticeCountdown(prevCountdown => {
          if (prevCountdown <= 0) {
            clearInterval(timer)
            setIsAdBlocker(false)
            return 0
          } else {
            return prevCountdown - 1
          }
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isAdBlocker])

  if (!isAdBlocker) {
    return null
  }

  return (
    <>
      <div className="fixed w-screen h-screen z-40 flex justify-center items-center bg-black bg-opacity-75 top-0 left-0">
        <div className="fc-dialog-content z-50 bg-white rounded-md p-4 max-w-md">
          <div className="fc-dialog-headline">
            <h1 className="fc-dialog-headline-text text-3xl">
              Please allow ads on our site
            </h1>
          </div>
          <hr className="my-4" />
          <div className="fc-dialog-body">
            <p className="fc-dialog-body-text  text-xl">
              {
                "Looks like you're using an ad blocker. We rely on advertising to help fund our site."
              }
            </p>
          </div>
          <div className="flex justify-center mt-4">
            <button
              onClick={() => {
                setIsAdBlocker(false)
              }}
              className="px-12 py-2 gap-2 bg-green-600 rounded text-white "
            >
              OK ({noticeCountdown})
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
