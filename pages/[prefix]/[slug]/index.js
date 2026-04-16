import BLOG from '@/blog.config'
import { ISR_CONTENT_REVALIDATE, buildStaticPropsResult } from '@/lib/cache/revalidate'
import { getGlobalData, getPost } from '@/lib/db/getSiteData'
import { processPostData } from '@/lib/utils/post'
import Slug from '..'

const LOCALE_PREFIX_REGEX = /^\/[a-z]{2}(?:-[A-Za-z]{2})?(?=\/|$)/i

const normalizeSlugValue = value =>
  typeof value === 'string'
    ? value.replace(/^\/+|\/+$/g, '').toLowerCase()
    : ''

const normalizePageId = value =>
  typeof value === 'string' ? value.replace(/-/g, '').trim().toLowerCase() : ''

const getCanonicalDestination = (locale, slug) => {
  const normalizedSlug = `/${slug.replace(/^\/+/, '')}`
  const localePrefix =
    locale && locale !== 'zh-CN' && !LOCALE_PREFIX_REGEX.test(normalizedSlug)
      ? `/${locale}`
      : ''

  return `${localePrefix}${normalizedSlug}`
}

const getCurrentRoutePath = (locale, slug) => {
  const normalizedSlug = `/${slug.replace(/^\/+/, '')}`
  return locale && locale !== 'zh-CN' ? `/${locale}${normalizedSlug}` : normalizedSlug
}

const getLocalized404Path = locale =>
  locale && locale !== 'zh-CN' ? `/${locale}/404` : '/404'

const getDefaultLocaleRedirect = ({ fullSlug, slug, locale }) => {
  if (!locale || locale === 'zh-CN') {
    return null
  }

  const normalizedFullSlug = normalizeSlugValue(fullSlug)
  const normalizedSlug = normalizeSlugValue(slug)
  return {
    redirect: {
      destination:
        normalizedFullSlug.startsWith('article/') ? `/${normalizedFullSlug}` : `/${normalizedSlug}`,
      permanent: true
    }
  }
}

/**
 * 根据notion的slug访问页面
 * 解析二级目录 /article/about
 * @param {*} props
 * @returns
 */
const PrefixSlug = props => {
  return <Slug {...props} />
}

export function getStaticPaths() {
  if (!BLOG.isProd) {
    return {
      paths: [],
      fallback: true
    }
  }

  return {
    paths: [],
    fallback: 'blocking'
  }
}

export async function getStaticProps({ params: { prefix, slug }, locale }) {
  const fullSlug = prefix + '/' + slug
  const from = `slug-props-${fullSlug}`
  const props = await getGlobalData({ from, locale })
  const normalizedFullSlug = normalizeSlugValue(fullSlug)
  const normalizedSlug = normalizeSlugValue(slug)
  const normalizedPageId = normalizePageId(slug)
  const isUuidLike = /^[0-9a-f]{32}$/i.test(normalizedPageId)
  const slugCandidates = new Set(
    [slug, fullSlug]
      .filter(Boolean)
      .map(normalizeSlugValue)
  )

  // 在列表内查找文章
  props.post = props?.allPages?.find(p => {
    const normalizedPostSlug = normalizeSlugValue(p?.slug)
    const normalizedPostId = normalizePageId(p?.id)

    return (
      slugCandidates.has(normalizedPostSlug) ||
      normalizedPostSlug === normalizedSlug ||
      normalizedPostSlug === normalizedFullSlug ||
      (isUuidLike && normalizedPostId === normalizedPageId)
    )
  })

  if (isUuidLike) {
    if (props.post?.slug) {
      const destination = getCanonicalDestination(locale, props.post.slug)
      const currentPath = getCurrentRoutePath(locale, fullSlug)

      if (destination !== currentPath) {
        return {
          redirect: {
            destination,
            permanent: true
          }
        }
      }

      return {
        redirect: {
          destination: getLocalized404Path(locale),
          permanent: false
        }
      }
    }

    return {
      redirect: {
        destination: getLocalized404Path(locale),
        permanent: false
      }
    }
  }

  // 处理非列表内文章的内信息
  if (!props?.post) {
    const pageId = slug
    if (pageId.length >= 32) {
      const post = await getPost(pageId)
      props.post = post
    }
  }

  if (!props?.post) {
    const defaultLocaleRedirect = getDefaultLocaleRedirect({
      fullSlug,
      slug,
      locale
    })
    if (defaultLocaleRedirect) {
      return defaultLocaleRedirect
    }

    return {
      redirect: {
        destination: getLocalized404Path(locale),
        permanent: false
      }
    }
  }

  await processPostData(props, from)
  return buildStaticPropsResult(props, ISR_CONTENT_REVALIDATE)
}

export default PrefixSlug
