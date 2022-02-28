import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import { LayoutSearch } from '@/themes'

export async function getStaticProps () {
  const {
    allPosts,
    categories,
    tags,
    postCount,
    latestPosts,
    customNav
  } = await getGlobalNotionData({ from: 'search-props', pageType: ['Post'] })
  return {
    props: {
      posts: allPosts,
      tags,
      categories,
      postCount,
      latestPosts,
      customNav
    },
    revalidate: 1
  }
}

const Search = (props) => {
  return <LayoutSearch {...props} />
}

export default Search
