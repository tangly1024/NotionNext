import BLOG from '@/blog.config'
import { DiscussionEmbed } from 'disqus-react'

export default ({ url, id, title }) => (
  <DiscussionEmbed
    shortname={BLOG.COMMENT_DISQUS_SHORTNAME}
    config={{
      url: url,
      identifier: id,
      title: title,
      language: BLOG.LANG
    }}
  />
)
