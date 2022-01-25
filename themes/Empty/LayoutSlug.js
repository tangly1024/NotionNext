import BLOG from '@/blog.config'
import { getPageTableOfContents } from 'notion-utils'
import 'prismjs'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-typescript'
import { Code, Collection, CollectionRow, Equation, NotionRenderer } from 'react-notion-x'
import LayoutBase from './LayoutBase'

const mapPageUrl = id => {
  return 'https://www.notion.so/' + id.replace(/-/g, '')
}

export const LayoutSlug = (props) => {
  const { post } = props
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

  return <LayoutBase {...props} meta={meta}>
    <h1>Slug - {post?.title}</h1>
    <p>
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
      </p>

  </LayoutBase>
}
