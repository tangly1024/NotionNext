import BLOG from '@/blog.config'
import { DiscussionEmbed } from 'disqus-react'

export const Disqus = ({ url, id, title }) => {
  return (
    <DiscussionEmbed
      shortname={BLOG.COMMENT_DISQUS_SHORTNAME}
      config={{
        url: url,
        identifier: id,
        title: title,
        language: BLOG.LANG.replace('-', '_') //e.g. for Traditional Chinese (Taiwan)
      }}
    />
  )
}
