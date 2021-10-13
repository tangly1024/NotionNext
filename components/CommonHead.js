import BLOG from '@/blog.config'
import Head from 'next/head'
import ThirdPartyScript from '@/components/ThirdPartyScript'

const CommonHead = ({ meta }) => {
  const url = BLOG.path.length ? `${BLOG.link}/${BLOG.path}` : BLOG.link

  return <Head>
    <title>{meta.title}</title>
    <meta content={BLOG.darkBackground} name='theme-color' />
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
    <meta name='robots' content='follow, index' />
    <meta charSet='UTF-8' />
    {BLOG.seo.googleSiteVerification && (
      <meta
        name='google-site-verification'
        content={BLOG.seo.googleSiteVerification}
      />
    )}
    {BLOG.seo.keywords && (
      <meta name='keywords' content={BLOG.seo.keywords.join(', ')} />
    )}
    <meta name='description' content={meta.description} />
    <meta property='og:locale' content={BLOG.lang} />
    <meta property='og:title' content={meta.title} />
    <meta property='og:description' content={meta.description} />
    <meta
      property='og:url'
      content={meta.slug ? `${url}/${meta.slug}` : url}
    />
    <meta property='og:type' content={meta.type} />
    <meta name='twitter:card' content='summary_large_image' />
    <meta name='twitter:description' content={meta.description} />
    <meta name='twitter:title' content={meta.title} />
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
