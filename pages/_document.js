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
          {/* 流量统计代码 */}
          <script dangerouslySetInnerHTML={{ __html: `
            (function(){
              var fullres = document.createElement('script');
              fullres.async = true;
              // 关键点：这里的 src 指向你的 Cloudflare Worker 代理路径，并包含你的 Site Key 作为文件名部分
              // 域名: fullkaires.985864.xyz
              // 路径: fullkaires
              // Site Key: blog985864
              fullres.src = 'https://fullkaires.985864.xyz/fullkaires/blog985864.js?' + (new Date() - new Date() % 43200000);

              // 关键点：添加 siteKeyOverride 属性，其值就是你的 Site Key
              // 确保 fullres.attributes 对象存在
              fullres.attributes = fullres.attributes || {};
              fullres.attributes.siteKeyOverride = 'blog985864'; // 你的 Site Key

              // 将脚本添加到 head 中
              document.head.appendChild(fullres);
            })();
          `}} />

          {/* FontAwesome已移至FontAwesomeLazy组件中懒加载 */}
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
