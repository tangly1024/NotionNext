import BLOG from "@/blog.config"
import { isDev } from "./config"

export function getSocialImageUrl({
  title,
  image,
  imageObjectPosition,
  author,
  authorImage,
  detail
}: {
  title: string
  image?: string
  imageObjectPosition?: string
  author?: string
  authorImage?: string
  detail?: string
}) {

  const url = new URL('/api/social-image', isDev ?'http://localhost:3000' : BLOG.LINK)

  if (title) {
    url.searchParams.set('title', title)
  }

  if (image) {
    url.searchParams.set('image', image)
  }

  if (imageObjectPosition) {
    url.searchParams.set('imageObjectPosition', imageObjectPosition)
  }

  if (author) {
    url.searchParams.set('author', author)
  }

  if (authorImage) {
    url.searchParams.set('authorImage', authorImage)
  }

  if (detail) {
    url.searchParams.set('detail', detail)
  }

  return url.toString()
}
