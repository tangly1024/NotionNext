import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import { SearchLayout } from '@/themes'

export async function getStaticProps () {
  const {
    allPosts,
    categories,
    tags,
    postCount,
    latestPosts
  } = await getGlobalNotionData({ from: 'search-props' })
  return {
    props: {
      posts: allPosts,
      tags,
      categories,
      postCount,
      latestPosts
    },
    revalidate: 1
  }
}

const Search = (props) => {
  return <SearchLayout {...props} />
}

export default Search
