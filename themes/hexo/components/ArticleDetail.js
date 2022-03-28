import Comment from '@/components/Comment'
import mediumZoom from 'medium-zoom'
import 'prismjs'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-typescript'
import { useEffect, useRef } from 'react'
import { Code, Collection, CollectionRow, Equation, NotionRenderer } from 'react-notion-x'
import ArticleAdjacent from './ArticleAdjacent'
import ArticleCopyright from './ArticleCopyright'
import ArticleRecommend from './ArticleRecommend'

/**
 *
 * @param {*} param0
 * @returns
 */
export default function ArticleDetail (props) {
  const { post } = props
  const zoom = typeof window !== 'undefined' && mediumZoom({
    container: '.notion-viewport',
    background: 'rgba(0, 0, 0, 0.2)',
    margin: getMediumZoomMargin()
  })
  const zoomRef = useRef(zoom ? zoom.clone() : null)

  useEffect(() => {
    // 将所有container下的所有图片添加medium-zoom
    const container = document?.getElementById('container')
    const imgList = container?.getElementsByTagName('img')
    if (imgList && zoomRef.current) {
      for (let i = 0; i < imgList.length; i++) {
        (zoomRef.current).attach(imgList[i])
      }
    }
  })

  return (<div id="container" className="max-w-5xl overflow-x-auto flex-grow mx-auto md:w-full md:px-5 ">
    <article itemScope itemType="https://schema.org/Movie" className="subpixel-antialiased" >

      {/* Notion文章主体 */}
      <section id='notion-article' className='px-5'>
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

      <ArticleCopyright {...props}/>
      <ArticleRecommend {...props}/>
      <ArticleAdjacent {...props}/>

    </article>

    <hr className='border-dashed'/>

    {/* 评论互动 */}
    <div className="duration-200 overflow-x-auto bg-white dark:bg-hexo-black-gray px-3">
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
