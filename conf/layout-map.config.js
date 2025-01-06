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
