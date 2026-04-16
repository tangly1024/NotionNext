import dynamic from 'next/dynamic'
import CONFIG from './config'

export const LayoutBase = dynamic(() => import('./layouts/LayoutBase'), {
  ssr: true
})

export const LayoutIndex = dynamic(() => import('./layouts/LayoutIndex'), {
  ssr: true
})

export const LayoutPostList = dynamic(
  () => import('./layouts/LayoutPostList'),
  { ssr: true }
)

export const LayoutSearch = dynamic(() => import('./layouts/LayoutSearch'), {
  ssr: true
})

export const LayoutArchive = dynamic(() => import('./layouts/LayoutArchive'), {
  ssr: true
})

export const LayoutSlug = dynamic(() => import('./layouts/LayoutSlug'), {
  ssr: true
})

export const Layout404 = dynamic(() => import('./layouts/Layout404'), {
  ssr: true
})

export const LayoutCategoryIndex = dynamic(
  () => import('./layouts/LayoutCategoryIndex'),
  { ssr: true }
)

export const LayoutTagIndex = dynamic(
  () => import('./layouts/LayoutTagIndex'),
  { ssr: true }
)

export { CONFIG as THEME_CONFIG }
