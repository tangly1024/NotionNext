import LayoutBase from './LayoutBase'
import React from 'react'
import { ArticleLock } from './components/ArticleLock'
import NotionPage from '@/components/NotionPage'
import CONFIG_GITBOOK from './config_gitbook'
import Comment from '@/components/Comment'
import ArticleAround from './components/ArticleAround'
import TocDrawer from './components/TocDrawer'
import CategoryItem from './components/CategoryItem'
import TagItemMini from './components/TagItemMini'
import ShareBar from '@/components/ShareBar'
import { AdSlot } from '@/components/GoogleAdsense'

export const LayoutSlug = (props) => {
  const { post, prev, next, lock, validPassword } = props

  return (
        <LayoutBase {...props} >
            {/* 文章锁 */}
            {lock && <ArticleLock validPassword={validPassword} />}

            {!lock && <div id='container'>

                {/* title */}
                <h1 className="text-3xl pt-12  dark:text-gray-300">{post?.title}</h1>

                {/* Notion文章主体 */}
                {post && (<section id="notion-article" className="px-1">
                    <NotionPage post={post} />
                </section>)}

                <section>

                    {/* 分享 */}
                    <ShareBar post={post} />
                    {/* 文章分类和标签信息 */}
                    <div className='flex justify-between'>
                        {CONFIG_GITBOOK.POST_DETAIL_CATEGORY && post?.category && <CategoryItem category={post.category} />}
                        <div>
                            {CONFIG_GITBOOK.POST_DETAIL_TAG && post?.tagItems?.map(tag => <TagItemMini key={tag.name} tag={tag} />)}
                        </div>
                    </div>

                    {post?.type === 'Post' && <ArticleAround prev={prev} next={next} />}

                    <AdSlot/>

                    <Comment frontMatter={post} />
                </section>

                <TocDrawer {...props} />
            </div>}
        </LayoutBase>
  )
}

export default LayoutSlug
