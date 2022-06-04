import React from 'react'
import { RecentComments } from '@waline/client'
import BLOG from '@/blog.config'
import Card from '@/themes/hexo/components/Card'
import { useGlobal } from '@/lib/global'
import Link from 'next/link'

/**
 * @see https://waline.js.org/guide/get-started.html
 * @param {*} props
 * @returns
 */
const HexoRecentComments = (props) => {
  const [comments, updateComments] = React.useState([])
  const { locale } = useGlobal()
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

  return <Card >
        <div className="font-sans mb-2 px-1 justify-between">
            <i className="mr-2 fas fas fa-comment" />
            {locale.COMMON.RECENT_COMMENTS}
        </div>

        {onLoading && <div>Loading...<i className='ml-2 fas fa-spinner animate-spin' /></div>}
        {!onLoading && comments && comments.length === 0 && <div>No Comments</div>}
        {!onLoading && comments && comments.length > 0 && comments.map((comment) => <div key={comment.objectId} className='pb-2 pl-1'>
            <div className='dark:text-gray-200 text-sm waline-recent-content wl-content' dangerouslySetInnerHTML={{ __html: comment.comment }} />
            <div className='dark:text-gray-400 text-gray-400 font-sans text-sm text-right cursor-pointer hover:text-red-500 hover:underline pt-1 pr-2'><Link href={{ pathname: comment.url, hash: comment.objectId, query: { target: 'comment' } }}><a >-- {comment.nick}</a></Link></div>
        </div>)}

  </Card>
}

export default HexoRecentComments
