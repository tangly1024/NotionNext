import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import CONFIG from '../config'
import NotByAI from '@/components/NotByAI'

/**
 * 版权声明
 * @returns
 */
export default function PostCopyright() {
  const router = useRouter()
  const [path, setPath] = useState('') // 初始状态为空
  const [copied, setCopied] = useState(false) // 复制成功提示

  useEffect(() => {
    setPath(window.location.href) // 每次路由变化时更新 URL
  }, [router.asPath]) // 监听 router.asPath

  const { locale } = useGlobal()

  if (!siteConfig('HEO_ARTICLE_COPYRIGHT', null, CONFIG)) {
    return <></>
  }

  // 复制链接的函数
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(path)
      setCopied(true) // 设置复制成功
      setTimeout(() => setCopied(false), 2000) // 2秒后隐藏提示
    } catch (error) {
      console.error('复制失败:(')
    }
  }

  return (
    <section className='dark:text-gray-300 mt-6 mx-1 '>
      <ul className='overflow-x-auto whitespace-nowrap text-sm dark:bg-gray-900 bg-gray-100 p-5 leading-8 border-l-2 border-indigo-500'>
        <li>
          <strong className='mr-2'>{locale.COMMON.AUTHOR}:</strong>
          <SmartLink href={'/about'} className='hover:underline'>
            {siteConfig('AUTHOR')}
          </SmartLink>
        </li>
        <li>
          <strong className='mr-2'>{locale.COMMON.URL}:</strong>
          <button
            className='whitespace-normal break-words hover:underline text-blue-500'
            onClick={handleCopy}
          >
            {path} <span className='text-gray-500'>(单击复制链接)</span>
          </button>
          {copied && <span className='ml-2 text-green-500'>✅ 链接复制成功!</span>}
        </li>
        <li>
          <strong className='mr-2'>{locale.COMMON.COPYRIGHT}:</strong>
          {locale.COMMON.COPYRIGHT_NOTICE}
        </li>
        {siteConfig('HEO_ARTICLE_NOT_BY_AI', false, CONFIG) && (
          <li>
            <NotByAI />
          </li>
        )}
      </ul>
    </section>
  )
}
