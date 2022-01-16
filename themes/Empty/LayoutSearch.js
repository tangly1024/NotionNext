import { useRouter } from 'next/router'

export const LayoutSearch = ({
  posts,
  tags,
  categories,
  postCount
}) => {
  let filteredPosts
  const searchKey = getSearchKey()
  if (searchKey) {
    filteredPosts = posts.filter(post => {
      const tagContent = post.tags ? post.tags.join(' ') : ''
      const searchContent = post.title + post.summary + tagContent
      return searchContent.toLowerCase().includes(searchKey.toLowerCase())
    })
  } else {
    filteredPosts = posts
  }

  console.log(filteredPosts)

  return <div>
    Search {searchKey}
  </div>
}

function getSearchKey () {
  const router = useRouter()
  if (router.query && router.query.s) {
    return router.query.s
  }
  return null
}
