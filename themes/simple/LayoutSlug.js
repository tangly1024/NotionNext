import LayoutBase from './LayoutBase'
import { ArticleLock } from './components/ArticleLock'
import NotionPage from '@/components/NotionPage'
import { ArticleInfo } from './components/ArticleInfo'
import Comment from '@/components/Comment'
import ArticleAround from './components/ArticleAround'
import ShareBar from '@/components/ShareBar'

export const LayoutSlug = props => {
  const { post, lock, validPassword, prev, next } = props

  if (!post) {
    return <LayoutBase {...props} />
  }

  return (
        <LayoutBase {...props}>

                {lock && <ArticleLock validPassword={validPassword} />}

                {!lock && <div id="notion-article" className="px-2 xl:max-w-4xl 2xl:max-w-6xl ">

                    {post && <>
                        <ArticleInfo post={post} />
                        <NotionPage post={post} />
                        {/* 分享 */}
                        <ShareBar post={post} />
                        {post.type === 'Post' && <ArticleAround prev={prev} next={next} />}
                        <Comment frontMatter={post}/>
                    </>}
                </div>}

        </LayoutBase>
  )
}
