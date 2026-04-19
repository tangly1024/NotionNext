const LegalPage = () => {
  return (
    <main className='max-w-4xl mx-auto px-6 py-16 text-gray-800 dark:text-gray-100'>
      <article className='prose prose-lg max-w-none dark:prose-invert'>
        <h1>服务条款</h1>
        <p>最后更新于 2026 年 4 月 16 日。</p>
        <p>
          访问或使用 CharliiAI，即表示你同意遵守本服务条款。如果你不同意这些条款，请停止访问本站。
        </p>

        <h2>内容说明</h2>
        <p>
          本站主要提供 AI 工具、研究工作流、AIGC 与实用指南相关内容。所有内容仅供信息参考，不构成法律、财务或专业建议。
        </p>

        <h2>使用限制</h2>
        <p>
          你不得利用本站进行违法活动、恶意抓取、攻击、传播有害内容，或以其他方式干扰网站正常运行。
        </p>

        <h2>知识产权</h2>
        <p>
          除特别声明外，本站原创内容的著作权归 CharliiAI 所有。转载、引用或二次分发请保留来源并遵守适用法律。
        </p>

        <h2>第三方链接</h2>
        <p>
          站内可能包含第三方链接、工具或服务。第三方站点的内容、政策与可用性不受本站控制，请自行判断风险。
        </p>

        <h2>责任限制</h2>
        <p>
          在适用法律允许范围内，本站不对因使用或无法使用本站内容而造成的直接或间接损失承担责任。
        </p>

        <h2>联系我们</h2>
        <p>
          如对服务条款有任何问题，请发送邮件至
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
        title: '服务条款 | AI博士Charlii',
        description: 'CharliiAI 网站服务条款与使用说明。',
        pageCover: '/bg_image.jpg',
        link: 'https://www.charliiai.com/terms-of-service'
      },
      NOTION_CONFIG: {}
    }
  }
}

export default LegalPage
