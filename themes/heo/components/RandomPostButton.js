import { useRouter } from 'next/router'

/**
 * 随机跳转到一个文章
 */
export default function RandomPostButton(props) {
  const { latestPosts } = props
  const router = useRouter()
  function handleClick() {
    const randomIndex = Math.floor(Math.random() * latestPosts.length)
    const randomPost = latestPosts[randomIndex]
    router.push(randomPost.slug)
  }
  return (
        <div title={'随机前往一篇文章'} className='cursor-pointer hover:bg-black hover:bg-opacity-10 rounded-full w-10 h-10 flex justify-center items-center duration-200 transition-all' onClick={handleClick}>
            <i className="fa-solid fa-podcast"></i>
        </div>
  )
}
