import BLOG from '@/blog.config'
import { useRouter } from 'next/router'
import React from 'react'
import ShareButtons from './ShareButtons'

const ShareBar = ({ post }) => {
  const router = useRouter()

  if (!JSON.parse(BLOG.POST_SHARE_BAR_ENABLE) || !post || post?.type !== 'Post') {
    return <></>
  }

  const shareUrl = BLOG.LINK + router.asPath

  return <div className='py-1 flex overflow-x-auto justify-end'>
        <ShareButtons shareUrl={shareUrl} title={post.title} image={post.pageCover} body={
            post.title +
            ' | ' +
            BLOG.TITLE +
            ' ' +
            shareUrl +
            ' ' +
            post.summary
        } />
    </div>
}
export default ShareBar
