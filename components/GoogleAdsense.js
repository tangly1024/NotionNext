import { siteConfig } from '@/lib/config'
import { loadExternalResource } from '@/lib/utils'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

function requestAd() {
  const ads = document.getElementsByClassName('adsbygoogle')
  const adsbygoogle = window.adsbygoogle
  if (adsbygoogle && ads.length > 0) {
    for (let i = 0; i <= ads.length; i++) {
      try {
        const adStatus = ads[i].getAttribute('data-adsbygoogle-status')
        if (!adStatus || adStatus !== 'done') {
          adsbygoogle.push(ads[i])
        }
      } catch (e) {}
    }
  }
}

/**
 * 初始化谷歌广告
 * @returns
 */
export default function GoogleAdsense() {
  const initGoogleAdsense = () => {
    loadExternalResource(
      `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${siteConfig('ADSENSE_GOOGLE_ID')}`,
      'js'
    ).then(url => {
      setTimeout(() => {
        requestAd()
      }, 100)
    })
  }

  const router = useRouter()
  useEffect(() => {
    // 延迟3秒加载
    setTimeout(() => {
      initGoogleAdsense()
    }, 3000)
  }, [router])

  return null
}

/**
 * 文章内嵌广告单元
 * 请在GoogleAdsense后台配置创建对应广告，并且获取相应代码
 * 修改下面广告单元中的 data-ad-slot data-ad-format data-ad-layout-key(如果有)
 * 添加 可以在本地调试
 */
const AdSlot = ({ type = 'show' }) => {
  if (!siteConfig('ADSENSE_GOOGLE_ID')) {
    return null
  }
  // 文章内嵌广告
  if (type === 'in-article') {
    return (
      <ins
        className='adsbygoogle'
        style={{ display: 'block', textAlign: 'center' }}
        data-ad-layout='in-article'
        data-ad-format='fluid'
        data-adtest={siteConfig('ADSENSE_GOOGLE_TEST') ? 'on' : 'off'}
        data-ad-client={siteConfig('ADSENSE_GOOGLE_ID')}
        data-ad-slot={siteConfig('ADSENSE_GOOGLE_SLOT_IN_ARTICLE')}></ins>
    )
  }

  // 信息流广告
  if (type === 'flow') {
    return (
      <ins
        className='adsbygoogle'
        data-ad-format='fluid'
        data-ad-layout-key='-5j+cz+30-f7+bf'
        style={{ display: 'block' }}
        data-adtest={siteConfig('ADSENSE_GOOGLE_TEST') ? 'on' : 'off'}
        data-ad-client={siteConfig('ADSENSE_GOOGLE_ID')}
        data-ad-slot={siteConfig('ADSENSE_GOOGLE_SLOT_FLOW')}></ins>
    )
  }

  // 原生广告
  if (type === 'native') {
    return (
      <ins
        className='adsbygoogle'
        style={{ display: 'block', textAlign: 'center' }}
        data-ad-format='autorelaxed'
        data-adtest={siteConfig('ADSENSE_GOOGLE_TEST') ? 'on' : 'off'}
        data-ad-client={siteConfig('ADSENSE_GOOGLE_ID')}
        data-ad-slot={siteConfig('ADSENSE_GOOGLE_SLOT_NATIVE')}></ins>
    )
  }

  //  展示广告
  return (
    <ins
      className='adsbygoogle'
      style={{ display: 'block' }}
      data-ad-client={siteConfig('ADSENSE_GOOGLE_ID')}
      data-adtest={siteConfig('ADSENSE_GOOGLE_TEST') ? 'on' : 'off'}
      data-ad-slot={siteConfig('ADSENSE_GOOGLE_SLOT_AUTO')}
      data-ad-format='auto'
      data-full-width-responsive='true'></ins>
  )
}

/**
 * 嵌入到文章内部的广告单元
 * 检测文本内容 出现<ins/> 关键词时自动替换为广告
 * @param {*} props
 */
const AdEmbed = () => {
  useEffect(() => {
    setTimeout(() => {
      // 找到所有 class 为 notion-text 且内容为 '<ins/>' 的 div 元素
      const notionTextElements = document.querySelectorAll('div.notion-text')

      // 遍历找到的元素
      notionTextElements?.forEach(element => {
        // 检查元素的内容是否为 '<ins/>'
        if (element.innerHTML.trim() === '&lt;ins/&gt;') {
          // 创建新的 <ins> 元素
          const newInsElement = document.createElement('ins')
          newInsElement.className = 'adsbygoogle w-full py-1'
          newInsElement.style.display = 'block'
          newInsElement.setAttribute('data-ad-client', siteConfig('ADSENSE_GOOGLE_ID'))
          newInsElement.setAttribute('data-adtest', siteConfig('ADSENSE_GOOGLE_TEST') ? 'on' : 'off')
          newInsElement.setAttribute('data-ad-slot', siteConfig('ADSENSE_GOOGLE_SLOT_AUTO'))
          newInsElement.setAttribute('data-ad-format', 'auto')
          newInsElement.setAttribute('data-full-width-responsive', 'true')

          // 用新创建的 <ins> 元素替换掉原来的 div 元素
          element?.parentNode?.replaceChild(newInsElement, element)
        }
      })

      requestAd()
    }, 1000)
  }, [])
  return <></>
}

export { AdEmbed, AdSlot }
