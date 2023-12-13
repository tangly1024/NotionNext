import React from 'react'
import BLOG from '@/blog.config'
import Link from 'next/link'
import { RecentComments } from '@waline/client'

/**
 * @see https://waline.js.org/guide/get-started.html
 * @param {*} props
 * @returns
 */
const NextRecentComments = (props) => {
  const [comments, updateComments] = React.useState([])
  const [onLoading, changeLoading] = React.useState(true)
  React.useEffect(() => {
    RecentComments({
      serverURL: BLOG.COMMENT_WALINE_SERVER_URL,
      count: 5
    }).then(({ comments }) => {
      changeLoading(false)
      updateComments(comments)
    })
  }, [])

  return <>
        {onLoading && <div>Loading...<i className='ml-2 fas fa-spinner animate-spin' /></div>}
        {!onLoading && comments && comments.length === 0 && <div>No Comments</div>}
        {!onLoading && comments && comments.length > 0 && comments.map((comment) => <div key={comment.objectId} className='pb-2'>
            <div className='dark:text-gray-300 text-gray-600 text-xs waline-recent-content wl-content' dangerouslySetInnerHTML={{ __html: comment.comment }} />
            <div className='dark:text-gray-400 text-gray-400 font-sans text-sm text-right cursor-pointer hover:text-red-500 hover:underline pt-1'><Link href={{ pathname: comment.url, hash: comment.objectId, query: { target: 'comment' } } }>--{comment.nick}</Link></div>
        </div>)}

  </>
}

export default NextRecentComments
