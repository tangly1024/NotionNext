import React from 'react'
import TopJumper from '@/components/TopJumper'
import ShareButton from '@/components/ShareButton'

const RightWidget = ({ post }) => {
  return <div className='fixed right-0 lg:mr-72 bottom-10 flex justify-center'>
<div className='flex-wrap'>
  <ShareButton post={post}/>
  <TopJumper/>
</div>
  </div>
}
export default RightWidget
