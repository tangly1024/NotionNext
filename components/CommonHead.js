import { siteConfig } from '@/lib/config'
import Head from 'next/head'

const CommonHead = ({ meta, children }) => {
  let url = siteConfig('PATH')?.length ? `${siteConfig('LINK')}/${siteConfig('SUB_PATH', '')}` : siteConfig('LINK')
  let image
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

export default CommonHead
