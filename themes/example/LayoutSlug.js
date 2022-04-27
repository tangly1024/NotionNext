import { getPageTableOfContents } from 'notion-utils'
import LayoutBase from './LayoutBase'
import { ArticleLock } from './components/ArticleLock'
import NotionPage from '@/components/NotionPage'
import { ArticleInfo } from './components/ArticleInfo'
import Comment from '@/components/Comment'

export const LayoutSlug = props => {
  const { post, lock, validPassword } = props

  if (!post) {
    return <LayoutBase {...props} />
  }

  if (!lock && post?.blockMap?.block) {
    post.content = Object.keys(post.blockMap.block)
    post.toc = getPageTableOfContents(post, post.blockMap)
  }

  return (
        <LayoutBase {...props}>

                {lock && <ArticleLock password={post.password} validPassword={validPassword} />}

                {!lock && <div id="notion-article" className="px-2">

                    {post && <>
                        <ArticleInfo post={post} />
                        <NotionPage post={post} />
                        <Comment frontMatter={post}/>
                    </>}
                </div>}

        </LayoutBase>
  )
}
