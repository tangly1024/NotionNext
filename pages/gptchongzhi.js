import { ISR_LIST_REVALIDATE, buildStaticPropsResult } from '@/lib/cache/revalidate'
import { getGlobalData } from '@/lib/db/getSiteData'

const GptRechargePage = () => {
  return (
    <main className='max-w-4xl mx-auto px-6 py-16 text-gray-800 dark:text-gray-100'>
      <article className='prose prose-lg max-w-none dark:prose-invert'>
        <h1>GPT 充值</h1>
        <p>最后更新于 2026 年 4 月 28 日。</p>
        <p>
          这个页面用于承接 GPT 相关的充值、代充和采购咨询。当前以人工确认方式处理，避免页面展示过期价格或不适用的支付信息。
        </p>

        <h2>可咨询内容</h2>
        <ul>
          <li>GPT 账号充值或代充</li>
          <li>支付方式、处理周期与适用范围</li>
          <li>企业或团队采购需求</li>
        </ul>

        <h2>联系邮箱</h2>
        <p>
          请发送邮件至 <a href='mailto:mail@charliiai.com'>mail@charliiai.com</a>
          ，邮件标题建议注明 “GPT 充值”。
        </p>

        <h2>建议说明的需求</h2>
        <ul>
          <li>所需服务类型和数量</li>
          <li>是否用于个人、团队或项目场景</li>
          <li>你的期望处理时间</li>
        </ul>

        <h2>备注</h2>
        <p>
          本页不承诺固定报价。具体可用方式、价格和交付安排会根据实际需求确认。
        </p>
        <p>
          如需站点合作、广告或其他沟通，也可以前往 <a href='/contact'>Contact</a> 页面。
        </p>
      </article>
    </main>
  )
}

export async function getStaticProps({ locale }) {
  const props = await getGlobalData({ from: 'gpt-recharge-page', locale })

  props.siteInfo = {
    ...props.siteInfo,
    title: 'GPT 充值 | AI博士Charlii',
    description: 'GPT 充值、代充与团队采购咨询入口，统一通过邮件沟通确认。',
    pageCover: '/bg_image.jpg',
    link: 'https://www.charliiai.com/gptchongzhi'
  }

  return buildStaticPropsResult(props, ISR_LIST_REVALIDATE)
}

export default GptRechargePage
