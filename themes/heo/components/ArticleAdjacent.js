import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import CONFIG from '../config'

/**
 * 上一篇，下一篇文章
 * @param {prev,next} param0
 * @returns
 */
export default function ArticleAdjacent({ prev, next }) {
  const [isScrollEnd, setIsScrollEnd] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsScrollEnd(false)
  }, [router])

  useEffect(() => {
    // 文章是否已经到了底部
    const targetElement = document.getElementById('article-end')

    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsScrollEnd(true)
        }
      })
    }

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    }

    const observer = new IntersectionObserver(handleIntersect, options)
    observer.observe(targetElement)

    return () => {
      observer.disconnect()
    }
  }, [])

  if (!prev || !next || !CONFIG.ARTICLE_ADJACENT) {
    return <></>
  }

  return (
        <div id='article-end'>
            {/* 移动端 */}
            <section className='lg:hidden pt-8 text-gray-800 items-center text-xs md:text-sm flex flex-col m-1 '>
                <Link
                    href={`/${prev.slug}`}
                    passHref
                    className='cursor-pointer justify-between space-y-1 px-5 py-6 rounded-t-xl dark:bg-[#1e1e1e] border dark:border-gray-600 border-b-0 items-center dark:text-white flex flex-col w-full h-18 duration-200'
                >
                    <div className='flex justify-start items-center w-full'>上一篇</div>
                    <div className='flex justify-center items-center text-lg font-bold'>{prev.title}</div>
                </Link>
                <Link
                    href={`/${next.slug}`}
                    passHref
                    className='cursor-pointer justify-between space-y-1 px-5 py-6 rounded-b-xl dark:bg-[#1e1e1e] border dark:border-gray-600 items-center dark:text-white flex flex-col w-full h-18 duration-200'
                >
                    <div className='flex justify-start items-center w-full'>下一篇</div>
                    <div className='flex justify-center items-center text-lg font-bold'>{next.title}</div>
                </Link>
            </section>

            {/* 桌面端 */}

            <div id='pc-next-post' className={`hidden md:block fixed z-40 right-24 bottom-4 duration-200 transition-all ${isScrollEnd ? 'mb-0 opacity-100' : '-mb-24 opacity-0'}`}>
                <Link
                    href={`/${next.slug}`}
                    className='cursor-pointer drop-shadow-xl duration transition-all h-24 dark:bg-[#1e1e1e] border dark:border-gray-600 p-3 bg-white dark:text-gray-300 dark:hover:text-yellow-600 hover:text-white hover:font-bold hover:bg-blue-600 rounded-lg flex flex-col justify-between'
                >
                    <div className='text-xs'>下一篇</div>
                    <hr />
                    <div>{next?.title}</div>
                </Link>
            </div>

        </div>
  )
}
