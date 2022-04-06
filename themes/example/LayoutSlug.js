import { getPageTableOfContents } from 'notion-utils'
import LayoutBase from './LayoutBase'
import { ArticleLock } from './components/ArticleLock'
import NotionPage from '@/components/NotionPage'

export const LayoutSlug = props => {
  const { post, lock, validPassword } = props
  if (!lock && post?.blockMap?.block) {
    post.content = Object.keys(post.blockMap.block)
    post.toc = getPageTableOfContents(post, post.blockMap)
  }

  return (
    <LayoutBase {...props}>
      <div>
        <h2>{post?.title}</h2>

        {lock && <ArticleLock password={post.password} validPassword={validPassword} />}

        {!lock && <section id="notion-article" className="px-1">
          {post.blockMap && <NotionPage post={post} />}
        </section>}

      </div>
    </LayoutBase>
  )
}
