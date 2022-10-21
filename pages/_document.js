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
      <Html lang={BLOG.LANG} className='test'>
        <Head>
          <link rel='icon' href='/favicon.ico' />
          <link rel='icon' href='/favicon.svg' type='image/svg+xml' />
          { BLOG.CUSTOM_FONT
            ? BLOG.CUSTOM_FONT_URL?.map(fontUrl =>
                <link href={`${fontUrl}`} key={fontUrl} rel='stylesheet' />)
            : <link href='https://fonts.font.im/css2?family=Noto+Serif+SC&display=swap' rel='stylesheet' /> }
          <CommonScript />
        </Head>

        <body className={'tracking-wider subpixel-antialiased bg-day dark:bg-night'}>
            <Main />
            <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
