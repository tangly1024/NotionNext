import { siteConfig } from '@/lib/config'
import { RecentComments } from '@waline/client'
import SmartLink from '@/components/SmartLink'
import { useEffect, useState } from 'react'

/**
 * 最近评论列表
 * 基于Waline实现
 * @see https://waline.js.org/guide/get-started.html
 * @param {*} props
 * @returns
 */
const RecentCommentListForExample = props => {
  const [comments, updateComments] = useState([])
  const [onLoading, changeLoading] = useState(true)
  useEffect(() => {
    RecentComments({
      serverURL: siteConfig('COMMENT_WALINE_SERVER_URL'),
      count: 5
    }).then(({ comments }) => {
      changeLoading(false)
      updateComments(comments)
    })
  }, [])

  return (
    <>
      {onLoading && (
        <div>
          Loading...
          <i className='ml-2 fas fa-spinner animate-spin' />
        </div>
      )}
      {!onLoading && comments && comments.length === 0 && (
        <div>No Comments</div>
      )}
      {!onLoading &&
        comments &&
        comments.length > 0 &&
        comments.map(comment => (
          <div key={comment.objectId} className='pb-2'>
            <div
              className='dark:text-gray-300 text-gray-600 text-xs waline-recent-content wl-content'
              dangerouslySetInnerHTML={{ __html: comment.comment }}
            />
            <div className='dark:text-gray-400 text-gray-400  text-sm text-right cursor-pointer hover:text-red-500 hover:underline pt-1'>
              <SmartLink
                href={{
                  pathname: comment.url,
                  hash: comment.objectId,
                  query: { target: 'comment' }
                }}>
                --{comment.nick}
              </SmartLink>
            </div>
          </div>
        ))}
    </>
  )
}

export default RecentCommentListForExample
