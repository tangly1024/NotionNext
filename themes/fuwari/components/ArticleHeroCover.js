/**
 * 文章卡片内顶部封面（直角矩形 + object-cover）
 */
const ArticleHeroCover = ({ coverSrc, title }) => {
  if (!coverSrc) return null

  return (
    <div className='fuwari-article-card-cover mb-6 min-w-0 w-full'>
      <div className='relative h-[200px] w-full overflow-hidden sm:h-[240px] md:h-[260px]'>
        <img
          src={coverSrc}
          alt={title ? `封面：${title}` : ''}
          className='absolute inset-0 h-full w-full object-cover object-center'
          loading='eager'
          decoding='async'
        />
      </div>
    </div>
  )
}

export default ArticleHeroCover
