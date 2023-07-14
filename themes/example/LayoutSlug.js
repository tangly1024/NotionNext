import LayoutBase from './LayoutBase'
import { ArticleLock } from './components/ArticleLock'
import NotionPage from '@/components/NotionPage'
import { ArticleInfo } from './components/ArticleInfo'
import Comment from '@/components/Comment'
import ShareBar from '@/components/ShareBar'

export const LayoutSlug = props => {
  const { post, lock, validPassword } = props

  if (!post) {
    return <LayoutBase {...props} />
  }

  return (
        <LayoutBase {...props}>

                {lock && <ArticleLock validPassword={validPassword} />}

                {!lock && <div id="notion-article" className="px-2">
                    {post && <>
                        <ArticleInfo post={post} />
                        <NotionPage post={post} />
                        <ShareBar post={post} />
                        <Comment frontMatter={post}/>
                    </>}
                </div>}

        </LayoutBase>
  )
}

export default LayoutSlug
