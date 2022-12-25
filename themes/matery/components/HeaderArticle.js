export default function HeaderArticle({ post, siteInfo }) {
  const headerImage = post?.page_cover ? `url("${post?.page_cover}")` : `url("${siteInfo?.pageCover}")`
  const title = post?.title
  return (
    <div
      id="header"
      className="w-full h-80 md:flex-shrink-0 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: headerImage }}
    >
         <div className="flex flex-col h-80 justify-center ">
             <div className="font-bold text-xl shadow-text flex justify-center text-center text-white dark:text-white ">
                {title}
            </div>
         </div>
    </div>
  )
}
