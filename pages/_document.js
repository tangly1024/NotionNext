// eslint-disable-next-line @next/next/no-document-import-in-page
import Document, { Html, Head, Main, NextScript } from 'next/document'
import BLOG from '@/blog.config'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
            <Html lang={BLOG.LANG}>
                <Head>
                <link rel='icon' href= {`${BLOG.BLOG_FAVICON}`} />
                  {/* 预加载字体 */}
                  {BLOG.FONT_AWESOME && <>
                      <link rel='preload' href={BLOG.FONT_AWESOME} as="style" crossOrigin="anonymous" />
                      <link rel="stylesheet" href={BLOG.FONT_AWESOME} crossOrigin="anonymous" referrerPolicy="no-referrer" />
                  </>}

                  {BLOG.FONT_URL?.map((fontUrl, index) => {
                    if (fontUrl.endsWith('.css')) {
                      return <link key={index} rel="stylesheet" href={fontUrl} />
                    } else {
                      return <link key={index} rel="preload" href={fontUrl} as="font" type="font/woff2" />
                    }
                  })}
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
