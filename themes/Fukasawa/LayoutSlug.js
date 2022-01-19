import BLOG from '@/blog.config'
import 'prismjs'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-typescript'
import ArticleDetail from './components/ArticleDetail'
import LayoutBase from './LayoutBase'

export const LayoutSlug = (props) => {
  const { post } = props
  const meta = {
    title: `${post.title} | ${BLOG.TITLE}`,
    description: post.summary,
    type: 'article',
    tags: post.tags
  }

  return (
    <LayoutBase meta={meta} {...props} >
      <ArticleDetail {...props} />
    </LayoutBase>
  )
}
