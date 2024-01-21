/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
import { siteConfig } from '@/lib/config'
import { loadExternalResource } from '@/lib/utils'
import { useEffect } from 'react'
/**
 * TianliGpt AI文章摘要生成工具 @see https://docs_s.tianli0.top/
 * @returns {JSX.Element}
 * @constructor
 */

const TianLiGPT = () => {
  const tianliKey = siteConfig('TianliGPT_KEY')
  const tianliCss = siteConfig('TianliGPT_CSS')
  const tianliJs = siteConfig('TianliGPT_JS')

  useEffect(() => {
    initArtalk()
  }, [])

  if (!tianliKey) {
    return null
  }

  const initArtalk = async () => {
    console.log('loading tianliGPT', tianliKey, tianliCss, tianliJs)

    if (!tianliKey) {
      return
    }
    await loadExternalResource(tianliCss, 'css')

    window.tianliGPT_postSelector = '#notion-article';
    window.tianliGPT_key = tianliKey;

    await loadExternalResource(tianliJs, 'js')
  }
  return <></>
}

export default TianLiGPT
