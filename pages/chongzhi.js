import { ISR_LIST_REVALIDATE, buildStaticPropsResult } from '@/lib/cache/revalidate'
import { getGlobalData } from '@/lib/db/getSiteData'

const RechargePage = () => {
  return (
    <main className='max-w-4xl mx-auto px-6 py-16 text-gray-800 dark:text-gray-100'>
      <article className='prose prose-lg max-w-none dark:prose-invert'>
        <h1>ClaudeCode 充值</h1>
        <p>最后更新于 2026 年 4 月 28 日。</p>
        <p>
          这个页面用于承接 ClaudeCode 相关的充值、代充或购买咨询。当前站点不直接展示自动下单组件，具体方案以人工沟通确认为准。
        </p>

        <h2>适合咨询的事项</h2>
        <ul>
          <li>ClaudeCode 账号充值或代充</li>
          <li>适用地区、支付方式与到账时间</li>
          <li>团队采购、长期合作或批量需求</li>
        </ul>

        <h2>联系渠道</h2>
        <p>
          请发送邮件至 <a href='mailto:mail@charliiai.com'>mail@charliiai.com</a>
          ，并在标题中注明 “ClaudeCode 充值”。
        </p>

        <h2>建议附带的信息</h2>
        <ul>
          <li>你的需求类型：个人充值、代充、团队采购</li>
          <li>预计数量或预算范围</li>
          <li>是否有时效要求</li>
        </ul>

        <h2>说明</h2>
        <p>
          为避免误解，价格、汇率、可用渠道与处理时间不在本页固定展示，实际以沟通结果为准。
        </p>
        <p>
          如果你只是想了解站点合作或其他问题，也可以前往 <a href='/contact'>Contact</a> 页面。
        </p>
      </article>
    </main>
  )
}

export async function getStaticProps({ locale }) {
  const props = await getGlobalData({ from: 'claudecode-recharge-page', locale })

  props.siteInfo = {
    ...props.siteInfo,
    title: 'ClaudeCode 充值 | AI博士Charlii',
    description:
      'ClaudeCode 充值、代充与团队采购咨询入口，支持邮件联系与需求说明。',
    pageCover: '/bg_image.jpg',
    link: 'https://www.charliiai.com/chongzhi'
  }

  return buildStaticPropsResult(props, ISR_LIST_REVALIDATE)
}

export default RechargePage
