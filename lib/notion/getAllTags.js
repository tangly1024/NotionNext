import { getAllPosts } from './getAllPosts'

export async function getAllTags (posts) {
  if (!posts) {
    const response = await getAllPosts()
    posts = response.filter(
      post =>
        post.status[0] === 'Published' && post.type[0] === 'Post' && post.tags
    )
  }

  let tags = posts.map(p => p.tags)
  tags = [...tags.flat()]
  const tagObj = {}
  tags.forEach(tag => {
    if (tag in tagObj) {
      tagObj[tag]++
    } else {
      tagObj[tag] = 1
    }
  })
  return tagObj
}
