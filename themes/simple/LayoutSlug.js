import LayoutBase from './LayoutBase'
import { ArticleLock } from './components/ArticleLock'
import NotionPage from '@/components/NotionPage'
import { ArticleInfo } from './components/ArticleInfo'
import Comment from '@/components/Comment'
import ArticleAround from './components/ArticleAround'
import ShareBar from '@/components/ShareBar'
import { AdSlot } from '@/components/GoogleAdsense'

export const LayoutSlug = props => {
  const { post, lock, validPassword, prev, next } = props

  return (
        <LayoutBase {...props}>

            {lock && <ArticleLock validPassword={validPassword} />}

            <div id="notion-article" className="px-2 xl:max-w-4xl 2xl:max-w-6xl ">

                <ArticleInfo post={post} />

                <AdSlot type={'in-article'} />

                {!lock && <NotionPage post={post} />}

                <ShareBar post={post} />

                <AdSlot type={'in-article'} />

                {post?.type === 'Post' && <ArticleAround prev={prev} next={next} />}

                <Comment frontMatter={post} />

            </div>

        </LayoutBase>
  )
}

export default LayoutSlug
