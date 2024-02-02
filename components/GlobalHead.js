import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import Head from 'next/head'
import { useRouter } from 'next/router'

/**
 * 页面的Head头，通常有用于SEO
 * @param {*} param0
 * @returns
 */
const GlobalHead = (props) => {
  const { children } = props
  let url = siteConfig('PATH')?.length ? `${siteConfig('LINK')}/${siteConfig('SUB_PATH', '')}` : siteConfig('LINK')
  let image
  const meta = getSEOMeta(props, useRouter(), useGlobal())
  if (meta) {
    url = `${url}/${meta.slug}`
    image = meta.image || '/bg_image.jpg'
  }
  const title = meta?.title || siteConfig('TITLE')
  const description = meta?.description || siteConfig('DESCRIPTION')
  const type = meta?.type || 'website'
  const keywords = meta?.tags || siteConfig('KEYWORDS')
  const lang = siteConfig('LANG').replace('-', '_') // Facebook OpenGraph 要 zh_CN 這樣的格式才抓得到語言
  const category = meta?.category || siteConfig('KEYWORDS') // section 主要是像是 category 這樣的分類，Facebook 用這個來抓連結的分類

  return (
        <Head>
            <title>{title}</title>
            <meta name="theme-color" content={siteConfig('BACKGROUND_DARK')} />
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, minimum-scale=1.0" />
            <meta name="robots" content="follow, index" />
            <meta charSet="UTF-8" />
            {siteConfig('SEO_GOOGLE_SITE_VERIFICATION') && (
                <meta
                    name="google-site-verification"
                    content={siteConfig('SEO_GOOGLE_SITE_VERIFICATION')}
                />
            )}
            {siteConfig('SEO_BAIDU_SITE_VERIFICATION') && (<meta name="baidu-site-verification" content={siteConfig('SEO_BAIDU_SITE_VERIFICATION')} />)}
            <meta name="keywords" content={keywords} />
            <meta name="description" content={description} />
            <meta property="og:locale" content={lang} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={url} />
            <meta property="og:image" content={image} />
            <meta property="og:site_name" content={siteConfig('TITLE')} />
            <meta property="og:type" content={type} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:title" content={title} />

            {siteConfig('COMMENT_WEBMENTION_ENABLE') && (
                <>
                    <link rel="webmention" href={`https://webmention.io/${siteConfig('COMMENT_WEBMENTION_HOSTNAME')}/webmention`} />
                    <link rel="pingback" href={`https://webmention.io/${siteConfig('COMMENT_WEBMENTION_HOSTNAME')}/xmlrpc`} />
                </>
            )}

            {siteConfig('COMMENT_WEBMENTION_ENABLE') && siteConfig('COMMENT_WEBMENTION_AUTH') !== '' && (
                <link href={siteConfig('COMMENT_WEBMENTION_AUTH')} rel="me" />
            )}

            {JSON.parse(siteConfig('ANALYTICS_BUSUANZI_ENABLE')) && <meta name="referrer" content="no-referrer-when-downgrade" />}
            {meta?.type === 'Post' && (
                <>
                    <meta
                        property="article:published_time"
                        content={meta.publishDay}
                    />
                    <meta property="article:author" content={siteConfig('AUTHOR')} />
                    <meta property="article:section" content={category} />
                    <meta property="article:publisher" content={siteConfig('FACEBOOK_PAGE')} />
                </>
            )}
            {children}
        </Head>
  )
}

/**
 * 获取SEO信息
 * @param {*} props
 * @param {*} router
 */
const getSEOMeta = (props, router, global) => {
  const { locale } = global
  const { post, tag, category, page } = props
  const keyword = router?.query?.s

  switch (router.route) {
    case '/':
      return {
        title: `${siteConfig('TITLE')} | ${siteConfig('DESCRIPTION')}`,
        description: siteConfig('DESCRIPTION'),
        image: siteConfig('HOME_BANNER_IMAGE'),
        slug: '',
        type: 'website'
      }
    case '/archive':
      return {
        title: `${locale.NAV.ARCHIVE} | ${siteConfig('TITLE')}`,
        description: siteConfig('DESCRIPTION'),
        image: siteConfig('HOME_BANNER_IMAGE'),
        slug: 'archive',
        type: 'website'
      }
    case '/page/[page]':
      return {
        title: `${page} | Page | ${siteConfig('TITLE')}`,
        description: siteConfig('DESCRIPTION'),
        image: siteConfig('HOME_BANNER_IMAGE'),
        slug: 'page/' + page,
        type: 'website'
      }
    case '/category/[category]':
      return {
        title: `${category} | ${locale.COMMON.CATEGORY} | ${
          siteConfig('TITLE') || ''
        }`,
        description: siteConfig('DESCRIPTION'),
        slug: 'category/' + category,
        image: siteConfig('HOME_BANNER_IMAGE'),
        type: 'website'
      }
    case '/category/[category]/page/[page]':
      return {
        title: `${category} | ${locale.COMMON.CATEGORY} | ${
              siteConfig('TITLE') || ''
            }`,
        description: siteConfig('DESCRIPTION'),
        slug: 'category/' + category,
        image: siteConfig('HOME_BANNER_IMAGE'),
        type: 'website'
      }
    case '/tag/[tag]':
    case '/tag/[tag]/page/[page]':
      return {
        title: `${tag} | ${locale.COMMON.TAGS} | ${siteConfig('TITLE')}`,
        description: siteConfig('DESCRIPTION'),
        image: siteConfig('HOME_BANNER_IMAGE'),
        slug: 'tag/' + tag,
        type: 'website'
      }
    case '/search':
      return {
        title: `${keyword || ''}${keyword ? ' | ' : ''}${locale.NAV.SEARCH} | ${siteConfig('TITLE')}`,
        description: siteConfig('DESCRIPTION'),
        image: siteConfig('HOME_BANNER_IMAGE'),
        slug: 'search',
        type: 'website'
      }
    case '/search/[keyword]':
    case '/search/[keyword]/page/[page]':
      return {
        title: `${keyword || ''}${keyword ? ' | ' : ''}${locale.NAV.SEARCH} | ${siteConfig('TITLE')}`,
        description: siteConfig('TITLE'),
        image: siteConfig('HOME_BANNER_IMAGE'),
        slug: 'search/' + (keyword || ''),
        type: 'website'
      }
    case '/404':
      return { title: `${siteConfig('TITLE')} | 页面找不到啦`, image: siteConfig('HOME_BANNER_IMAGE') }
    case '/tag':
      return {
        title: `${locale.COMMON.TAGS} | ${siteConfig('TITLE')}`,
        description: siteConfig('DESCRIPTION'),
        image: siteConfig('HOME_BANNER_IMAGE'),
        slug: 'tag',
        type: 'website'
      }
    case '/category':
      return {
        title: `${locale.COMMON.CATEGORY} | ${siteConfig('TITLE')}`,
        description: siteConfig('DESCRIPTION'),
        image: siteConfig('HOME_BANNER_IMAGE'),
        slug: 'category',
        type: 'website'
      }
    default:
      return {
        title: post ? `${post?.title} | ${siteConfig('TITLE')}` : `${siteConfig('TITLE')} | loading`,
        description: post?.summary,
        type: post?.type,
        slug: post?.slug,
        image: post?.pageCoverThumbnail || siteConfig('HOME_BANNER_IMAGE'),
        category: post?.category?.[0],
        tags: post?.tags
      }
  }
}

export default GlobalHead
