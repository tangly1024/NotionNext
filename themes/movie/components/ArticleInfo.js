import { useGlobal } from '@/lib/global'
import { formatDateFmt } from '@/lib/utils/formatDate'
import Link from 'next/link'

export const ArticleInfo = props => {
  const { post } = props
  const { locale } = useGlobal()

  return (
    <section className='w-full mx-auto mb-4'>
      <h2 className='text-5xl font-semibold py-10 dark:text-white text-center'>{post?.title}</h2>

        {post?.type !== 'Page' && (
          <>
            <Link href={`/category/${post?.category}`} passHref className='cursor-pointer text-md mr-2 text-green-500'>
              {post?.category}
            </Link>
          </>
        )}

        <div className='flex py-1 space-x-3'>
          {post?.tags?.length > 0 && (
            <>
              {locale.COMMON.TAGS} <span>:</span>
            </>
          )}
          {post?.tags?.map(tag => {
            return (
              <Link href={`/tag/${tag}`} key={tag} className='text-yellow-500 mr-2'>
                {tag}
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
