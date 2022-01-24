import 'prismjs'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-typescript'
import { Code, Collection, CollectionRow, Equation, NotionRenderer } from 'react-notion-x'

const mapPageUrl = id => {
  return 'https://www.notion.so/' + id.replace(/-/g, '')
}

export const LayoutSlug = (props) => {
  const { post } = props
  return <div>
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

  </div>
}
