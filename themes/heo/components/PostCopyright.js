import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import CONFIG from '../config'
import NotByAI from '@/components/NotByAI'
import { resolveArticleCopyrightText } from '@/lib/utils/articleCopyright'

/**
 * 版权声明
 * @returns
 */
export default function PostCopyright({ post }) {
  const router = useRouter()
  const [path, setPath] = useState('') // 初始状态为空
  const [copied, setCopied] = useState(false) // 复制成功提示

  useEffect(() => {
    setPath(window.location.href) // 每次路由变化时更新 URL
  }, [router.asPath]) // 监听 router.asPath

  const { locale } = useGlobal()
  const copyrightText = resolveArticleCopyrightText({
    post,
    locale,
    mode: siteConfig('HEO_ARTICLE_COPYRIGHT', null, CONFIG)
  })
  // 文章带「原创」标签时第一行显示作者，否则显示整理
  const isOriginalPost =
    post?.tags?.includes('原创') ||
    post?.tagItems?.some(tag => tag.name === '原创')

  if (!copyrightText) {
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
    <section className='mt-6 mx-1 '>
      <ul className='overflow-x-auto whitespace-nowrap text-sm p-5 leading-8 border-l-2 border-l-[#b45309] bg-[rgba(217,119,6,0.06)] dark:border-l-[#d97706] dark:bg-[#1a110a] dark:text-[#fef3c7]'>
        <li>
          <strong className='mr-2'>
            {isOriginalPost ? locale.COMMON.AUTHOR : locale.COMMON.COMPILER || '整理'}:
          </strong>
          <SmartLink href={'/about'} className='hover:underline text-[#b45309] dark:text-[#fbbf24]'>
            {siteConfig('AUTHOR')}
          </SmartLink>
        </li>
        <li>
          <strong className='mr-2'>{locale.COMMON.URL}:</strong>
          <button
            className='whitespace-normal break-words hover:underline text-[#b45309] dark:text-[#fbbf24]'
            onClick={handleCopy}
          >
            {path} <span className='text-gray-500 dark:text-gray-400'>(单击复制链接)</span>
          </button>
          {copied && <span className='ml-2 text-[#b45309] dark:text-[#fbbf24]'>✅ 链接复制成功!</span>}
        </li>
        <li>
          <strong className='mr-2'>{locale.COMMON.COPYRIGHT}:</strong>
          {copyrightText}
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
