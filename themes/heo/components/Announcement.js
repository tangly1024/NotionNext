import dynamic from 'next/dynamic'

const NotionPage = dynamic(() => import('@/components/NotionPage'))

const Announcement = ({ post, className, allNavPages, uuidSlugMap }) => {
  if (post?.blockMap) {
    return (
      <div>
        {post && (
          <div id='announcement-content'>
            <NotionPage
              post={post}
              allNavPages={allNavPages}
              uuidSlugMap={uuidSlugMap}
            />
          </div>
        )}
      </div>
    )
  } else {
    return <></>
  }
}
export default Announcement
