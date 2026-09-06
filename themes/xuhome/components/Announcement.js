import dynamic from 'next/dynamic'

const NotionPage = dynamic(() => import('@/components/NotionPage'))

export default function Announcement({ post }) {
  if (!post || Object.keys(post).length === 0) return null

  return (
    <div className='border-2 border-[#0284c7] rounded-sm shadow-[3px_3px_0px_0px_#0284c7] bg-[#ffffff] dark:bg-slate-800 p-4'>
      <div className='font-black text-xs text-[#0284c7] uppercase tracking-wider mb-3 pb-2 border-b-2 border-[#fde68a]'>
        {'\uD83D\uDCE2'} {post?.title || 'Announcement'}
      </div>
      <div id='announcement-content' className='text-sm leading-relaxed'>
        <NotionPage post={post} />
      </div>
    </div>
  )
}
