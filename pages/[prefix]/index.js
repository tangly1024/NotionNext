import BLOG from '@/blog.config'
import useNotification from '@/components/Notification'
import { siteConfig } from '@/lib/config'
import { getGlobalData, getPost } from '@/lib/db/getSiteData'
import { useGlobal } from '@/lib/global'
import { ISR_CONTENT_REVALIDATE, buildStaticPropsResult } from '@/lib/cache/revalidate'
import { getPasswordQuery } from '@/lib/password'
import { processPostData } from '@/lib/utils/post'
import { DynamicLayout } from '@/themes/theme'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { idToUuid } from 'notion-utils'
import { useCallback, useEffect, useState } from 'react'
import fs from 'fs'
import path from 'path'

const OpenWrite = dynamic(() => import('@/components/OpenWrite'), {
  ssr: false
})

const LOCALE_PREFIX_REGEX = /^\/[a-z]{2}(?:-[A-Za-z]{2})?(?=\/|$)/i
const getLocalized404Path = locale =>
  locale && locale !== 'zh-CN' ? `/${locale}/404` : '/404'

const normalizeSlugValue = value =>
  typeof value === 'string'
    ? value.replace(/^\/+|\/+$/g, '').toLowerCase()
    : ''

const getDefaultLocaleRedirect = ({ prefix, locale }) => {
  if (!locale || locale === 'zh-CN') {
    return null
  }
  const normalizedPrefix = normalizeSlugValue(prefix)
  return {
    redirect: {
      destination: `/${normalizedPrefix}`,
      permanent: true
    }
  }
}

const readSlugIndex = locale => {
  try {
    const localeKey = locale || 'zh-CN'
    const filePath = path.join(process.cwd(), 'public', `slug-index.${localeKey}.json`)
    if (!fs.existsSync(filePath)) {
      return null
    }

    const content = fs.readFileSync(filePath, 'utf8')
    return new Set(JSON.parse(content))
  } catch (error) {
    console.warn('读取 slug 索引失败', error)
    return null
  }
}

/**
 * 根据notion的slug访问页面
 * 只解析一级目录例如 /about
 * @param {*} props
 * @returns
 */
const Slug = props => {
  const { post } = props
  const router = useRouter()
  const { locale } = useGlobal()

  // 文章锁🔐
  const [lock, setLock] = useState(post?.password && post?.password !== '')
  const { showNotification, Notification } = useNotification()

  /**
   * 验证文章密码
   * @param {*} passInput
   */
  const validPassword = useCallback(
    async passInput => {
      if (!post) {
        return false
      }
      const { default: md5 } = await import('js-md5')
      const encrypt = md5(post?.slug + passInput)
      if (passInput && encrypt === post?.password) {
        setLock(false)
        localStorage.setItem('password_' + router.asPath, passInput)
        showNotification(locale.COMMON.ARTICLE_UNLOCK_TIPS)
        return true
      }
      return false
    },
    [locale, post, router.asPath, showNotification]
  )

  // 文章加载
  useEffect(() => {
    let cancelled = false

    const tryUnlock = async () => {
      if (post?.password && post?.password !== '') {
        setLock(true)
      } else {
        setLock(false)
      }

      const passInputs = getPasswordQuery(router.asPath)
      if (passInputs.length > 0) {
        for (const passInput of passInputs) {
          const unlocked = await validPassword(passInput)
          if (cancelled) {
            return
          }
          if (unlocked) {
            break
          }
        }
      }
    }

    // 文章加密
    tryUnlock()

    return () => {
      cancelled = true
    }
  }, [post, router.asPath, validPassword])

  props = { ...props, lock, validPassword }
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return (
    <>
      {/* 文章布局 */}
      <DynamicLayout theme={theme} layoutName='LayoutSlug' {...props} />
      {/* 解锁密码提示框 */}
      {post?.password && post?.password !== '' && !lock && <Notification />}
      {/* 导流工具 */}
      <OpenWrite />
    </>
  )
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

export async function getStaticProps({ params: { prefix }, locale }) {
  let fullSlug = prefix
  const normalizedPrefix =
    typeof prefix === 'string'
      ? prefix.replace(/^\/+|\/+$/g, '').toLowerCase()
      : ''
  const normalizedPageId =
    typeof prefix === 'string'
      ? prefix.replace(/-/g, '').trim().toLowerCase()
      : ''
  const isUuidLike = /^[0-9a-f]{32}$/i.test(normalizedPageId)
  const slugIndex = readSlugIndex(locale)

  if (!isUuidLike && slugIndex && normalizedPrefix && !slugIndex.has(normalizedPrefix)) {
    const defaultLocaleRedirect = getDefaultLocaleRedirect({
      prefix,
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

  const from = `slug-props-${fullSlug}`
  const props = await getGlobalData({ from, locale })
  if (siteConfig('PSEUDO_STATIC', false, props.NOTION_CONFIG)) {
    if (!fullSlug.endsWith('.html')) {
      fullSlug += '.html'
    }
  }

  // 在列表内查找文章
  props.post = props?.allPages?.find(p => {
    const normalizedSlug =
      typeof p?.slug === 'string'
        ? p.slug.replace(/^\/+|\/+$/g, '').toLowerCase()
        : ''

    return normalizedSlug === normalizedPrefix || p.id?.replace(/-/g, '').toLowerCase() === normalizedPageId
  })

  if (isUuidLike) {
    if (props.post?.slug) {
      const normalizedSlug = `/${props.post.slug.replace(/^\/+/, '')}`
      const localePrefix =
        locale && locale !== 'zh-CN' && !LOCALE_PREFIX_REGEX.test(normalizedSlug)
          ? `/${locale}`
          : ''

      return {
        redirect: {
          destination: `${localePrefix}${normalizedSlug}`,
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

  // 处理非列表内文章的内信息
  if (!props?.post) {
    const pageId = prefix
    if (pageId.length >= 32) {
      const post = await getPost(pageId)
      props.post = post
    }
  }
  if (!props?.post) {
    const defaultLocaleRedirect = getDefaultLocaleRedirect({
      prefix,
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

export default Slug
