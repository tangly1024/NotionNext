import { getGlobalData } from '@/lib/notion/getNotionData'
import { useEffect } from 'react'
import BLOG from '@/blog.config'
import { useRouter } from 'next/router'
import { getLayoutByTheme } from '@/themes/theme'
import { isBrowser } from '@/lib/utils'
import { formatDateFmt } from '@/lib/formatDate'
import { siteConfig } from '@/lib/config'

const ArchiveIndex = props => {
  const router = useRouter();
  const path = router.asPath;
  const isArchive = path === '/archive';
  const Layout = isArchive ? getLayoutByTheme({ theme: siteConfig('THEME'), router }) : getLayoutByTheme({ theme: siteConfig('THEME') });

  useEffect(() => {
    if (isBrowser) {
      const anchor = window.location.hash
      if (anchor) {
        setTimeout(() => {
          const anchorElement = document.getElementById(anchor.substring(1))
          if (anchorElement) {
            anchorElement.scrollIntoView({ block: 'start', behavior: 'smooth' })
          }
        }, 300)
      }
    }
  }, [])

  return <Layout {...props} />
}

/**
 * Retrieves the static props for the archive page.
 * @returns {Promise<Object>} The static props object.
 */
/**
 * Retrieves the static props for the archive page.
 * @returns {Promise<Object>} The static props object.
 */
export async function getStaticProps() {
  const props = await getGlobalData({ from: 'archive-index' })
  props.posts = props.allPages?.filter(page => page.type === 'Post' && page.status === 'Published')
  delete props.allPages

  const postsSortByDate = Object.create(props.posts)

  postsSortByDate.sort((a, b) => {
    return b?.publishDate - a?.publishDate
  })

  const archivePosts = {}

  postsSortByDate.forEach(post => {
    const date = formatDateFmt(post.publishDate, 'yyyy-MM')
    if (archivePosts[date]) {
      archivePosts[date].push(post)
    } else {
      archivePosts[date] = [post]
    }
  })

  props.archivePosts = archivePosts
  delete props.allPages

  return {
    props,
    revalidate: parseInt(BLOG.NEXT_REVALIDATE_SECOND)
  }
}

export default ArchiveIndex
