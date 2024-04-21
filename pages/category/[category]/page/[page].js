import { getGlobalData } from '@/lib/notion/getNotionData'
import React from 'react'
import BLOG from '@/blog.config'
import { useRouter } from 'next/router'
import { getLayoutByTheme } from '@/themes/theme'
import { siteConfig } from '@/lib/config'

/**
 *  Category page
 * @param {*} props
 * @returns
 */
export default function Category(props) {
  // use different Layout file based on the path
  const Layout = getLayoutByTheme({ theme: siteConfig('THEME'), router: useRouter() })

  return <Layout {...props} />
}

export async function getStaticProps({ params: { category, page } }) {
  const from = 'category-page-props'
  let props = await getGlobalData({ from })

  // make sure the page is a number
  props.posts = props.allPages?.filter(page => page.type === 'Post' && page.status === 'Published').filter(post => post && post.category && post.category.includes(category))
  // handle category posts count
  props.postCount = props.posts.length
  // handle pagination
  props.posts = props.posts.slice(BLOG.POSTS_PER_PAGE * (page - 1), BLOG.POSTS_PER_PAGE * page)

  delete props.allPages
  props.page = page

  props = { ...props, category, page }

  return {
    props,
    revalidate: parseInt(BLOG.NEXT_REVALIDATE_SECOND)
  }
}

export async function getStaticPaths() {
  const from = 'category-paths'
  const { categoryOptions, allPages } = await getGlobalData({ from })
  const paths = []

  categoryOptions?.forEach(category => {
    // handle category posts
    const categoryPosts = allPages?.filter(page => page.type === 'Post' && page.status === 'Published').filter(post => post && post.category && post.category.includes(category.name))
    // handle pagination
    const postCount = categoryPosts.length
    const totalPages = Math.ceil(postCount / BLOG.POSTS_PER_PAGE)
    if (totalPages > 1) {
      for (let i = 1; i <= totalPages; i++) {
        paths.push({ params: { category: category.name, page: '' + i } })
      }
    }
  })

  return {
    paths,
    fallback: true
  }
}
