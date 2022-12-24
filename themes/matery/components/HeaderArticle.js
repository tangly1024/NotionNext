export default function HeaderArticle({ post, siteInfo }) {
  if (!post) {
    return <></>
  }
  const headerImage = post?.page_cover ? `url("${post.page_cover}")` : `url("${siteInfo?.pageCover}")`
  return (
    <div
      id="header"
      className="w-full h-80 md:flex-shrink-0 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: headerImage }}
    >
         <div className="flex flex-col h-80 justify-center ">
             {/* 文章Title */}
             <div className="font-bold text-xl shadow-text flex justify-center text-center text-white dark:text-white ">
                {post.title}
            </div>
         </div>
    </div>
  )
}
