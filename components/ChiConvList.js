import { useEffect, useState } from 'react'
const OpenCC = require('opencc-js')

const ChiConvList = props => {
  const { length = 4 } = props
  const hostname =
    typeof window !== 'undefined' && window.location.hostname
      ? window.location.hostname
      : ''
  const defaultLanguage = hostname === 'cn.andys.pro' ? 'zh-CN' : 'zh-TW'
  const [lang, setLang] = useState(defaultLanguage)
  const converter = OpenCC.Converter({ from: 'twp', to: 'cn' })
  const rootNode = document.documentElement
  const HTMLConvertHandler = OpenCC.HTMLConverter(
    converter,
    rootNode,
    'zh-TW',
    'zh-CN'
  )
  const tts = () => {
    localStorage.setItem('lang', 'zh-CN')
    setLang('zh-CN')
    HTMLConvertHandler.convert()
  }
  const stt = () => {
    localStorage.setItem('lang', 'zh-TW')
    setLang('zh-TW')
    HTMLConvertHandler.restore()
  }
  useEffect(() => {
    const localLang = localStorage.getItem('lang') || defaultLanguage
    if (localLang !== lang) {
      setLang(localLang)
    }
  }, [props])
  const onClick = lang === 'zh-TW' ? tts : stt
  const langString = (lang === 'zh-TW' ? '简体中文' : '繁體中文').substring(
    0,
    length
  )
  return (
    <a
      onClick={onClick}
      className={
        'py-1.5 px-5 text-base justify-between hover:bg-blue-400 hover:text-white hover:shadow-lg cursor-pointer font-light flex flex-nowrap items-center '
      }
    >
      <div className="my-auto items-center justify-center flex ">
        <i className={'fa fa-language w-4 text-center'} />
        <div className={'ml-4'}>{langString}</div>
      </div>
    </a>
  )
}

export default ChiConvList
