import BLOG from '@/blog.config'
import Head from 'next/head'

const CommonHead = ({ meta }) => {
  let url = BLOG.path.length ? `${BLOG.link}/${BLOG.path}` : BLOG.link
  if (meta) {
    url = `${url}/${meta.slug}`
  }
  const title = meta?.title || BLOG.title
  const description = meta?.description || BLOG.description
  const type = meta?.type || 'website'
  const keywords = meta?.tags || BLOG.seo.keywords

  return <Head>
    <title>{title}</title>
    <meta name='theme-color' content={BLOG.darkBackground} />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
    <meta name='robots' content='follow, index' />
    <meta charSet='UTF-8' />
    {BLOG.seo.googleSiteVerification && (
      <meta
        name='google-site-verification'
        content={BLOG.seo.googleSiteVerification}
      />
    )}
    {keywords && (
      <meta name='keywords' content={keywords.join(', ')} />
    )}
    <meta name='description' content={description} />
    <meta property='og:locale' content={BLOG.lang} />
    <meta property='og:title' content={title} />
    <meta property='og:description' content={description} />
    <meta property='og:url' content={url}
    />
    <meta property='og:type' content={type} />
    <meta name='twitter:card' content='summary_large_image' />
    <meta name='twitter:description' content={description} />
    <meta name='twitter:title' content={title} />
    {meta.type === 'article' && (
      <>
        <meta
          property='article:published_time'
          content={meta.date || meta.createdTime}
        />
        <meta property='article:author' content={BLOG.author} />
      </>
    )}
  </Head>
}

export default CommonHead
