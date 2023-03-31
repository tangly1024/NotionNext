import BLOG from '@/blog.config'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

/**
 * 评论插件
 * @param issueTerm
 * @param layout
 * @returns {JSX.Element}
 * @constructor
 */
const WebmentionCount = ({ target }) => {
  const initialCounts = {
    count: 0,
    type: {
      like: 0,
      mention: 0,
      reply: 0,
      repost: 0
    }
  }
  const [counts, setCounts] = useState(initialCounts)
  const fetchCounts = async (target) => {
    const responseData = await fetch(`https://webmention.io/api/count.json?target=${target}`)
    console.log('!!!', responseData)
    return (responseData.json) ? await responseData.json() : responseData
  }
  useEffect(() => {
    async function getCounts() {
      const responseCounts = await fetchCounts(target)
      console.log('rere', responseCounts)
      setCounts(responseCounts)
    }
    getCounts()
  }, [target])

  return (
    <div className='webmention-counts'>
      {counts
        ? (
          <div className='counts'>
            <span>
              <span className='count'>{counts.type.like || 0}</span>Likes
            </span>
            <span>
              <span className='count'>{counts.type.reply || 0}</span>Replies
            </span>
            <span>
              <span className='count'>
                {(counts.type.repost || 0) + (counts.type.mention || 0)}
              </span>
              Mentions
            </span>
          </div>
          )
        : (
            <p>Failed to fetch Webmention counts</p>
          )
      }
    </div>
  )
}

const Avatar = ({ author }) => (
  <a className='avattar-wrapper' href={author.url} key={author.name}>
    <Image
      className="avatar"
      src={author.photo}
      alt={author.name}
      fill
      sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
    />
  </a>
)

const WebmentionReplies = ({ target }) => {
  const [mentions, setMentions] = useState([])
  const fetchMentions = async (target) =>
    fetch(
      `https://webmention.io/api/mentions.jf2?per-page=500&target=${target}`
    ).then((response) => (response.json ? response.json() : response))
  useEffect(() => {
    async function getMentions() {
      const responseMentions = await fetchMentions(target)
      if (responseMentions.children) {
        setMentions(responseMentions.children)
      }
    }

    getMentions()
  }, [target])

  const distinctMentions = [
    ...new Map(mentions.map((item) => [item.author.url, item])).values()
  ].sort((a, b) => new Date(a['wm-received']) - new Date(b['wm-received']))

  const replies = distinctMentions.filter(
    (mention) => 'in-reply-to' in mention && 'content' in mention
  )

  return (
    <div>
      <p>
        {distinctMentions.length > 0
          ? `Already ${distinctMentions.length} people liked, shared or talked about this article:`
          : 'Be the first one to share this article!'}
      </p>
      <div className='webmention-avatars'>
        {distinctMentions.map((reply) => (
          <Avatar key={reply.author.name} author={reply.author} />
        ))}
      </div>
      {replies && replies.length
        ? (
          <div className='webmention-replies'>
            <h4>Replies</h4>
            <ul className='replies'>
              {replies.map((reply) => (
                <li className='reply' key={reply.content.text}>
                  <div>
                    <Avatar key={reply.author.name} author={reply.author} />
                  </div>
                  <div className='text'>
                    <p className='reply-author-name'>{reply.author.name}</p>
                    <p className='reply-content'>{reply.content.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          )
        : null}
    </div>
  )
}

const WebMentionBlock = ({ frontMatter }) => {
  const router = useRouter()
  const url = `https://${BLOG.COMMENT_WEBMENTION.HOSTNAME}/${router.asPath}`
  const tweet = `${frontMatter.title} by @siygle ${url}`

  return (
    <div className='post-footer'>
      <div className='post-footer-intro'>
        This post is using{' '}
        <a target="_blank" rel='noreferrer' href="https://webmention.io">
          WebMention.io
        </a>{' '}
        as the comment system.{' '}
        <a
          target="_blank"
          id='tweet-post-url'
          href={`https://twitter.com/intent/tweet?text=${encodeURI(tweet)}`}
          rel="noopener noreferrer"
        >Tweet this post</a>
        , the comments will show up here.
      </div>
      <div className='webmention-info'>
        <WebmentionCount target={url} />
        <WebmentionReplies target={url} />
      </div>
    </div>
  )
}

export default WebMentionBlock
