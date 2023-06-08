import React from 'react'
import BlogPost from './components/BlogPost'
import Tags from './components/Tags'
import LayoutBase from './LayoutBase'

export const LayoutTag = props => {
  const { currentTag } = props
  const [searchValue, setSearchValue] = React.useState('')
  let filteredBlogPosts = []
  const { posts } = props

  if (posts) {
    filteredBlogPosts = posts.filter(post => {
      const tagContent = post.tags ? post.tags.join(' ') : ''
      const searchContent = post.title + post.summary + tagContent
      return searchContent.toLowerCase().includes(searchValue.toLowerCase())
    })
  }

  return <LayoutBase {...props}>

    <div className="relative">
        <input
          type="text"
          placeholder={
            currentTag ? `Search in #${currentTag}` : 'Search Articles'
          }
          className="outline-none block w-full border px-4 py-2 border-black bg-white text-black dark:bg-night dark:border-white dark:text-white"
          onChange={e => setSearchValue(e.target.value)}
        />
        <svg
          className="absolute right-3 top-3 h-5 w-5 text-black dark:text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
      </div>
      <Tags {...props}/>

      <div className="article-container my-8">
        {!filteredBlogPosts.length && (
          <p className="text-gray-500 dark:text-gray-300">No posts found.</p>
        )}
        {filteredBlogPosts.slice(0, 20).map(post => (
          <BlogPost key={post.id} post={post} />
        ))}
      </div>
    </LayoutBase >
}

export default LayoutTag
