import { useGlobal } from '@/lib/global'
import Link from 'next/link'
import CONFIG_NEXT from '../config_next'

export default function ArticleCopyright ({ author, url }) {
  if (!CONFIG_NEXT.ARTICLE_COPYRIGHT) {
    return <></>
  }
  const { locale } = useGlobal()
  return <section className="dark:text-gray-300 mt-6">
    <ul className="overflow-x-auto whitespace-nowrap text-sm dark:bg-gray-700 bg-gray-100 p-5 leading-8 border-l-2 border-blue-500">
      <li>
        <strong className='mr-2'>{locale.COMMON.AUTHOR}:</strong>
        <Link href={'/about'} >
          <a className="hover:underline">{author}</a>
        </Link>
      </li>
      <li>
      <strong className='mr-2'>{locale.COMMON.URL}:</strong>
        <a className="hover:underline" href={url}>
          {url}
        </a>
      </li>
      <li>
        <strong className='mr-2'>{locale.COMMON.COPYRIGHT}:</strong>
        {locale.COMMON.COPYRIGHT_NOTICE}
      </li>
    </ul>
  </section>
}
