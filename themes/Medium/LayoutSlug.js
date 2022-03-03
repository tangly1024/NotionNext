import BLOG from '@/blog.config'
import { getPageTableOfContents } from 'notion-utils'
import 'prismjs'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-typescript'
import {
  Code,
  Collection,
  CollectionRow,
  Equation,
  NotionRenderer
} from 'react-notion-x'
import LayoutBase from './LayoutBase'
import Comment from '@/components/Comment'
import Image from 'next/image'
import { useGlobal } from '@/lib/global'
import formatDate from '@/lib/formatDate'
import Link from 'next/link'
import mediumZoom from 'medium-zoom'
import React, { useEffect, useRef } from 'react'
import ArticleAround from './components/ArticleAround'
import Catalog from './components/Catalog'
import CategoryItem from './components/CategoryItem'
import TagItemMini from './components/TagItemMini'
import CONFIG_MEDIUM from './config_medium'

const mapPageUrl = id => {
  return 'https://www.notion.so/' + id.replace(/-/g, '')
}

export const LayoutSlug = props => {
  const { post, prev, next } = props
  const meta = {
    title: `${post.title} | ${BLOG.TITLE}`,
    description: post.summary,
    type: 'article',
    tags: post.tags
  }

  if (post?.blockMap?.block) {
    post.content = Object.keys(post.blockMap.block)
    post.toc = getPageTableOfContents(post, post.blockMap)
  }
  const { locale } = useGlobal()
  const date = formatDate(
    post?.date?.start_date || post.createdTime,
    locale.LOCALE
  )

  const zoom =
    typeof window !== 'undefined' &&
    mediumZoom({
      container: '.notion-viewport',
      background: 'rgba(0, 0, 0, 0.2)',
      margin: getMediumZoomMargin()
    })
  const zoomRef = useRef(zoom ? zoom.clone() : null)

  useEffect(() => {
    // 将所有container下的所有图片添加medium-zoom
    const container = document.getElementById('notion-article')
    const imgList = container?.getElementsByTagName('img')
    if (imgList && zoomRef.current) {
      for (let i = 0; i < imgList.length; i++) {
        zoomRef.current.attach(imgList[i])
      }
    }
  })

  const slotRight = post?.toc && post?.toc?.length > 3 && (
    <div key={locale.COMMON.TABLE_OF_CONTENTS} className="mt-6">
      <Catalog toc={post.toc} />
    </div>
  )

  return (
    <LayoutBase
      {...props}
      meta={meta}
      showInfoCard={true}
      slotRight={slotRight}
    >
      <h1 className="text-4xl pt-12 font-sans dark:text-gray-100">{post?.title}</h1>
      <section className="flex py-4 items-center font-sans px-1">
        <Link href="/about" passHref>
          <>
            <Image
              alt={BLOG.AUTHOR}
              width={25}
              height={25}
              loading="lazy"
              src="/avatar.jpg"
              className="rounded-full cursor-pointer"
            />
            <div className="mr-3 ml-1 text-green-500 cursor-pointer">
              {BLOG.AUTHOR}
            </div>
          </>
        </Link>
        <div className="text-gray-500">{date}</div>
        <div className="hidden busuanzi_container_page_pv text-gray-500 font-light mr-2">
          <i className="ml-3 mr-0.5 fas fa-eye" />
          &nbsp;
          <span className="mr-2 busuanzi_value_page_pv" />
        </div>
      </section>
      {/* Notion文章主体 */}
      <section id="notion-article" className="px-1 max-w-5xl">
        {post.blockMap && (
          <NotionRenderer
            recordMap={post.blockMap}
            mapPageUrl={mapPageUrl}
            components={{
              equation: Equation,
              code: Code,
              collectionRow: CollectionRow,
              collection: Collection
            }}
          />
        )}
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
        { CONFIG_MEDIUM.POST_DETAIL_CATEGORY && post.category && <CategoryItem category={post.category}/>}
        <div>
        { CONFIG_MEDIUM.POST_DETAIL_TAG && post?.tagItems?.map(tag => <TagItemMini key={tag.name} tag={tag} />)}
        </div>
        </div>
        <ArticleAround prev={prev} next={next} />
        <Comment frontMatter={post} />
      </section>
    </LayoutBase>
  )
}

function getMediumZoomMargin () {
  const width = window.innerWidth

  if (width < 500) {
    return 8
  } else if (width < 800) {
    return 20
  } else if (width < 1280) {
    return 30
  } else if (width < 1600) {
    return 40
  } else if (width < 1920) {
    return 48
  } else {
    return 72
  }
}
