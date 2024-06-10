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
        <script
          async
          src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8437419081527400'
          crossorigin='anonymous'></script>
        <meta name='yandex-verification' content='622aa0408012f881' />
        <script src='https://yandex.ru/ads/system/context.js' async></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.yaContextCb = window.yaContextCb || [];
            window.lemonSqueezyAffiliateConfig = { store: "mindset-store" };
          `
          }}
        />
        <script src='https://lmsqueezy.com/affiliate.js' defer></script>
        <script src='https://cdn.jsdelivr.net/gh/Mindset-Community/live2d-widget@latest/autoload.js'></script>
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

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
