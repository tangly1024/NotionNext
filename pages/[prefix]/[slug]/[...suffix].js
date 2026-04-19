import BLOG from '@/blog.config'
import { ISR_CONTENT_REVALIDATE, buildStaticPropsResult } from '@/lib/cache/revalidate'
import { getGlobalData, getPost } from '@/lib/db/getSiteData'
import { readSiteContext } from '@/lib/routes/siteContext'
import { processPostData } from '@/lib/utils/post'
import Slug from '..'
import fs from 'fs'
import path from 'path'

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

const readSlugLookup = locale => {
  try {
    const localeKey = locale || 'zh-CN'
    const filePath = path.join(process.cwd(), 'public', `slug-lookup.${localeKey}.json`)
    if (!fs.existsSync(filePath)) {
      return null
    }

    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch (error) {
    console.warn('读取 slug lookup 失败', error)
    return null
  }
}

const getDefaultLocaleRedirect = ({
  fullSlug,
  trailingSegment,
  locale
}) => {
  if (!locale || locale === 'zh-CN') {
    return null
  }

  const normalizedFullSlug = normalizeSlugValue(fullSlug)
  return {
    redirect: {
      destination: `/${normalizedFullSlug}`,
      permanent: true
    }
  }
}

/**
 * 根据notion的slug访问页面
 * 解析三级以上目录 /article/2023/10/29/test
 * @param {*} props
 * @returns
 */
const PrefixSlug = props => {
  return <Slug {...props} />
}

/**
 * 编译渲染页面路径
 * @returns
 */
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

/**
 * 抓取页面数据
 * @param {*} param0
 * @returns
 */
export async function getStaticProps({
  params: { prefix, slug, suffix },
  locale
}) {
  const fullSlug = prefix + '/' + slug + '/' + suffix.join('/')
  const from = `slug-props-${fullSlug}`
  const props = readSiteContext(locale) || (await getGlobalData({ from, locale }))
  const trailingSegment = suffix?.[suffix.length - 1]
  const normalizedTrailingSegment = normalizeSlugValue(trailingSegment)
  const normalizedPageId = normalizePageId(trailingSegment)
  const isUuidLike = /^[0-9a-f]{32}$/i.test(normalizedPageId)
  const slugLookup = readSlugLookup(locale) || {}
  const slugCandidates = new Set(
    [fullSlug, suffix?.[suffix.length - 1]]
      .filter(Boolean)
      .map(normalizeSlugValue)
  )

  // 在列表内查找文章
  props.post = props?.allPages?.find(p => {
    const normalizedPostSlug = normalizeSlugValue(p?.slug)
    const normalizedPostId = normalizePageId(p?.id)

    return (
      slugCandidates.has(normalizedPostSlug) ||
      normalizedPostSlug === normalizedTrailingSegment ||
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
    const fallbackPageId =
      slugLookup[normalizeSlugValue(fullSlug)] || slugLookup[normalizedTrailingSegment]
    if (fallbackPageId) {
      const post = await getPost(fallbackPageId)
      if (post) {
        props.post = post
      }
    }
  }

  if (!props?.post) {
    const pageId = trailingSegment
    if (pageId.length >= 32) {
      const post = await getPost(pageId)
      props.post = post
    }
  }

  if (!props?.post) {
    if (!props?.allPages) {
      const globalProps = await getGlobalData({ from, locale })
      Object.assign(props, globalProps)
      props.post = props?.allPages?.find(p => {
        const normalizedPostSlug = normalizeSlugValue(p?.slug)
        const normalizedPostId = normalizePageId(p?.id)

        return (
          slugCandidates.has(normalizedPostSlug) ||
          normalizedPostSlug === normalizedTrailingSegment ||
          (isUuidLike && normalizedPostId === normalizedPageId)
        )
      })
    }

    const defaultLocaleRedirect = getDefaultLocaleRedirect({
      fullSlug,
      trailingSegment,
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

  if (!props?.allPages) {
    const globalProps = await getGlobalData({ from, locale })
    Object.assign(props, globalProps)
  }

  await processPostData(props, from)
  return buildStaticPropsResult(props, ISR_CONTENT_REVALIDATE)
}

export default PrefixSlug
