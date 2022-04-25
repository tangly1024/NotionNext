import { useState } from 'react'
const OpenCC = require('opencc-js')
const ChiConv = () => {
  const [lang, setLang] = useState('zh-TW')
  const converter = OpenCC.Converter({ from: 'twp', to: 'cn' })

  const rootNode = document.documentElement
  const HTMLConvertHandler = OpenCC.HTMLConverter(
    converter,
    rootNode,
    'zh-TW',
    'zh-CN'
  )
  const tts = () => {
    setLang('zh-CN')
    HTMLConvertHandler.convert()
  }
  const stt = () => {
    setLang('zh-TW')
    HTMLConvertHandler.restore()
  }
  if (lang == 'zh-TW') {
    return <button onClick={tts}>簡</button>
  }
  if (lang == 'zh-CN') {
    return <button onClick={stt}>繁</button>
  }
}

export default ChiConv
