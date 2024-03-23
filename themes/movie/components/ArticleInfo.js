export default function ArticleInfo({ post }) {
  if (!post) {
    return null
  }
  return <div className="pt-10 pb-6 text-gray-400 text-sm border-b">
        <i className="fa-regular fa-clock mr-1" />
        Last update:  { post.date?.start_date}
    </div>
}
