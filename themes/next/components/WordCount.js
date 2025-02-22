import { useGlobal } from '@/lib/global'
import { useEffect } from 'react'

/**
 * 字数统计
 * @returns
 */
export default function WordCount() {
  useEffect(() => {
    countWords()
  })

  const { locale } = useGlobal()

  return <div id='wordCountWrapper' className='flex justify-center my-auto font-light'>
    <i className='mr-1 fas fa-file-word my-auto' />
    <span className='hidden md:block'>{locale.COMMON.WORD_COUNT}≈</span>
    <strong id='wordCount'>0</strong> &nbsp;|&nbsp; <i className='mr-1 fas fa-clock my-auto' />{locale.COMMON.READ_TIME} <span className='hidden md:block'>≈</span> <strong id='readTime'>0</strong> {locale.COMMON.MINUTE}
  </div>
}

/**
 * 更新字数统计和阅读时间
 */
function countWords() {
  const articleText = deleteHtmlTag(document.getElementById('notion-article')?.innerHTML)
  const wordCount = fnGetCpmisWords(articleText)
  // 阅读速度 300-500每分钟
  document.getElementById('wordCount').innerHTML = wordCount
  document.getElementById('readTime').innerHTML = Math.floor(wordCount / 400) + 1
  const wordCountWrapper = document.getElementById('wordCountWrapper')
  wordCountWrapper.classList.remove('hidden')
}

// 去除html标签
function deleteHtmlTag(str) {
  if (!str) {
    return ''
  }
  str = str.replace(/<[^>]+>|&[^>]+;/g, '').trim()// 去掉所有的html标签和&nbsp;之类的特殊符合
  return str
}

// 用word方式计算正文字数
function fnGetCpmisWords(str) {
  if (!str) {
    return 0
  }
  let sLen = 0
  try {
    // eslint-disable-next-line no-irregular-whitespace
    str = str.replace(/(\r\n+|\s+|　+)/g, '龘')
    // eslint-disable-next-line no-control-regex
    str = str.replace(/[\x00-\xff]/g, 'm')
    str = str.replace(/m+/g, '*')
    str = str.replace(/龘+/g, '')
    sLen = str.length
  } catch (e) {

  }
  return sLen
}
