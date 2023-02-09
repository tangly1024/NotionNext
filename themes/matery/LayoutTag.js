import BLOG from '@/blog.config'
import BlogPostListScroll from './components/BlogPostListScroll'
import BlogPostListPage from './components/BlogPostListPage'
import LayoutBase from './LayoutBase'
import React from 'react'
import HeaderArticle from './components/HeaderArticle'
import { useGlobal } from '@/lib/global'
import TagItemMiddle from './components/TagItemMiddle'

export const LayoutTag = (props) => {
  const { tagOptions, tag } = props

  const { locale } = useGlobal()

  return <LayoutBase {...props} headerSlot={<HeaderArticle {...props} />} >

        <div className='inner-wrapper'>

            <div className="drop-shadow-xl -mt-32 rounded-md mx-3 px-5 lg:border lg:rounded-xl lg:px-2 lg:py-4 bg-white dark:bg-hexo-black-gray  dark:border-black">

                <div className="dark:text-gray-200 py-5 text-center  text-2xl">
                    <i className="fas fa-tags" />  {locale.COMMON.TAGS}
                </div>

                <div id="tags-list" className="duration-200 flex flex-wrap justify-center pb-12">
                    {tagOptions.map(e => {
                      const selected = tag === e.name
                      return (
                            <div key={e.id} className="p-2">
                                <TagItemMiddle key={e.id} tag={e} selected={selected} />
                            </div>
                      )
                    })}
                </div>
            </div>

            {BLOG.POST_LIST_STYLE === 'page' ? <BlogPostListPage {...props} /> : <BlogPostListScroll {...props} />}

        </div>

    </LayoutBase>
}
