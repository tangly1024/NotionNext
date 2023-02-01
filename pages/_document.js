// eslint-disable-next-line @next/next/no-document-import-in-page
import Document, { Html, Head, Main, NextScript } from 'next/document'
import BLOG from '@/blog.config'
import CommonScript from '@/components/CommonScript'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang={BLOG.LANG} className="test">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
          <CommonScript />
          {console.log(this.renderCSS())}
          {this.renderCSS()}
        </Head>
        <body
          className={'tracking-wider subpixel-antialiased bg-day dark:bg-night'}
        >
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }

  renderCSS() {
    if (BLOG.CSS_LIST && BLOG.CSS_LIST.length > 0) {
      return BLOG.CSS_LIST.map((item, index) => {
        return (
          <link rel="stylesheet" key={index + 'stylesheet'} href={item}></link>
        )
      })
    }
  }
}

export default MyDocument
