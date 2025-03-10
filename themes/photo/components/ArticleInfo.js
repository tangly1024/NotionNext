/**
 * 文章页头
 * @param {*} props
 * @returns
 */
export const ArticleHeader = props => {
  const { post } = props

  return (
    <section className='w-full mx-auto mb-4'>
      {/* 标题部分 */}
      {/* 将标题字体大小设置为 16px，并将字体粗细设置为细体 */}
      <h2
        className='py-10 dark:text-white text-center'
        style={{
          fontSize: '16px', // 设置字体大小为 16px
          fontWeight: '300' // 设置字体粗细为细体
        }}>
        {post?.title}
      </h2>
    </section>
  )
}
