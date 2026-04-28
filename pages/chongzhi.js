import { ISR_LIST_REVALIDATE, buildStaticPropsResult } from '@/lib/cache/revalidate'
import { getGlobalData } from '@/lib/db/getSiteData'
import { useRouter } from 'next/router'

const zhContent = {
  eyebrow: 'ClaudeCode',
  title: 'ClaudeCode 充值咨询',
  description:
    '这个页面用于承接 ClaudeCode 相关的充值、代充与采购咨询。当前不展示自动下单组件，具体方案以邮件沟通确认为准。',
  itemsTitle: '适合咨询的事项',
  items: [
    'ClaudeCode 账号充值或代充',
    '适用地区、支付方式与到账时间',
    '团队采购、长期合作或批量需求'
  ],
  infoTitle: '建议附带的信息',
  info: [
    '你的需求类型：个人充值、代充、团队采购',
    '预计数量或预算范围',
    '是否有时效要求'
  ],
  noteTitle: '说明',
  note: '价格、汇率、可用渠道与处理时间不会固定展示在页面上，实际以沟通结果为准。',
  contactTitle: '主联系邮箱',
  contactText: '请发邮件并在标题中注明“ClaudeCode 充值”。',
  email: 'charliiai2024@gmail.com'
}

const enContent = {
  eyebrow: 'ClaudeCode',
  title: 'ClaudeCode Recharge Inquiries',
  description:
    'This page handles ClaudeCode recharge, purchase, and sourcing inquiries. No automatic checkout is shown here. Details are confirmed manually by email.',
  itemsTitle: 'Common inquiry topics',
  items: [
    'ClaudeCode account recharge or assisted purchase',
    'Supported regions, payment methods, and processing time',
    'Team orders, long-term collaboration, or bulk demand'
  ],
  infoTitle: 'Helpful details to include',
  info: [
    'Your request type: individual recharge, assisted purchase, or team order',
    'Expected quantity or budget range',
    'Whether there is a timing requirement'
  ],
  noteTitle: 'Note',
  note: 'Prices, exchange rates, available channels, and delivery timing are confirmed during communication rather than fixed on this page.',
  contactTitle: 'Primary contact email',
  contactText: 'Email us and include “ClaudeCode Recharge” in the subject line.',
  email: 'charliiai2024@gmail.com'
}

const RechargePage = () => {
  const { locale } = useRouter()
  const isEnglish = locale === 'en-US'
  const content = isEnglish ? enContent : zhContent

  return (
    <main className='px-5 py-10 sm:py-14'>
      <section className='mx-auto max-w-5xl overflow-hidden rounded-[32px] border border-white/60 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.08)]'>
        <div className='bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.18),_transparent_24%),linear-gradient(135deg,_#f8fbff,_#eef2ff_45%,_#f9fafb)] px-6 py-10 sm:px-10 sm:py-12'>
          <div className='max-w-3xl'>
            <div className='inline-flex rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-600'>
              {content.eyebrow}
            </div>
            <h1 className='mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl'>
              {content.title}
            </h1>
            <p className='mt-5 text-base leading-8 text-slate-600 sm:text-lg'>
              {content.description}
            </p>
          </div>

          <div className='mt-8 grid gap-5 lg:grid-cols-2'>
            <div className='rounded-[28px] border border-slate-200 bg-white p-6'>
              <div className='text-sm font-semibold uppercase tracking-[0.18em] text-slate-500'>
                {content.itemsTitle}
              </div>
              <div className='mt-4 space-y-3'>
                {content.items.map(item => (
                  <div
                    key={item}
                    className='rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-700'>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className='rounded-[28px] border border-slate-200 bg-white p-6'>
              <div className='text-sm font-semibold uppercase tracking-[0.18em] text-slate-500'>
                {content.infoTitle}
              </div>
              <div className='mt-4 space-y-3'>
                {content.info.map(item => (
                  <div
                    key={item}
                    className='rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-700'>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className='mt-8 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]'>
            <div className='rounded-[28px] border border-slate-200 bg-white p-6'>
              <div className='text-sm font-semibold uppercase tracking-[0.18em] text-slate-500'>
                {content.noteTitle}
              </div>
              <p className='mt-3 text-sm leading-7 text-slate-600'>
                {content.note}
              </p>
            </div>

            <div className='rounded-[28px] border border-slate-200 bg-slate-950 p-6 text-white'>
              <div className='text-sm font-semibold uppercase tracking-[0.18em] text-indigo-300'>
                {content.contactTitle}
              </div>
              <p className='mt-3 text-sm leading-7 text-slate-300'>
                {content.contactText}
              </p>
              <a
                href={`mailto:${content.email}`}
                className='mt-4 inline-block text-2xl font-bold text-white hover:text-indigo-300'>
                {content.email}
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export async function getStaticProps({ locale }) {
  const props = await getGlobalData({ from: 'claudecode-recharge-page', locale })

  props.siteInfo = {
    ...props.siteInfo,
    title:
      locale === 'en-US'
        ? 'ClaudeCode Recharge | CharliiAI'
        : 'ClaudeCode 充值 | AI博士Charlii',
    description:
      locale === 'en-US'
        ? 'ClaudeCode recharge and purchasing inquiries handled by email.'
        : 'ClaudeCode 充值、代充与采购咨询入口，统一通过邮件确认。',
    pageCover: '/images/home.png',
    link: `https://www.charliiai.com${locale === 'en-US' ? '/en-US' : ''}/chongzhi`
  }

  return buildStaticPropsResult(props, ISR_LIST_REVALIDATE)
}

export default RechargePage
