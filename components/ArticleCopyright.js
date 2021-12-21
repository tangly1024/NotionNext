import { useGlobal } from '@/lib/global'
import Link from 'next/link'

export default function ArticleCopyright ({ author, url }) {
  const { locale } = useGlobal()
  return <section className="dark:text-gray-300 mt-6">
    <div className="text-2xl mb-2">{locale.COMMON.COPYRIGHT}</div>
    <ul className="text-sm dark:bg-gray-900 bg-gray-100 p-5 leading-8 border-l-4 border-red-500">
      <li>
        <strong className='mr-2'>{locale.COMMON.AUTHOR}:</strong>
        <Link href="/about">
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
      {locale.COMMON.COPYRIGHT_NOTICE}
      </li>
    </ul>
  </section>
}
