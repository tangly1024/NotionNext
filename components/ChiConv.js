import { useGlobal } from '@/lib/global'
import { useState } from 'react'
const OpenCC = require('opencc-js')
const ChiConv = ({ length = 1, inList = false }) => {
  const { locale } = useGlobal()
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
  const onClick = lang === 'zh-TW' ? tts : stt
  const langString = (lang === 'zh-TW' ? '繁體中文' : '简体中文').substring(
    0,
    length
  )
  // console.log(locale)
  if (!inList) return <button onClick={onClick}>{langString}</button>
  else
    return (
      <a
        onClick={onClick}
        className={
          'py-1.5 px-5 text-base justify-between hover:bg-blue-400 hover:text-white hover:shadow-lg cursor-pointer font-light flex flex-nowrap items-center '
        }
      >
        <div className="my-auto items-center justify-center flex ">
          <i className={`fa fa-language w-4 text-center`} />
          <div className={'ml-4'}>{langString}</div>
        </div>
      </a>
    )
}

export default ChiConv
