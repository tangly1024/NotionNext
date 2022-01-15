import dynamic from 'next/dynamic'

export const IndexLayout = dynamic(() => import('./NEXT/IndexLayout'), { ssr: false })
export const SearchLayout = dynamic(() => import('./NEXT/SearchLayout'), { ssr: false })
export const ArchiveLayout = dynamic(() => import('./NEXT/ArchiveLayout'), { ssr: false })
export const ArticleLayout = dynamic(() => import('./NEXT/ArticleLayout'), { ssr: false })
export const Custom404Layout = dynamic(() => import('./NEXT/Custom404Layout'), { ssr: false })
export const CategoryLayout = dynamic(() => import('./NEXT/CategoryLayout'), { ssr: false })
export const CategoryIndexLayout = dynamic(() => import('./NEXT/CategoryIndexLayout'), { ssr: false })
export const PageLayout = dynamic(() => import('./NEXT/PageLayout'), { ssr: false })
export const TagLayout = dynamic(() => import('./NEXT/TagLayout'), { ssr: false })
export const TagIndexLayout = dynamic(() => import('./NEXT/TagIndexLayout'), { ssr: false })
