import Link from 'next/link'
import { useGlobal } from '@/lib/global'
import formatDate from '@/lib/formatDate'
import TagItemMiddle from './TagItemMiddle'
import WordCount from './WordCount'

export const ArticleInfo = (props) => {
  const { post } = props

  const { locale } = useGlobal()
  const date = formatDate(post?.date?.start_date || post?.createdTime, locale.LOCALE)

  return <section className='mb-3 dark:text-gray-200'>
        <div className='my-3'>
            {post.tagItems && (
                <div className="flex flex-nowrap overflow-x-auto">
                    {post.tagItems.map(tag => (
                        <TagItemMiddle key={tag.name} tag={tag} />
                    ))}
                </div>
            )}
        </div>

        <div className='flex flex-wrap gap-3 mt-5 text-sm'>
            {post?.type !== 'Page' && (<>
                <Link
                    href={`/archive#${post?.date?.start_date?.substr(0, 7)}`}
                    passHref
                >
                    <a className="cursor-pointer whitespace-nowrap">
                        <i className='far fa-calendar-minus fa-fw'/> 发布日期: {date}
                    </a>
                </Link>
                <span className='whitespace-nowrap'>
                    <i className='far fa-calendar-check fa-fw' /> 更新日期: {post.lastEditedTime}
                </span>
                <span className="hidden busuanzi_container_page_pv font-light mr-2">
                    <i className='mr-1 fas fa-eye' /><span className="busuanzi_value_page_pv" />
                </span>
                <WordCount />
            </>)}
        </div>

    </section>
}
