import Comment from '@/components/Comment'
import Link from 'next/link'
import ArticleAround from './ArticleAround'
import CategoryItem from './CategoryItem'
import TagItemMini from './TagItemMini'
import CONFIG_MEDIUM from '../config_medium'
import formatDate from '@/lib/formatDate'
import { useGlobal } from '@/lib/global'
import BLOG from '@/blog.config'
import NotionPage from '@/components/NotionPage'
import React from 'react'

export const ArticleDetail = props => {
  const { post, prev, next, siteInfo } = props
  const { locale } = useGlobal()

  const date = formatDate(
    post?.date?.start_date || post?.createdTime,
    locale.LOCALE
  )
  return (
    <div className="w-full lg:shadow-sm lg:hover:shadow lg:border lg:rounded-xl lg:px-2 lg:py-4 bg-white dark:bg-hexo-black-gray dark:border-black">
      <div
        id="container"
        className="overflow-x-auto flex-grow mx-auto md:w-full md:px-5 "
      >
        <article
          itemScope
          itemType="https://schema.org/Movie"
          className="subpixel-antialiased"
        >
          {/* Notion文章主体 */}
          <section
            id="notion-article"
            className="px-5 justify-center mx-auto max-w-2xl lg:max-w-full"
          >
            {post && <NotionPage post={post} />}
          </section>

          <section className="px-1 py-2 my-1 text-sm font-light overflow-auto text-gray-600  dark:text-gray-400">
            {/* 文章内嵌广告 */}
            <ins
              className="adsbygoogle"
              style={{ display: 'block', textAlign: 'center' }}
              data-adtest="on"
              data-ad-layout="in-article"
              data-ad-format="fluid"
              data-ad-client="ca-pub-2708419466378217"
              data-ad-slot="3806269138"
            />
          </section>
          {/*
            {post.type === 'Post' && <ArticleCopyright {...props} />}
            {post.type === 'Post' && <ArticleRecommend {...props} />}
            {post.type === 'Post' && <ArticleAdjacent {...props} />} */}
        </article>

        <hr className="border-dashed" />

        {/* 评论互动 */}
        <div className="duration-200 overflow-x-auto bg-white dark:bg-hexo-black-gray px-3">
          <Comment frontMatter={post} />
        </div>
      </div>
    </div>
  )
}
