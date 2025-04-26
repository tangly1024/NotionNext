import { siteConfig } from '@/lib/config'
import { getGlobalData } from '@/lib/db/getSiteData'

export default async function handler(req, res) {
  try {
    // Get data from Notion
    const from = 'debug-config'
    const data = await getGlobalData({ from })

    // Extract only the relevant configuration for debugging
    const config = {
      NOTION_CONFIG: data.NOTION_CONFIG || {},
      siteInfo: data.siteInfo || {},
      POST_URL_PREFIX: siteConfig('POST_URL_PREFIX', null, data.NOTION_CONFIG),
      POST_URL_PREFIX_MAPPING_CATEGORY: siteConfig(
        'POST_URL_PREFIX_MAPPING_CATEGORY',
        {},
        data.NOTION_CONFIG
      ),
      sampleCategoryMappings: {}
    }

    // Find a sample category post
    const categoryPosts = data.allPages
      ?.filter(
        page =>
          page.type === 'Post' && page.status === 'Published' && page.category
      )
      .slice(0, 5)

    // Create samples for each category found
    categoryPosts.forEach(post => {
      if (post.category) {
        const mappedCategory =
          config.POST_URL_PREFIX_MAPPING_CATEGORY[post.category] || null
        config.sampleCategoryMappings[post.category] = {
          originalCategory: post.category,
          mappedTo: mappedCategory,
          slug: post.slug,
          href: post.href
        }
      }
    })

    res.status(200).json({
      success: true,
      config
    })
  } catch (error) {
    console.error('Debug config error:', error)
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
