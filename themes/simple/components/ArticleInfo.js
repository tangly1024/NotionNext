import Link from 'next/link'
import { useGlobal } from '@/lib/global'
import CONFIG from '../config'
import { siteConfig } from '@/lib/config'
import { formatDateFmt } from '@/lib/utils/formatDate'
import NotionIcon from '@/components/NotionIcon'

export default function ArticleInfo({ post }) {
  const { locale } = useGlobal()

  return (
    <section className="mt-4 space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-300 md:text-3xl">
        {siteConfig('POST_TITLE_ICON') && <NotionIcon icon={post?.pageIcon} />}
        {post?.title}
      </h2>

      {post?.type !== 'Page' && (
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <span className="flex items-center">
            <i className="fa-regular fa-user mr-1"></i>
            <a href={siteConfig('SIMPLE_AUTHOR_LINK', null, CONFIG)} className="hover:text-gray-800 dark:hover:text-gray-200">
              {siteConfig('AUTHOR')}
            </a>
          </span>

          <span className="flex items-center">
            <i className="fa-regular fa-clock mr-1"></i>
            {post?.publishDay}
          </span>

          {post?.category && (
            <span className="flex items-center">
              <i className="fa-regular fa-folder mr-1"></i>
              <a href={`/category/${post?.category}`} className="hover:text-gray-800 dark:hover:text-gray-200">
                {post?.category}
              </a>
            </span>
          )}

          {post?.tags && post?.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {post?.tags.map((t) => (
                <Link key={t} href={`/tag/${t}`}>
                  <span className="hover:text-gray-800 dark:hover:text-gray-200">
                    {t}
                  </span>
                </Link>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <Link
              href={`/archive#${formatDateFmt(post?.publishDate, 'yyyy-MM')}`}
              className="hover:text-gray-800 dark:hover:text-gray-200"
            >
              {locale.COMMON.POST_TIME}: {post?.publishDay}
            </Link>

            <span>|</span>

            <span>
              {locale.COMMON.LAST_EDITED_TIME}: {post?.lastEditedDay}
            </span>

            <span>|</span>

            <span className="hidden items-center busuanzi_container_page_pv">
              <i className="fas fa-eye mr-1"></i>
              <span className="busuanzi_value_page_pv"></span>
            </span>
          </div>
        </div>
      )}
    </section>
  )
}