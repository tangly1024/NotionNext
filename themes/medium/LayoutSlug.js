import LayoutBase from './LayoutBase'
import { useGlobal } from '@/lib/global'
import React from 'react'
import Catalog from './components/Catalog'
import { ArticleLock } from './components/ArticleLock'
import formatDate from '@/lib/formatDate'
import BLOG from '@/blog.config'
import Link from 'next/link'
import NotionPage from '@/components/NotionPage'
import CONFIG_MEDIUM from './config_medium'
import Comment from '@/components/Comment'
import ArticleAround from './components/ArticleAround'
import TocDrawer from './components/TocDrawer'
import CategoryItem from './components/CategoryItem'
import TagItemMini from './components/TagItemMini'

export const LayoutSlug = props => {
  const { post, prev, next, siteInfo, lock, validPassword } = props
  const { locale } = useGlobal()

  const date = formatDate(
    post?.date?.start_date || post?.createdTime,
    locale.LOCALE
  )
  if (!post) {
    return <LayoutBase {...props} showInfoCard={true}
        />
  }

  const slotRight = post?.toc && post?.toc?.length > 3 && (
        <div key={locale.COMMON.TABLE_OF_CONTENTS} >
            <Catalog toc={post.toc} />
            {/* <JumpToTopButton className='text-gray-400 hover:text-green-500 hover:bg-gray-100 py-1 duration-200' /> */}
        </div>
  )

  return (
        <LayoutBase showInfoCard={true} slotRight={slotRight} {...props} >
            {/* 文章锁 */}
            {lock && <ArticleLock validPassword={validPassword} />}

            {!lock && <div id='container'>

                {/* title */}
                <h1 className="text-3xl pt-12  dark:text-gray-300">{post?.title}</h1>

                {/* meta */}
                <section className="py-2 items-center text-sm  px-1">
                    <div className='flex flex-wrap text-gray-500 py-1 dark:text-gray-600'>
                        <span className='whitespace-nowrap'> <i className='far fa-calendar mr-2' />{date}</span>
                        <span className='mx-1'>|</span>
                        <span className='whitespace-nowrap mr-2'><i className='far fa-calendar-check mr-2' />{post.lastEditedTime}</span>
                        <div className="hidden busuanzi_container_page_pv font-light mr-2 whitespace-nowrap">
                            <i className="mr-1 fas fa-eye" /><span className="busuanzi_value_page_pv" />
                        </div>
                    </div>
                    <Link href="/about" passHref legacyBehavior>
                        <div className='flex pt-2'>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={siteInfo?.icon} className='rounded-full cursor-pointer' width={22} alt={BLOG.AUTHOR} />

                            <div className="mr-3 ml-2 my-auto text-green-500 cursor-pointer">
                                {BLOG.AUTHOR}
                            </div>
                        </div>
                    </Link>
                </section>

                {/* Notion文章主体 */}
                <section id="notion-article" className="px-1 max-w-4xl">
                    {post && (<NotionPage post={post} />)}
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

                <section>
                    <div className='flex justify-between'>
                        {CONFIG_MEDIUM.POST_DETAIL_CATEGORY && post.category && <CategoryItem category={post.category} />}
                        <div>
                            {CONFIG_MEDIUM.POST_DETAIL_TAG && post?.tagItems?.map(tag => <TagItemMini key={tag.name} tag={tag} />)}
                        </div>
                    </div>
                    {post.type === 'Post' && <ArticleAround prev={prev} next={next} />}
                    <Comment frontMatter={post} />
                </section>

                <TocDrawer {...props} />
            </div>}
        </LayoutBase>
  )
}
