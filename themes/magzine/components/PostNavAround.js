import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

/**
 * 上一篇，下一篇文章
 * @param {prev,next} param0
 * @returns
 */
export default function PostNavAround({ prev, next }) {
  const [isShow, setIsShow] = useState(false)
  const router = useRouter()
  const { locale } = useGlobal()

  useEffect(() => {
    setIsShow(false)
  }, [router])

  useEffect(() => {
    // 文章到底部时显示下一篇文章推荐
    const articleEnd = document.getElementById('article-end')
    const footerBottom = document.getElementById('footer-bottom')

    const handleIntersect = entries => {
      entries.forEach(entry => {
        if (entry.target === articleEnd) {
          if (entry.isIntersecting) {
            setIsShow(true)
          }
        } else if (entry.target === footerBottom) {
          if (entry.isIntersecting) {
            setIsShow(false)
          }
        }
      })
    }

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    }

    const observer = new IntersectionObserver(handleIntersect, options)
    if (articleEnd) observer.observe(articleEnd)
    if (footerBottom) observer.observe(footerBottom)

    return () => {
      if (articleEnd) observer.unobserve(articleEnd)
      if (footerBottom) observer.unobserve(footerBottom)
      observer.disconnect()
    }
  }, [])

  //  隐藏该组件的条件
  if (!prev || !next || !siteConfig('MAGZINE_ARTICLE_ADJACENT', true)) {
    return null
  }

  return (
    <div id='article-end'>
      {/* 移动端 */}
      <section className='lg:hidden pt-8 text-gray-800 items-center text-xs md:text-sm flex flex-col m-1 '>
        <Link
          href={`/${prev.slug}`}
          passHref
          className='cursor-pointer justify-between space-y-1 px-5 py-6 dark:bg-[#1e1e1e] border dark:border-gray-600 border-b-0 items-center dark:text-white flex flex-col w-full h-18 duration-200'>
          <div className='flex justify-start items-center w-full'>上一篇</div>
          <div className='flex justify-center items-center text-lg font-bold'>
            {prev.title}
          </div>
        </Link>
        <Link
          href={`/${next.slug}`}
          passHref
          className='cursor-pointer justify-between space-y-1 px-5 py-6 dark:bg-[#1e1e1e] border dark:border-gray-600 items-center dark:text-white flex flex-col w-full h-18 duration-200'>
          <div className='flex justify-start items-center w-full'>下一篇</div>
          <div className='flex justify-center items-center text-lg font-bold'>
            {next.title}
          </div>
        </Link>
      </section>

      {/* 桌面端 */}

      <div
        id='pc-next-post'
        className={`${isShow ? 'mb-5 opacity-100' : '-mb-24 opacity-0'} hidden md:block fixed z-40 right-10 bottom-4 duration-200 transition-all`}>
        <Link
          href={`/${next.slug}`}
          className='text-sm block p-4 w-72 h-28 cursor-pointer drop-shadow-xl duration transition-all dark:bg-[#1e1e1e] border dark:border-gray-600 bg-white dark:text-gray-300 dark:hover:text-yellow-600 hover:font-bold hover:text-green-600'>
          <div className='font-semibold'>{locale.COMMON.NEXT_POST}</div>
          <hr className='mt-2 mb-3' />
          <div className='line-clamp-2'>{next?.title}</div>
        </Link>
      </div>
    </div>
  )
}
