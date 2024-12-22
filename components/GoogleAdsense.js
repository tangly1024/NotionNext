import { siteConfig } from '@/lib/config'
import { loadExternalResource } from '@/lib/utils'
import { useEffect } from 'react'

/**
 * 请求广告元素
 * 调用后，实际只有当广告单元在页面中可见时才会真正获取
 */
function requestAd(ads) {
  if (!ads || ads.length === 0) {
    return
  }

  const adsbygoogle = window.adsbygoogle
  if (adsbygoogle && ads.length > 0) {
    const observerOptions = {
      root: null, // use the viewport as the root
      threshold: 0.5 // element is considered visible when 50% visible
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const adStatus = entry.target.getAttribute('data-adsbygoogle-status')
          if (!adStatus || adStatus !== 'done') {
            adsbygoogle.push(entry.target)
            observer.unobserve(entry.target) // stop observing once ad is loaded
          }
        }
      })
    }, observerOptions)

    ads.forEach(ad => {
      observer.observe(ad)
    })
  }
}

// 获取节点或其子节点中包含 adsbygoogle 类的节点
function getNodesWithAdsByGoogleClass(node) {
  const adsNodes = []

  // 检查节点及其子节点是否包含 adsbygoogle 类
  function checkNodeForAds(node) {
    if (
      node.nodeType === Node.ELEMENT_NODE &&
      node.classList.contains('adsbygoogle')
    ) {
      adsNodes.push(node)
    } else {
      // 递归检查子节点
      for (let i = 0; i < node.childNodes.length; i++) {
        checkNodeForAds(node.childNodes[i])
      }
    }
  }

  checkNodeForAds(node)
  return adsNodes
}

/**
 * 初始化谷歌广告
 * @returns
 */
export const initGoogleAdsense = async ADSENSE_GOOGLE_ID => {
  console.log('Load Adsense')
  loadExternalResource(
    `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_GOOGLE_ID}`,
    'js'
  ).then(url => {
    setTimeout(() => {
      // 页面加载完成后加载一次广告
      const ads = document.getElementsByClassName('adsbygoogle')
      if (window.adsbygoogle && ads.length > 0) {
        requestAd(Array.from(ads))
      }

      // 创建一个 MutationObserver 实例，监听页面上新出现的广告单元
      const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          // 检查每个添加到DOM中的节点
          mutation.addedNodes.forEach(node => {
            // 如果节点是adsbygoogle元素，则请求广告
            if (node.nodeType === Node.ELEMENT_NODE) {
              const adsNodes = getNodesWithAdsByGoogleClass(node)
              if (adsNodes.length > 0) {
                requestAd(adsNodes)
              }
            }
          })
        })
      })

      // 配置 MutationObserver 监听特定类型的 DOM 变化
      const observerConfig = {
        childList: true, // 观察目标子节点的变化
        subtree: true // 包括目标节点的所有后代节点
      }

      // 启动 MutationObserver
      observer.observe(document.body, observerConfig)
    }, 100)
  })
}

/**
 * 文章内嵌广告单元
 * 请在GoogleAdsense后台配置创建对应广告，并且获取相应代码
 * 修改下面广告单元中的 data-ad-slot data-ad-format data-ad-layout-key(如果有)
 * 添加 可以在本地调试
 */
const AdSlot = ({ type = 'show' }) => {
  const ADSENSE_GOOGLE_ID = siteConfig('ADSENSE_GOOGLE_ID')
  const ADSENSE_GOOGLE_TEST = siteConfig('ADSENSE_GOOGLE_TEST')
  if (!ADSENSE_GOOGLE_ID) {
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
        data-adtest={ADSENSE_GOOGLE_TEST ? 'on' : 'off'}
        data-ad-client={ADSENSE_GOOGLE_ID}
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
        data-adtest={ADSENSE_GOOGLE_TEST ? 'on' : 'off'}
        data-ad-client={ADSENSE_GOOGLE_ID}
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
        data-adtest={ADSENSE_GOOGLE_TEST ? 'on' : 'off'}
        data-ad-client={ADSENSE_GOOGLE_ID}
        data-ad-slot={siteConfig('ADSENSE_GOOGLE_SLOT_NATIVE')}></ins>
    )
  }

  //  展示广告
  return (
    <ins
      className='adsbygoogle'
      style={{ display: 'block' }}
      data-ad-client={ADSENSE_GOOGLE_ID}
      data-adtest={ADSENSE_GOOGLE_TEST ? 'on' : 'off'}
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
  const ADSENSE_GOOGLE_ID = siteConfig('ADSENSE_GOOGLE_ID')
  const ADSENSE_GOOGLE_TEST = siteConfig('ADSENSE_GOOGLE_TEST')
  const ADSENSE_GOOGLE_SLOT_AUTO = siteConfig('ADSENSE_GOOGLE_SLOT_AUTO')
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
          newInsElement.setAttribute('data-ad-client', ADSENSE_GOOGLE_ID)
          newInsElement.setAttribute(
            'data-adtest',
            ADSENSE_GOOGLE_TEST ? 'on' : 'off'
          )
          newInsElement.setAttribute('data-ad-slot', ADSENSE_GOOGLE_SLOT_AUTO)
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
