import Link from 'next/link'
import LayoutBase from './LayoutBase'

export const LayoutIndex = props => {
  const { posts } = props
  return (
    <LayoutBase {...props}>
      Index
      {posts.map(p => (
        <div key={p.id} className='border my-12'>
          <Link href={`/article/${p.slug}`}>
            <a className='underline cursor-pointer'>{p.title}</a>
          </Link>
          <div>{p.summary}</div>
        </div>
      ))}
    </LayoutBase>
  )
}
