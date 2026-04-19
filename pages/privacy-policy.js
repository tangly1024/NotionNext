const LegalPage = () => {
  return (
    <main className='max-w-4xl mx-auto px-6 py-16 text-gray-800 dark:text-gray-100'>
      <article className='prose prose-lg max-w-none dark:prose-invert'>
        <h1>隐私政策</h1>
        <p>最后更新于 2026 年 4 月 16 日。</p>
        <p>
          CharliiAI 尊重并保护访问者的隐私。本页面说明本站会收集哪些信息、如何使用这些信息，以及你可以如何联系我们。
        </p>

        <h2>我们收集的信息</h2>
        <p>
          当你浏览本站时，我们可能会收集基础访问数据，例如页面访问、设备类型、浏览器信息、来源页面和站内交互数据。
        </p>
        <p>
          如果你通过邮箱、表单或其他方式主动联系，我们也会保存你主动提供的联系方式和沟通内容。
        </p>

        <h2>信息用途</h2>
        <p>这些信息主要用于内容优化、网站安全、流量分析、广告效果评估，以及回应你的咨询。</p>

        <h2>Cookies 与第三方服务</h2>
        <p>
          本站可能使用 Cookies 以及第三方统计或广告服务，例如 Google Analytics 和 Google AdSense，用于分析访问情况和改进体验。
        </p>

        <h2>信息共享</h2>
        <p>
          除法律要求、站点安全需要或为完成必要服务外，我们不会主动出售你的个人信息。
        </p>

        <h2>联系我们</h2>
        <p>
          如对隐私政策有任何问题，请发送邮件至
          {' '}
          <a href='mailto:mail@charliiai.com'>mail@charliiai.com</a>
          。
        </p>
      </article>
    </main>
  )
}

export function getStaticProps() {
  return {
    props: {
      siteInfo: {
        title: '隐私政策 | AI博士Charlii',
        description: 'CharliiAI 网站隐私政策与数据使用说明。',
        pageCover: '/bg_image.jpg',
        link: 'https://www.charliiai.com/privacy-policy'
      },
      NOTION_CONFIG: {}
    }
  }
}

export default LegalPage
