import { loadExternalResource } from '@/lib/utils'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

/**
 *
 * @returns 主题切换
 */
const Translate = () => {
  const router = useRouter()
  const loadTranslate = async () => {
    try {
      const url = await loadExternalResource('https://res.zvo.cn/translate/translate.js', 'js')
      console.log('translate 加载成功', url)
      const translate = window.translate

      // translate.ignore.tag.push('span'); //翻译时追加上自己想指定忽略的tag标签，凡是在这里面的，都不进行翻译。
      // translate.ignore.class.push('test'); //翻译时指定忽略的class name，凡是class name 在这里面的，都不进行翻译。如果不设置默认只有 ignore 这一个
      // translate.setAutoDiscriminateLocalLanguage(); //设置用户第一次用时，自动识别其所在国家的语种进行切换

      translate.language.setLocal('chinese_traditional')
      translate.setUseVersion2() // 设置使用v2.x 版本
      translate.execute() // 执行翻译初始化操作，显示出select语言选择
    } catch (error) {
      console.error('translate 加载失败', error)
    }
  }

  useEffect(() => {
    loadTranslate()
  }, [router.events])

  return (<div id='translate'></div>)
}

/**
 * 支持的语言
 */
// eslint-disable-next-line no-unused-vars
const supportLanguages = [
  {
    id: 'german',
    name: 'Deutsch'
  },
  {
    id: 'corsican',
    name: 'Corsu'
  },
  {
    id: 'guarani',
    name: 'guarani'
  },
  {
    id: 'hausa',
    name: 'Hausa'
  },
  {
    id: 'welsh',
    name: 'Cymraeg'
  },
  {
    id: 'dutch',
    name: 'Nederlands'
  },
  {
    id: 'japanese',
    name: '日本語'
  },
  {
    id: 'english',
    name: 'English'
  },
  {
    id: 'gongen',
    name: 'गोंगेन हें नांव'
  },
  {
    id: 'aymara',
    name: 'Aymara'
  },
  {
    id: 'french',
    name: 'Français'
  },
  {
    id: 'haitian_creole',
    name: 'Kreyòl ayisyen'
  },
  {
    id: 'czech',
    name: 'čeština'
  },
  {
    id: 'hawaiian',
    name: 'ʻŌlelo Hawaiʻi'
  },
  {
    id: 'dogrid',
    name: 'डोग्रिड ने दी'
  },
  {
    id: 'russian',
    name: 'Русский язык'
  },
  {
    id: 'thai',
    name: 'ภาษาไทย'
  },
  {
    id: 'armenian',
    name: 'հայերեն'
  },
  {
    id: 'chinese_simplified',
    name: '简体中文'
  },
  {
    id: 'persian',
    name: 'فارسی'
  },
  {
    id: 'hmong',
    name: 'Hmoob'
  },
  {
    id: 'dhivehi',
    name: 'ދިވެހި'
  },
  {
    id: 'bhojpuri',
    name: 'भोजपुरी'
  },
  {
    id: 'chinese_traditional',
    name: '繁體中文'
  },
  {
    id: 'turkish',
    name: 'Türkçe'
  },
  {
    id: 'hindi',
    name: 'हिंदी'
  },
  {
    id: 'belarusian',
    name: 'беларускі'
  },
  {
    id: 'bulgarian',
    name: 'български'
  },
  {
    id: 'twi',
    name: 'tur'
  },
  {
    id: 'irish',
    name: 'Gaeilge'
  },
  {
    id: 'gujarati',
    name: 'ગુજરાતી'
  },
  {
    id: 'hungarian',
    name: 'Magyar'
  },
  {
    id: 'estonian',
    name: 'eesti keel'
  },
  {
    id: 'arabic',
    name: 'بالعربية'
  },
  {
    id: 'bengali',
    name: 'বাংলা'
  },
  {
    id: 'azerbaijani',
    name: 'Azərbaycan'
  },
  {
    id: 'portuguese',
    name: 'Português'
  },
  {
    id: 'Cebuano',
    name: 'Cebuano'
  },
  {
    id: 'afrikaans',
    name: 'Suid-Afrikaanse Dutch taal'
  },
  {
    id: 'kurdish_sorani',
    name: 'کوردی-سۆرانی'
  },
  {
    id: 'greek',
    name: 'Ελληνικά'
  },
  {
    id: 'spanish',
    name: 'español'
  },
  {
    id: 'frisian',
    name: 'Frysk'
  },
  {
    id: 'danish',
    name: 'dansk'
  },
  {
    id: 'amharic',
    name: 'አማርኛ'
  },
  {
    id: 'bambara',
    name: 'Bamanankan'
  },
  {
    id: 'basque',
    name: 'euskara'
  },
  {
    id: 'vietnamese',
    name: 'Tiếng Việt'
  },
  {
    id: 'korean',
    name: '한어'
  },
  {
    id: 'assamese',
    name: 'অসমীয়া'
  },
  {
    id: 'catalan',
    name: 'català'
  },
  {
    id: 'finnish',
    name: 'Suomalainen'
  },
  {
    id: 'ewe',
    name: 'Eʋegbe'
  },
  {
    id: 'croatian',
    name: 'Hrvatski'
  },
  {
    id: 'scottish-gaelic',
    name: 'Gàidhlig na h-Alba'
  },
  {
    id: 'bosnian',
    name: 'bosanski'
  },
  {
    id: 'galician',
    name: 'galego'
  }
]

export default Translate
