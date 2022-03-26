import BLOG from '@/blog.config'
import { getPageTableOfContents } from 'notion-utils'
import 'prismjs'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-typescript'
import ArticleDetail from './components/ArticleDetail'
import LayoutBase from './LayoutBase'
import { ArticleLock } from './components/ArticleLock'

export const LayoutSlug = (props) => {
  const { post, lock, validPassword } = props
  const meta = {
    title: `${post.title} | ${BLOG.TITLE}`,
    description: post.summary,
    type: 'article',
    tags: post.tags
  }

  if (!lock && post?.blockMap?.block) {
    post.content = Object.keys(post.blockMap.block)
    post.toc = getPageTableOfContents(post, post.blockMap)
  }

  return (
    <LayoutBase meta={meta} {...props} >
        {!lock && <ArticleDetail {...props} />}
        {lock && <ArticleLock password={post.password} validPassword={validPassword} />}
      </LayoutBase>
  )
}
