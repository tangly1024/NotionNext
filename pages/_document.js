// eslint-disable-next-line @next/next/no-document-import-in-page
import BLOG from '@/blog.config'
import Document, { Head, Html, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang={BLOG.LANG}>
        <Head>
          {/* 预加载字体 */}
          {BLOG.FONT_AWESOME && (
            <>
              <link
                rel='preload'
                href={BLOG.FONT_AWESOME}
                as='style'
                crossOrigin='anonymous'
              />
              <link
                rel='stylesheet'
                href={BLOG.FONT_AWESOME}
                crossOrigin='anonymous'
                referrerPolicy='no-referrer'
              />
            </>
          )}
        </Head>
          {BLOG.FONT_URL?.map((fontUrl, index) => {
            if (fontUrl.endsWith('.css')) {
              return <link key={index} rel="stylesheet" href={fontUrl} />
            } else {
              return <link key={index} rel="preload" href={fontUrl} as="font" type="font/woff2" />
            }
          })}
          <script async src="https://analytics.miaoosi.com/script.js" data-website-id="c0e95e0d-4731-4351-9dec-133805972532"></script>
        </Head>

        <body className={`${BLOG.FONT_STYLE} font-light scroll-smooth`}>
            <Main />
            <NextScript />
        </body>
        </Html>
    )
  }
}

export default MyDocument
