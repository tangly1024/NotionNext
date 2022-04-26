import BLOG from '@/blog.config'
import { useState, useCallback, useEffect } from 'react'
import { DiscussionEmbed } from 'disqus-react'

const Disqus = ({ url, id, title }) => {
  const [afterTransition, forceUpdate] = useState(false)
  const transitionEnd = useCallback(ev => {
    const { propertyName } = ev
    if (propertyName === 'color') {
      forceUpdate(o => !o)
    }
  }, [])

  useEffect(() => {
    document
      .getElementById('comment')
      .addEventListener('transitionend', transitionEnd)
    return () =>
      document
        .getElementById('comment')
        .removeEventListener('transitionend', transitionEnd)
  }, [transitionEnd])
  return (
    <DiscussionEmbed
      shortname={BLOG.COMMENT_DISQUS_SHORTNAME}
      config={{
        url: url,
        identifier: id,
        title: title,
        language: BLOG.LANG
      }}
      updateDarkMode={afterTransition}
    />
  )
}
export default Disqus
