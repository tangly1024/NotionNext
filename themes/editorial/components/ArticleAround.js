import SmartLink from '@/components/SmartLink'

export default function ArticleAround({ prev, next }) {
  if (!prev && !next) return null
  return (
    <nav className='editorial-article-around' aria-label='Adjacent articles'>
      {prev ? (
        <SmartLink href={`/${prev.slug}`}>
          <small>Previous</small>
          <span>← {prev.title}</span>
        </SmartLink>
      ) : (
        <span />
      )}
      {next ? (
        <SmartLink href={`/${next.slug}`}>
          <small>Next</small>
          <span>{next.title} →</span>
        </SmartLink>
      ) : (
        <span />
      )}
    </nav>
  )
}
