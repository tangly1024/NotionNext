import BLOG from '@/blog.config'
import { useGlobal } from '@/lib/global'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import CONFIG from '../config'

export default function ArticleCopyright () {
  const router = useRouter()
  const [path, setPath] = useState(BLOG.LINK + router.asPath)
  useEffect(() => {
    setPath(window.location.href)
  })

  const { locale } = useGlobal()

  if (!CONFIG.ARTICLE_COPYRIGHT) {
    return <></>
  }

  return (
    <section className="dark:text-gray-300 mt-6 mx-1 ">
      <ul className="overflow-x-auto whitespace-nowrap text-sm dark:bg-gray-900 bg-gray-100 p-5 leading-8 border-l-2 border-indigo-500">
        <li>
          <strong className='mr-2'>{locale.COMMON.AUTHOR}:</strong>
          <Link href={'/about'} className="hover:underline">
            {BLOG.AUTHOR}
          </Link>
        </li>
        <li>
        <strong className='mr-2'>{locale.COMMON.URL}:</strong>
          <a className="whitespace-normal break-words hover:underline" href={path}>
            {path}
          </a>
        </li>
        <li>
          <strong className='mr-2'>{locale.COMMON.COPYRIGHT}:</strong>
          {locale.COMMON.COPYRIGHT_NOTICE}
        </li>
      </ul>
    </section>
  )
}
