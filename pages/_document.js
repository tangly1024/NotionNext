import Document, { Html, Head, Main, NextScript } from 'next/document'
import BLOG from '@/blog.config'
import ThirdPartyScript from '@/components/ThirdPartyScript'

class MyDocument extends Document {
  static async getInitialProps (ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render () {
    return (
      <Html lang={BLOG.lang}>
        <Head>
          <link rel='icon' href='/favicon.ico' />
          <link rel='icon' href='/favicon.svg' type='image/svg+xml' />
          <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
          <meta property='og:locale' content={BLOG.lang} />
          <meta content={BLOG.darkBackground} name='theme-color' />
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
          <ThirdPartyScript />
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
