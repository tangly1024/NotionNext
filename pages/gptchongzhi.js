import { ISR_LIST_REVALIDATE, buildStaticPropsResult } from '@/lib/cache/revalidate'
import { getGlobalData } from '@/lib/db/getSiteData'
import { useRouter } from 'next/router'

const zhContent = {
  eyebrow: 'GPT',
  title: 'GPT 充值咨询',
  description:
    '这个页面用于承接 GPT 相关的充值、代充和采购咨询。当前以人工确认方式处理，避免展示过期价格或不适用的支付信息。',
  itemsTitle: '可咨询内容',
  items: [
    'GPT 账号充值或代充',
    '支付方式、处理周期与适用范围',
    '企业或团队采购需求'
  ],
  infoTitle: '建议说明的需求',
  info: [
    '所需服务类型和数量',
    '是否用于个人、团队或项目场景',
    '你的期望处理时间'
  ],
  noteTitle: '备注',
  note: '本页不承诺固定报价。具体可用方式、价格和交付安排会根据实际需求确认。',
  contactTitle: '主联系邮箱',
  contactText: '请发邮件，并在标题中注明“GPT 充值”。',
  email: 'charliiai2024@gmail.com'
}

const enContent = {
  eyebrow: 'GPT',
  title: 'GPT Recharge Inquiries',
  description:
    'This page handles GPT recharge, assisted purchase, and sourcing inquiries. Details are confirmed manually to avoid showing outdated prices or region-specific payment information.',
  itemsTitle: 'What you can ask about',
  items: [
    'GPT account recharge or assisted purchase',
    'Payment methods, processing cycle, and availability',
    'Business or team purchasing requests'
  ],
  infoTitle: 'Helpful details to include',
  info: [
    'The service type and expected quantity',
    'Whether this is for personal, team, or project use',
    'Your preferred turnaround time'
  ],
  noteTitle: 'Note',
  note: 'No fixed pricing is guaranteed on this page. Available methods, pricing, and delivery timing are confirmed based on the actual request.',
  contactTitle: 'Primary contact email',
  contactText: 'Email us and include “GPT Recharge” in the subject line.',
  email: 'charliiai2024@gmail.com'
}

const GptRechargePage = () => {
  const { locale } = useRouter()
  const isEnglish = locale === 'en-US'
  const content = isEnglish ? enContent : zhContent

  return (
    <main className='px-5 py-10 sm:py-14'>
      <section className='mx-auto max-w-5xl overflow-hidden rounded-[32px] border border-white/60 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.08)]'>
        <div className='bg-[radial-gradient(circle_at_top_left,_rgba(251,146,60,0.18),_transparent_24%),linear-gradient(135deg,_#fffaf5,_#fff1eb_45%,_#f9fafb)] px-6 py-10 sm:px-10 sm:py-12'>
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
              <div className='text-sm font-semibold uppercase tracking-[0.18em] text-amber-300'>
                {content.contactTitle}
              </div>
              <p className='mt-3 text-sm leading-7 text-slate-300'>
                {content.contactText}
              </p>
              <a
                href={`mailto:${content.email}`}
                className='mt-4 inline-block text-2xl font-bold text-white hover:text-amber-300'>
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
  const props = await getGlobalData({ from: 'gpt-recharge-page', locale })

  props.siteInfo = {
    ...props.siteInfo,
    title: locale === 'en-US' ? 'GPT Recharge | CharliiAI' : 'GPT 充值 | AI博士Charlii',
    description:
      locale === 'en-US'
        ? 'GPT recharge and purchasing inquiries handled by email.'
        : 'GPT 充值、代充与团队采购咨询入口，统一通过邮件确认。',
    pageCover: '/images/home.png',
    link: `https://www.charliiai.com${locale === 'en-US' ? '/en-US' : ''}/gptchongzhi`
  }

  return buildStaticPropsResult(props, ISR_LIST_REVALIDATE)
}

export default GptRechargePage
