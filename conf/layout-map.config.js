import { SpeedInsights } from "@vercel/speed-insights/next" //2024年2月9日 加入Vercel的Speed Insights，用于优化网站加载速度
import { Analytics } from "@vercel/analytics/react" //2024年2月9日 加入Vercel的Analytics，用于统计网站访问数据



/**
 * 路径和组件映射，不同路径分别展示主题的什么组件
 * 可在添加新的路径和对应主题下的布局名称
 *  */
module.exports = {
  //
  LAYOUT_MAPPINGS: {
    '-1': 'LayoutBase',
    '/': 'LayoutIndex',
    '/archive': 'LayoutArchive',
    '/page/[page]': 'LayoutPostList',
    '/category/[category]': 'LayoutPostList',
    '/category/[category]/page/[page]': 'LayoutPostList',
    '/tag/[tag]': 'LayoutPostList',
    '/tag/[tag]/page/[page]': 'LayoutPostList',
    '/search': 'LayoutSearch',
    '/search/[keyword]': 'LayoutSearch',
    '/search/[keyword]/page/[page]': 'LayoutSearch',
    '/404': 'Layout404',
    '/tag': 'LayoutTagIndex',
    '/category': 'LayoutCategoryIndex',
    '/[prefix]': 'LayoutSlug',
    '/[prefix]/[slug]': 'LayoutSlug',
    '/[prefix]/[slug]/[...suffix]': 'LayoutSlug',
    '/auth/result': 'LayoutAuth',
    '/sign-in/[[...index]]': 'LayoutSignIn',
    '/sign-up/[[...index]]': 'LayoutSignUp',
    '/dashboard/[[...index]]': 'LayoutDashboard'
  }
}
