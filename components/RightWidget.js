import React from 'react'
import TopJumper from '@/components/TopJumper'
import ShareButton from '@/components/ShareButton'

const RightWidget = ({ post }) => {
  return <div className='flex-wrap'>
    <ShareButton post={post} />
    <TopJumper />
  </div>
}
export default RightWidget
