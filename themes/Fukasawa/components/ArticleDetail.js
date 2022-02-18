import Comment from '@/components/Comment'
import formatDate from '@/lib/formatDate'
import { useGlobal } from '@/lib/global'
import mediumZoom from 'medium-zoom'
import Link from 'next/link'
import 'prismjs'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-typescript'
import { useEffect, useRef } from 'react'
import { Code, Collection, CollectionRow, Equation, NotionRenderer } from 'react-notion-x'
import ArticleAround from './ArticleAround'

/**
 *
 * @param {*} param0
 * @returns
 */
export default function ArticleDetail ({ post, recommendPosts, prev, next }) {
  const { locale } = useGlobal()
  const date = formatDate(post?.date?.start_date || post.createdTime, locale.LOCALE)

  const zoom = typeof window !== 'undefined' && mediumZoom({
    container: '.notion-viewport',
    background: 'rgba(0, 0, 0, 0.2)',
    margin: getMediumZoomMargin()
  })
  const zoomRef = useRef(zoom ? zoom.clone() : null)

  useEffect(() => {
    // 将所有container下的所有图片添加medium-zoom
    const container = document.getElementById('container')
    const imgList = container.getElementsByTagName('img')
    if (imgList && zoomRef.current) {
      for (let i = 0; i < imgList.length; i++) {
        (zoomRef.current).attach(imgList[i])
      }
    }
  })

  return (<div id="container" className="max-w-5xl overflow-x-auto flex-grow mx-auto w-screen md:w-full ">
    {post.type && !post.type.includes('Page') && post?.page_cover && (
    <div className="w-full relative md:flex-shrink-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt={post.title} src={post?.page_cover} className='object-center w-full' />
    </div>
    )}
    <article itemScope itemType="https://schema.org/Movie"
      className="subpixel-antialiased py-10 px-5 lg:pt-24 md:px-32  dark:border-gray-700 bg-white dark:bg-gray-800"
    >

      <header className='animate__slideInDown animate__animated'>

          {/* 文章Title */}
          <div className="font-bold text-3xl text-black dark:text-white font-serif pt-10">
            {post.title}
          </div>

          <section className="flex-wrap flex mt-2 text-gray-400 dark:text-gray-400 font-light leading-8">
            <div>
              <Link href={`/category/${post.category}`} passHref>
                <a className="cursor-pointer text-md mr-2 hover:text-black dark:hover:text-white border-b dark:border-gray-500 border-dashed">
                  <i className="mr-1 fas fa-folder-open" />
                  {post.category}
                </a>
              </Link>
              <span className='mr-2'>|</span>

              {post.type[0] !== 'Page' && (<>
                <Link
                  href={`/archive#${post?.date?.start_date?.substr(0, 7)}`}
                  passHref
                >
                  <a className="pl-1 mr-2 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 border-b dark:border-gray-500 border-dashed">
                    {date}
                  </a>
                </Link>
                <span className='mr-2'>|</span>
              </>)}

              <div className="hidden busuanzi_container_page_pv font-light mr-2">
                <i className='mr-1 fas fa-eye'/>
                &nbsp;
                <span className="mr-2 busuanzi_value_page_pv"/>
                <span className='mr-2'>|</span>
              </div>
            </div>

          </section>

      </header>

      {/* Notion文章主体 */}
      <section id='notion-article' className='px-1'>
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
        <ins className="adsbygoogle"
          style={{ display: 'block', textAlign: 'center' }}
          data-adtest="on"
          data-ad-layout="in-article"
          data-ad-format="fluid"
          data-ad-client="ca-pub-2708419466378217"
          data-ad-slot="3806269138"/>
      </section>

    </article>

    <ArticleAround prev={prev} next={next}/>

    {/* 评论互动 */}
    <div className="duration-200 shadow px-12 w-screen md:w-full overflow-x-auto dark:border-gray-700 bg-white dark:bg-gray-800">
       <Comment frontMatter={post} />
    </div>
  </div>)
}

const mapPageUrl = id => {
  return 'https://www.notion.so/' + id.replace(/-/g, '')
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
