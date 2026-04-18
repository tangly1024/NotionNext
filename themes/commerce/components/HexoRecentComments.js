import { useEffect, useState } from 'react'
import { siteConfig } from '@/lib/config'
import Card from '@/themes/hexo/components/Card'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import { RecentComments } from '@waline/client'

/**
 * @see https://waline.js.org/guide/get-started.html
 * @param {*} props
 * @returns
 */
const HexoRecentComments = (props) => {
  const [comments, updateComments] = useState([])
  const { locale } = useGlobal()
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
        <Card >
            <div className=" mb-2 px-1 justify-between">
                <i className="mr-2 fas fas fa-comment" />
                {locale.COMMON.RECENT_COMMENTS}
            </div>

            {onLoading && <div>Loading...<i className='ml-2 fas fa-spinner animate-spin' /></div>}
            {!onLoading && comments && comments.length === 0 && <div>No Comments</div>}
            {!onLoading && comments && comments.length > 0 && comments.map((comment) => <div key={comment.objectId} className='pb-2 pl-1'>
                <div className='dark:text-gray-200 text-sm waline-recent-content wl-content' dangerouslySetInnerHTML={{ __html: comment.comment }} />
                <div className='dark:text-gray-400 text-gray-400  text-sm text-right cursor-pointer hover:text-red-500 hover:underline pt-1 pr-2'>
                    <SmartLink href={{ pathname: comment.url, hash: comment.objectId, query: { target: 'comment' } }}>--{comment.nick}</SmartLink>
                </div>
            </div>)}

        </Card>
  )
}

export default HexoRecentComments
